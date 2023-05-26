import { Route, Request, _electron as electron } from "playwright";
import { test as base, Page, ElectronApplication } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { Feature, FeatureId } from "@ledgerhq/types-live";
import { mock } from "node:test";

export function generateUUID(): string {
  return crypto.randomBytes(16).toString("hex");
}

type TestFixtures = {
  lang: string;
  theme: "light" | "dark" | "no-preference" | undefined;
  userdata: string;
  userdataDestinationPath: string;
  userdataOriginalFile: string;
  userdataFile: any;
  env: Record<string, any>;
  page: Page;
  featureFlags: { [key in FeatureId]?: Feature };
};

const IS_DEBUG_MODE = !!process.env.PWDEBUG;

const test = base.extend<TestFixtures>({
  env: undefined,
  lang: "en-US",
  theme: "dark",
  userdata: undefined,
  featureFlags: undefined,
  userdataDestinationPath: async ({}, use) => {
    use(path.join(__dirname, "../artifacts/userdata", generateUUID()));
  },
  userdataOriginalFile: async ({ userdata }, use) => {
    use(path.join(__dirname, "../userdata/", `${userdata}.json`));
  },
  userdataFile: async ({ userdataDestinationPath }, use) => {
    const fullFilePath = path.join(userdataDestinationPath, "app.json");
    use(fullFilePath);
  },
  page: async (
    {
      lang,
      theme,
      userdata,
      userdataDestinationPath,
      userdataOriginalFile,
      env,
      featureFlags,
    }: TestFixtures,
    use: (page: Page) => void,
  ) => {
    // create userdata path
    fs.mkdirSync(userdataDestinationPath, { recursive: true });

    if (userdata) {
      fs.copyFileSync(userdataOriginalFile, `${userdataDestinationPath}/app.json`);
    }

    // default environment variables
    env = Object.assign(
      {
        ...process.env,
        MOCK: true,
        MOCK_COUNTERVALUES: true,
        HIDE_DEBUG_MOCK: true,
        CI: process.env.CI || undefined,
        PLAYWRIGHT_RUN: true,
        CRASH_ON_INTERNAL_CRASH: true,
        LEDGER_MIN_HEIGHT: 768,
        FEATURE_FLAGS: JSON.stringify(featureFlags),
        DESKTOP_LOGS_FILE: path.join(__dirname, "../artifacts/logs"),
      },
      env,
    );

    // launch app
    const windowSize = { width: 1024, height: 768 };

    const electronApp: ElectronApplication = await electron.launch({
      args: [
        `${path.join(__dirname, "../../.webpack/main.bundle.js")}`,
        `--user-data-dir=${userdataDestinationPath}`,
        // `--window-size=${window.width},${window.height}`, // FIXME: Doesn't work, window size can't be forced?
        "--force-device-scale-factor=1",
        "--disable-dev-shm-usage",
        // "--use-gl=swiftshader"
        "--no-sandbox",
        "--enable-logging",
      ],
      recordVideo: {
        dir: `${path.join(__dirname, "../artifacts/videos/")}`,
        size: windowSize, // FIXME: no default value, it could come from viewport property in conf file but it's not the case
      },
      env,
      colorScheme: theme,
      locale: lang,
      executablePath: require("electron/index.js"),
      timeout: 120000,
    });

    // app is ready
    const page = await electronApp.firstWindow();

    // start process to log network requests
    const requestLogs = path.join(__dirname, "../artifacts/requests.log");

    if (requestLogs) {
      fs.unlink(requestLogs, error => {
        if (error) {
          console.log("could not remove requests.log file");
          return;
        }

        console.log("previous requests.log file removed");
      });
    }

    page.on("response", async data => {
      console.log(data.url());

      const headers = await data.allHeaders();

      console.log({ headers });

      if (headers.teststatus && headers.teststatus === "mocked") {
        console.log(`setting to true`);
        fs.appendFileSync(requestLogs, `MOCKED RESPONSE: ${data.request().url()}\n`);
      } else {
        console.log(`setting to false`);
        fs.appendFileSync(requestLogs, `REAL RESPONSE: ${data.request().url()}\n`);
      }
    });

    // await page.route("**/*", async (route: Route) => {
    //   let mockedResponse = false;

    //   page.on("response", async data => {
    //     console.log(data.url());

    //     const headers = await data.allHeaders();

    //     console.log({ headers });

    //     if (headers.teststatus && headers.teststatus === "mocked") {
    //       mockedResponse = true;
    //       console.log(`setting to true: ${mockedResponse}`);
    //       fs.appendFileSync(
    //         requestLogs,
    //         `${mockedResponse ? "MOCKED" : "REAL"} RESPONSE: ${route?.request().url()}\n`,
    //       );
    //     } else {
    //       // mockedResponse = false;
    //       console.log(`setting to false: ${mockedResponse}`);
    //       fs.appendFileSync(
    //         requestLogs,
    //         `${mockedResponse ? "MOCKED" : "REAL"} RESPONSE: ${route?.request().url()}\n`,
    //       );
    //     }
    //   });
    //   console.log({ mockedResponse });
    //   // console.log(`mockedresponse for ${route.request().url()}:`, mockedResponse);

    //   fs.appendFileSync(
    //     requestLogs,
    //     `${mockedResponse ? "MOCKED" : "REAL"} RESPONSE: ${route?.request().url()}\n`,
    //   );
    //   mockedResponse = false;

    //   route.continue();
    // });

    if (IS_DEBUG_MODE) {
      // Direct Electron console to Node terminal.
      page.on("console", console.log);
    }

    // app is loaded
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("#loader-container", { state: "hidden" });

    // use page in the test
    await use(page);

    // close app
    await electronApp.close();
  },
});

export default test;
