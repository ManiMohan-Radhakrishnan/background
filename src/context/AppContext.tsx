// import { createContext, useContext, useEffect, useState } from "react";
// import { App } from "@capacitor/app";
// import { BackgroundRunner } from "@capacitor/background-runner";

// // Define interfaces for your data structures
// export interface UpdateLogEntry {
//   timestamp: number;
//   status: string;
// }

// export interface UpdateLog {
//   news: UpdateLogEntry[];
//   weather: UpdateLogEntry[];
// }

// export interface WeatherCondition {
//   location: string;
//   temp: number;
//   condition: string;
//   conditionIcon: string;
// }

// export interface NewsStory {
//   title: string;
//   teaser: string;
//   link: string;
//   publishDate?: Date;
// }

// interface NewsStories {
//   [key: string]: NewsStory;
// }

// interface AppContextProps {
//   conditions: WeatherCondition;
//   stories: NewsStories;
//   log: UpdateLog;
//   lastUpdated?: Date;
//   hasPermissions: boolean;
//   user: any; // Define user type if known

//   update: () => Promise<any>;
//   requestPermissions: () => Promise<void>;
//   dispatchBackgroundEvent: () => Promise<void>;
//   setUser: (userData: any) => void; // Function to update user
// }

// interface AppProviderProps {
//   children?: React.ReactNode;
// }

// const emptyUpdateLog: UpdateLog = {
//   news: [],
//   weather: [],
// };

// const defaultCondition: WeatherCondition = {
//   location: "---",
//   temp: 0,
//   condition: "---",
//   conditionIcon: "",
// };

// // Initialize context with default values
// export const AppContext = createContext<AppContextProps>({
//   conditions: defaultCondition,
//   stories: {},
//   log: emptyUpdateLog,
//   lastUpdated: undefined,
//   hasPermissions: false,
//   user: null, // Default user state
//   update: () => Promise.reject(),
//   dispatchBackgroundEvent: () => Promise.reject(),
//   requestPermissions: () => Promise.reject(),
//   setUser: () => {}, // Default function for setUser
// });

// // Main AppProvider component
// export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
//   const [conditions, setConditions] =
//     useState<WeatherCondition>(defaultCondition);
//   const [stories, setStories] = useState<NewsStories>({});
//   const [log, setLog] = useState<UpdateLog>(emptyUpdateLog);
//   const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
//   const [hasPermissions, setHasPermissions] = useState<boolean>(false);
//   const [user, setUser] = useState<any>(null); // State to hold user data

//   const update = async (): Promise<any> => {
//     await Promise.all([performBackgroundFetch()]);

//     const result = await BackgroundRunner.dispatchEvent<{ value: string }>({
//       event: "getLastUpdated",
//       label: "com.capacitorjs.background.testapp.task",
//       details: {
//         currentDate: new Date(),
//       },
//     });

//     console.log("🚀 ~ update ~ result:", result);

//     if (result && result.value) {
//       const timestamp = parseInt(result.value);
//       const timestampDate = new Date(timestamp * 1000);
//       setLastUpdated(timestampDate);
//     } else {
//       console.warn("No value for key 'last_updated'");
//     }
//   };

//   const requestPermissions = async () => {
//     const permissions = await BackgroundRunner.requestPermissions({
//       apis: ["geolocation", "notifications"],
//     });

//     if (
//       permissions.geolocation === "granted" &&
//       permissions.notifications === "granted"
//     ) {
//       setHasPermissions(true);
//     }
//   };

//   const checkPermissions = async () => {
//     const permissions = await BackgroundRunner.checkPermissions();
//     if (
//       permissions.geolocation === "granted" &&
//       permissions.notifications === "granted"
//     ) {
//       setHasPermissions(true);
//     }
//   };

//   const dispatchBackgroundEvent = async () => {
//     try {
//       await BackgroundRunner.dispatchEvent({
//         event: "updateData",
//         label: "com.capacitorjs.background.testapp.task",
//         details: {},
//       });

//       update();
//     } catch (err) {
//       console.error(`Dispatch error: ${err}`);
//     }
//   };

//   const performBackgroundFetch = async () => {
//     try {
//       const result = await BackgroundRunner.dispatchEvent({
//         label: "com.capacitor.background.check",
//         event: "fetchTest",
//         details: {},
//       });

//       console.log(
//         "🚀 ~ performBackgroundFetch ~ result:",
//         JSON.stringify(result, null, 2)
//       );

//       // Update user state based on the fetched result
//       setUser(result);
//     } catch (error) {
//       console.error("Error fetching background data:", error);
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       performBackgroundFetch();
//     }, 2000); // Perform background fetch every 2 seconds

//     checkPermissions();
//     update();

//     // Add resume listener to handle when the app returns to the foreground
//     const resumeListener = App.addListener("resume", () => {
//       clearInterval(intervalId);
//       console.log("🚀 ~ App resumed");
//       setInterval(() => {
//         performBackgroundFetch();
//       }, 2000);
//     });

//     // Add pause listener to handle when the app goes into the background
//     const pauseListener = App.addListener("pause", () => {
//       console.log("🚀 ~ App paused");
//       clearInterval(intervalId);
//       setInterval(() => {
//         performBackgroundFetch();
//       }, 2000); // Dispatch background event
//       //  runner(); // Execute the background runner logic
//     });

//     // App state change listener to detect foreground/background transitions
//     const appStateListener = App.addListener("appStateChange", (appState) => {
//       if (appState.isActive) {
//         clearInterval(intervalId);
//         console.log("🚀 ~ App in foreground");
//         setInterval(() => {
//           performBackgroundFetch();
//         }, 2000);
//       } else {
//         clearInterval(intervalId);
//         setInterval(() => {
//           performBackgroundFetch();
//         }, 2000);
//         // Run background event
//         console.log("🚀 ~ App in background");
//       }
//     });

//     // Cleanup function
//     return () => {
//       resumeListener.remove();
//       pauseListener.remove();
//       appStateListener.remove();
//       clearInterval(intervalId);
//     };
//   }, []);

//   return (
//     <AppContext.Provider
//       value={{
//         conditions,
//         stories,
//         log,
//         lastUpdated,
//         hasPermissions,
//         user, // Provide user state
//         update,
//         requestPermissions,
//         dispatchBackgroundEvent,
//         setUser, // Provide setUser function
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// // Custom hook for using AppContext
// export const useApp = () => useContext(AppContext);

import { createContext, useContext, useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { BackgroundRunner } from "@capacitor/background-runner";

// Define interfaces for your data structures
export interface UpdateLogEntry {
  timestamp: number;
  status: string;
}

export interface UpdateLog {
  news: UpdateLogEntry[];
  weather: UpdateLogEntry[];
}

export interface WeatherCondition {
  location: string;
  temp: number;
  condition: string;
  conditionIcon: string;
}

export interface NewsStory {
  title: string;
  teaser: string;
  link: string;
  publishDate?: Date;
}

interface NewsStories {
  [key: string]: NewsStory;
}

interface AppContextProps {
  conditions: WeatherCondition;
  stories: NewsStories;
  log: UpdateLog;
  lastUpdated?: Date;
  hasPermissions: boolean;
  user: any; // Define user type if known

  // update: () => Promise<any>;
  requestPermissions: () => Promise<void>;
  // dispatchBackgroundEvent: () => Promise<void>;
  setUser: (userData: any) => void; // Function to update user
}

interface AppProviderProps {
  children?: React.ReactNode;
}

const emptyUpdateLog: UpdateLog = {
  news: [],
  weather: [],
};

const defaultCondition: WeatherCondition = {
  location: "---",
  temp: 0,
  condition: "---",
  conditionIcon: "",
};

// Initialize context with default values
export const AppContext = createContext<AppContextProps>({
  conditions: defaultCondition,
  stories: {},
  log: emptyUpdateLog,
  lastUpdated: undefined,
  hasPermissions: false,
  user: null, // Default user state
  // update: () => Promise.reject(),
  // dispatchBackgroundEvent: () => Promise.reject(),
  requestPermissions: () => Promise.reject(),
  setUser: () => {}, // Default function for setUser
});

export interface User {
  id: string;
  name: string;
  email: string;
  // Other user properties
}

// Main AppProvider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [conditions, setConditions] =
    useState<WeatherCondition>(defaultCondition);
  const [stories, setStories] = useState<NewsStories>({});
  const [log, setLog] = useState<UpdateLog>(emptyUpdateLog);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // State to hold user data

  // Log the user object
  console.log("🚀 ~ setUser:", user); // Log user directly

  // const update = async (): Promise<any> => {
  //   await Promise.all([performBackgroundFetch()]);

  //   const result = await BackgroundRunner.dispatchEvent<{ value: string }>({
  //     event: "getLastUpdated",
  //     label: "com.capacitorjs.background.testapp.task",
  //     details: {
  //       currentDate: new Date(),
  //     },
  //   });

  //   console.log("🚀 ~ update ~ result:", result);

  //   if (result && result.value) {
  //     const timestamp = parseInt(result.value);
  //     const timestampDate = new Date(timestamp * 1000);
  //     setLastUpdated(timestampDate);
  //   } else {
  //     console.warn("No value for key 'last_updated'");
  //   }
  // };

  const requestPermissions = async () => {
    const permissions = await BackgroundRunner.requestPermissions({
      apis: ["geolocation", "notifications"],
    });

    if (
      permissions.geolocation === "granted" &&
      permissions.notifications === "granted"
    ) {
      setHasPermissions(true);
    }
  };

  const checkPermissions = async () => {
    const permissions = await BackgroundRunner.checkPermissions();
    if (
      permissions.geolocation === "granted" &&
      permissions.notifications === "granted"
    ) {
      setHasPermissions(true);
    }
  };

  // const dispatchBackgroundEvent = async () => {
  //   try {
  //     await BackgroundRunner.dispatchEvent({
  //       event: "updateData",
  //       label: "com.capacitorjs.background.testapp.task",
  //       details: {},
  //     });

  //     // update();
  //   } catch (err) {
  //     console.error(`Dispatch error: ${err}`);
  //   }
  // };

  const performBackgroundFetch = async () => {
    console.log("🚀 ~ performBackgroundFetch ~ dispatchResult: called");

    try {
      const dispatchResult = (await BackgroundRunner.dispatchEvent({
        label: "com.capacitorjs.background.testapp.task",
        event: "fetchTest",
        details: { user: user },
      })) as User; // Type assertion
      console.log(
        "dispatchResult Result:",
        JSON.stringify(dispatchResult, null, 2)
      ); // Log the formatted JSON string

      setUser(dispatchResult);
    } catch (error) {
      console.error("Error fetching background data:", error);
    }
  };

  useEffect(() => {
    checkPermissions();
    // update(); // Initial data fetch on mount

    // Setup the interval to fetch data every 60 seconds
    const fetchInterval = setInterval(() => {
      performBackgroundFetch(); // Fetch background data every 60 seconds
    }, 10000);

    const appStateListener = App.addListener("appStateChange", (appState) => {
      if (appState.isActive) {
        console.log("🚀 ~ App in foreground");
        performBackgroundFetch(); // Fetch data when the app is active
      } else {
        console.log("🚀 ~ App in background");
        // Trigger background fetch when app goes to background
        performBackgroundFetch();
      }
    });

    // Cleanup function: No need to remove listeners since we want them to persist
    return () => {
      // appStateListener.remove();
      clearInterval(fetchInterval); // Clear the interval on unmount
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        conditions,
        stories,
        log,
        lastUpdated,
        hasPermissions,
        user, // Provide user state
        // update,
        requestPermissions,
        // dispatchBackgroundEvent,
        setUser, // Provide setUser function
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using AppContext
export const useApp = () => useContext(AppContext);
