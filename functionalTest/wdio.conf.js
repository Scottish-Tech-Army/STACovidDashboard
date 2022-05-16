exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: "local",
  // ==================
  // Specify Test Files
  // ==================
  specs: ["./test/specs/**/*.js"],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  // ============
  // Capabilities
  // ============
  maxInstances: 10,
  capabilities: [
    {
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      maxInstances: 1,
      //
      browserName: "chrome",
      "goog:chromeOptions": {
        // to run chrome headless the following flags are required
        args: [
          "--headless",
          "--disable-gpu",
          "--window-size=1000,1080",
          "--enable-logging=stderr",
          "--log-level=0",
          "--v=1",
          "--remote-debugging-port=9222",
        ],
      },
      acceptInsecureCerts: true,
      //outputDir: "outputlogs",
      // If outputDir is provided WebdriverIO can capture driver session logs
      // it is possible to configure which logTypes to include/exclude.
      // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
      // excludeDriverLogs: ['bugreport', 'server'],
    },
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "warn",
  bail: 0,
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // baseUrl: 'https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com',
  baseUrl: "http://localhost:3000",
  //"https://covid19.scottishtecharmy.org",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [["chromedriver"]],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "mocha",
  //
  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "./test-report",
        outputFileFormat: function (options) {
          // optional
          return `results-${options.cid}.xml`;
        },
      },
    ],
  ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: "bdd",
    require: ["js:@babel/register"],
    timeout: 120000,
  },
  // =====
  // Hooks
  // =====
  before: function (capabilities, specs) {
    require("@babel/register");
  },
};
