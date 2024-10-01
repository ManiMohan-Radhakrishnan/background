import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.capacitorjs.background.testapp",
  appName: "background-runner-testapp",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    BackgroundRunner: {
      label: "com.capacitorjs.background.testapp.task",
      src: "runner/background.js",
      event: "fetchTest",
      repeat: true,
      interval: 10000,
      autoStart: true,
    },
  },
};

export default config;
