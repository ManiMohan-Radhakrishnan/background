async function checkNews() {
  console.log("checking news...");

  try {
    const appleDeveloperNewsFeed = "http://35.207.253.185:4001/ping";
    const response = await fetch(appleDeveloperNewsFeed);
    console.log("🚀 ~ checkNews ~ response:", response);

    if (!response.ok) {
      throw new Error("Fetch GET request failed");
    }

    const feed = await response.json();

    let stories = {};

    if (feed.status != "ok") {
      throw new Error("could not download rss to json feed");
    }

    feed.items.map((item) => {
      const textDescription = item.description.replace(/<[^>]*>?/gm, "");
      let teaser = textDescription.substring(0, 25) + "...";
      stories[item.guid] = {
        title: item.title,
        teaser,
        link: item.link,
        publishDate: undefined,
      };
    });

    let newStories = [];
    let existingStories = {};

    const result = CapacitorKV.get("cached_stories");

    if (result && result.value) {
      existingStories = JSON.parse(result.value);
    }

    Object.keys(stories).forEach((key) => {
      if (!existingStories[key]) {
        newStories.push(stories[key]);
        existingStories[key] = stories[key];
      }
    });

    CapacitorKV.set("cached_stories", JSON.stringify(existingStories));

    console.log(`${newStories.length} new stories`);

    if (newStories.length > 0) {
      const latestStory = newStories[0];

      let scheduleDate = new Date();
      scheduleDate.setSeconds(scheduleDate.getSeconds() + 20);

      try {
        CapacitorNotifications.schedule([
          {
            id: 100,
            title: latestStory.title,
            body: latestStory.teaser,
            scheduleAt: scheduleDate,
          },
        ]);

        console.log("news story notification scheduled");
      } catch (err) {
        console.error(`Could not schedule news story notification: ${err}`);
      }
    }
  } catch (err) {
    console.error(`Could not get news stories: ${err}`);
    throw err;
  }
}

addEventListener("updateData", async (resolve, reject, args) => {
  try {
    const results = await Promise.allSettled([checkNews()]);

    const currentTimestamp = Math.floor(Date.now() / 1000);

    let updateLog;

    let updateLogJSON = CapacitorKV.get("update_log");

    if (!updateLogJSON) {
      updateLog = {
        news: [],
        weather: [],
      };
    } else {
      updateLog = JSON.parse(updateLogJSON.value);
    }

    if (results[0].status == "fulfilled") {
      updateLog.weather.push({
        timestamp: currentTimestamp,
        status: "ok",
      });
    } else {
      updateLog.weather.push({
        timestamp: currentTimestamp,
        status: `failed: ${results[0].reason}`,
      });
    }

    if (results[1].status == "fulfilled") {
      updateLog.news.push({
        timestamp: currentTimestamp,
        status: "ok",
      });
    } else {
      updateLog.news.push({
        timestamp: currentTimestamp,
        status: `failed: ${results[1].reason}`,
      });
    }

    CapacitorKV.set("last_updated", currentTimestamp.toString());
    CapacitorKV.set("update_log", JSON.stringify(updateLog));
    resolve();
  } catch (err) {
    console.error(`Could not update data: ${err}`);
    reject(err);
  }
});

addEventListener("getLastUpdated", (resolve, reject, args) => {
  try {
    const result = CapacitorKV.get("last_updated");
    resolve(result);
  } catch (err) {
    console.error(`Could not get last updated timestamp: ${err}`);
    reject(err);
  }
});

addEventListener("fetchTest", async (resolve, reject, args) => {
  // console.log("--> background.runner: Keep-Alive Tick");

  try {
    console.log("--> background.runner: Keep-Alive Tick");

    const res = await fetch("http://35.207.253.185:4001/ping");
    console.log("Response Status:", JSON.stringify(res, null, 2)); // Log status code and status text

    if (!res.ok) {
      throw new Error(`Could not fetch user: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    resolve(result); // Adjust according to your needs
  } catch (err) {
    console.error("Fetch Error:", err);
    reject(err);
  }
});

addEventListener("remoteNotification", (resolve, reject, args) => {
  try {
    console.log("received silent push notification");

    CapacitorNotifications.schedule([
      {
        id: 100,
        title: "Enterprise Background Runner",
        body: "Received silent push notification",
      },
    ]);

    resolve();
  } catch (err) {
    reject();
  }
});
