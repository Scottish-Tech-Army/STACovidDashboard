import dashboard from "../pageobjects/dashboardPage";

describe("Covid-19 Dashboard", () => {
  xit("should have correct title", () => {
    dashboard.open();
    let title = "Scottish COVID-19 Statistics";
    expect(browser).toHaveTitle(title);
  });

  xit("should display Logo", () => {
    dashboard.open();
    expect(dashboard.imgLogo).toBeDisplayed();
  });

  xit("should display correct heading title", () => {
    dashboard.open();
    expect(dashboard.headingTitle).toHaveTextContaining(
      "Scottish COVID-19 Statistics"
    );
  });

  xit("should display correct current phase", () => {
    dashboard.open();
    expect(dashboard.currentPhase).toHaveTextContaining("Phase 3");
  });

  xit("Health Board button should be clickable", () => {
    dashboard.open();
    expect(dashboard.healthBoard).toBeClickable();
  });

  xit("council Areas button should be clickable", () => {
    dashboard.open();
    expect(dashboard.councilAreas).toBeClickable();
  });

  xit("Cases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.cases).toBeClickable();
  });

  xit("Deaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.deaths).toBeClickable();
  });

  xit("dailyCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.dailyCases).toBeClickable();
  });

  xit("totalCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.totalCases).toBeClickable();
  });

  xit("dailyDeaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.dailyDeaths).toBeClickable();
  });

  xit("totalDeaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.totalDeaths).toBeClickable();
  });

  xit("percentageCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.percentageCases).toBeClickable();
  });

  // Health Boards
  xit("health board title text and total boards should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    expect(dashboard.healthBoardTitleText).toBeDisplayed();
    expect(dashboard.healthBoardSubheadingCount).toBeDisplayed();
  });

  xit("health board total cases text and total cases count should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.cases.click();
    expect(dashboard.healthBoardTotalCasesText).toBeDisplayed();
    expect(dashboard.healthBoardTotalCasesCount).toBeDisplayed();
  });

  xit("health board total deaths text and total deaths count should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.deaths.click();
    expect(dashboard.healthBoardTotalDeathsText).toBeDisplayed();
    expect(dashboard.healthBoardTotalDeathsCount).toBeDisplayed();
  });

  xit("health board names should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    expect(dashboard.healthBoard01Name).toBeDisplayed();
    expect(dashboard.healthBoard02Name).toBeDisplayed();
    expect(dashboard.healthBoard03Name).toBeDisplayed();
    expect(dashboard.healthBoard04Name).toBeDisplayed();
    expect(dashboard.healthBoard05Name).toBeDisplayed();
    expect(dashboard.healthBoard06Name).toBeDisplayed();
    expect(dashboard.healthBoard07Name).toBeDisplayed();
    expect(dashboard.healthBoard08Name).toBeDisplayed();
    expect(dashboard.healthBoard09Name).toBeDisplayed();
    expect(dashboard.healthBoard10Name).toBeDisplayed();
    expect(dashboard.healthBoard11Name).toBeDisplayed();
    expect(dashboard.healthBoard12Name).toBeDisplayed();
    expect(dashboard.healthBoard13Name).toBeDisplayed();
    expect(dashboard.healthBoard14Name).toBeDisplayed();
  });

  xit("health board cases should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.cases.click();
    expect(dashboard.healthBoard01Count).toHaveTextContaining("1995");
    expect(dashboard.healthBoard02Count).toHaveTextContaining("549");
    expect(dashboard.healthBoard03Count).toHaveTextContaining("464");
    expect(dashboard.healthBoard04Count).toHaveTextContaining("1515");
    expect(dashboard.healthBoard05Count).toHaveTextContaining("1667");
    expect(dashboard.healthBoard06Count).toHaveTextContaining("2485");
    expect(dashboard.healthBoard07Count).toHaveTextContaining("11165");
    expect(dashboard.healthBoard08Count).toHaveTextContaining("747");
    expect(dashboard.healthBoard09Count).toHaveTextContaining("5382");
    expect(dashboard.healthBoard10Count).toHaveTextContaining("5939");
    expect(dashboard.healthBoard11Count).toHaveTextContaining("23");
    expect(dashboard.healthBoard12Count).toHaveTextContaining("60");
    expect(dashboard.healthBoard13Count).toHaveTextContaining("2716");
    expect(dashboard.healthBoard14Count).toHaveTextContaining("53");
  });

  xit("health board deaths should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.deaths.click();
    expect(dashboard.healthBoard01Count).toHaveTextContaining("173");
    expect(dashboard.healthBoard02Count).toHaveTextContaining("40");
    expect(dashboard.healthBoard03Count).toHaveTextContaining("41");
    expect(dashboard.healthBoard04Count).toHaveTextContaining("127");
    expect(dashboard.healthBoard05Count).toHaveTextContaining("133");
    expect(dashboard.healthBoard06Count).toHaveTextContaining("152");
    expect(dashboard.healthBoard07Count).toHaveTextContaining("740");
    expect(dashboard.healthBoard08Count).toHaveTextContaining("66");
    expect(dashboard.healthBoard09Count).toHaveTextContaining("367");
    expect(dashboard.healthBoard10Count).toHaveTextContaining("482");
    expect(dashboard.healthBoard11Count).toHaveTextContaining("1");
    expect(dashboard.healthBoard12Count).toHaveTextContaining("5");
    expect(dashboard.healthBoard13Count).toHaveTextContaining("206");
    expect(dashboard.healthBoard14Count).toHaveTextContaining("0");
  });

  // Council Areas
  xit("council areas title text and total areas should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    expect(dashboard.councilAreasTitleText).toBeDisplayed();
    expect(dashboard.councilAreasSubheadingCount).toBeDisplayed();
  });

  xit("council areas total cases text and total count should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    expect(dashboard.councilAreasTotalCasesText).toBeDisplayed();
    expect(dashboard.councilAreasTotalCasesCount).toBeDisplayed();
  });

  xit("council areas names should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    expect(dashboard.councilArea01Name).toBeDisplayed();
    expect(dashboard.councilArea02Name).toBeDisplayed();
    expect(dashboard.councilArea03Name).toBeDisplayed();
    expect(dashboard.councilArea04Name).toBeDisplayed();
    expect(dashboard.councilArea05Name).toBeDisplayed();
    expect(dashboard.councilArea06Name).toBeDisplayed();
    expect(dashboard.councilArea07Name).toBeDisplayed();
    expect(dashboard.councilArea08Name).toBeDisplayed();
    expect(dashboard.councilArea09Name).toBeDisplayed();
    expect(dashboard.councilArea10Name).toBeDisplayed();
    expect(dashboard.councilArea11Name).toBeDisplayed();
    expect(dashboard.councilArea12Name).toBeDisplayed();
    expect(dashboard.councilArea13Name).toBeDisplayed();
    expect(dashboard.councilArea14Name).toBeDisplayed();
    expect(dashboard.councilArea15Name).toBeDisplayed();
    expect(dashboard.councilArea16Name).toBeDisplayed();
    expect(dashboard.councilArea17Name).toBeDisplayed();
    expect(dashboard.councilArea18Name).toBeDisplayed();
    expect(dashboard.councilArea19Name).toBeDisplayed();
    expect(dashboard.councilArea20Name).toBeDisplayed();
    expect(dashboard.councilArea21Name).toBeDisplayed();
    expect(dashboard.councilArea22Name).toBeDisplayed();
    expect(dashboard.councilArea23Name).toBeDisplayed();
    expect(dashboard.councilArea24Name).toBeDisplayed();
    expect(dashboard.councilArea25Name).toBeDisplayed();
    expect(dashboard.councilArea26Name).toBeDisplayed();
    expect(dashboard.councilArea27Name).toBeDisplayed();
    expect(dashboard.councilArea28Name).toBeDisplayed();
    expect(dashboard.councilArea29Name).toBeDisplayed();
    expect(dashboard.councilArea30Name).toBeDisplayed();
    expect(dashboard.councilArea31Name).toBeDisplayed();
    expect(dashboard.councilArea32Name).toBeDisplayed();
  });

  xit("council areas cases should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    dashboard.cases.click();
    expect(dashboard.councilArea01Count).toHaveTextContaining("1205");
    expect(dashboard.councilArea02Count).toHaveTextContaining("651");
    expect(dashboard.councilArea03Count).toHaveTextContaining("531");
    expect(dashboard.councilArea04Count).toHaveTextContaining("205");
    expect(dashboard.councilArea05Count).toHaveTextContaining("2107");
    expect(dashboard.councilArea06Count).toHaveTextContaining("212");
    expect(dashboard.councilArea07Count).toHaveTextContaining("340");
    expect(dashboard.councilArea08Count).toHaveTextContaining("1138");
    expect(dashboard.councilArea09Count).toHaveTextContaining("512");
    expect(dashboard.councilArea10Count).toHaveTextContaining("656");
    expect(dashboard.councilArea11Count).toHaveTextContaining("337");
    expect(dashboard.councilArea12Count).toHaveTextContaining("504");
    expect(dashboard.councilArea13Count).toHaveTextContaining("759");
    expect(dashboard.councilArea14Count).toHaveTextContaining("1052");
    expect(dashboard.councilArea15Count).toHaveTextContaining("3598");
    expect(dashboard.councilArea16Count).toHaveTextContaining("300");
    expect(dashboard.councilArea17Count).toHaveTextContaining("396");
    expect(dashboard.councilArea18Count).toHaveTextContaining("581");
    expect(dashboard.councilArea19Count).toHaveTextContaining("119");
    expect(dashboard.councilArea20Count).toHaveTextContaining("9");
    expect(dashboard.councilArea21Count).toHaveTextContaining("477");
    expect(dashboard.councilArea22Count).toHaveTextContaining("1762");
    expect(dashboard.councilArea23Count).toHaveTextContaining("17");
    expect(dashboard.councilArea24Count).toHaveTextContaining("541");
    expect(dashboard.councilArea25Count).toHaveTextContaining("891");
    expect(dashboard.councilArea26Count).toHaveTextContaining("424");
    expect(dashboard.councilArea27Count).toHaveTextContaining("57");
    expect(dashboard.councilArea28Count).toHaveTextContaining("483");
    expect(dashboard.councilArea29Count).toHaveTextContaining("1677");
    expect(dashboard.councilArea30Count).toHaveTextContaining("283");
    expect(dashboard.councilArea31Count).toHaveTextContaining("604");
    expect(dashboard.councilArea32Count).toHaveTextContaining("589");
  });

  xit("council areas deaths should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    dashboard.deaths.click();
    expect(dashboard.councilArea01Count).toHaveTextContaining("79");
    expect(dashboard.councilArea02Count).toHaveTextContaining("59");
    expect(dashboard.councilArea03Count).toHaveTextContaining("46");
    expect(dashboard.councilArea04Count).toHaveTextContaining("35");
    expect(dashboard.councilArea05Count).toHaveTextContaining("263");
    expect(dashboard.councilArea06Count).toHaveTextContaining("31");
    expect(dashboard.councilArea07Count).toHaveTextContaining("40");
    expect(dashboard.councilArea08Count).toHaveTextContaining("113");
    expect(dashboard.councilArea09Count).toHaveTextContaining("51");
    expect(dashboard.councilArea10Count).toHaveTextContaining("66");
    expect(dashboard.councilArea11Count).toHaveTextContaining("60");
    expect(dashboard.councilArea12Count).toHaveTextContaining("52");
    expect(dashboard.councilArea13Count).toHaveTextContaining("75");
    expect(dashboard.councilArea14Count).toHaveTextContaining("127");
    expect(dashboard.councilArea15Count).toHaveTextContaining("383");
    expect(dashboard.councilArea16Count).toHaveTextContaining("30");
    expect(dashboard.councilArea17Count).toHaveTextContaining("64");
    expect(dashboard.councilArea18Count).toHaveTextContaining("87");
    expect(dashboard.councilArea19Count).toHaveTextContaining("13");
    expect(dashboard.councilArea20Count).toHaveTextContaining("0");
    expect(dashboard.councilArea21Count).toHaveTextContaining("63");
    expect(dashboard.councilArea22Count).toHaveTextContaining("170");
    expect(dashboard.councilArea23Count).toHaveTextContaining("1");
    expect(dashboard.councilArea24Count).toHaveTextContaining("47");
    expect(dashboard.councilArea25Count).toHaveTextContaining("94");
    expect(dashboard.councilArea26Count).toHaveTextContaining("39");
    expect(dashboard.councilArea27Count).toHaveTextContaining("5");
    expect(dashboard.councilArea28Count).toHaveTextContaining("57");
    expect(dashboard.councilArea29Count).toHaveTextContaining("185");
    expect(dashboard.councilArea30Count).toHaveTextContaining("25");
    expect(dashboard.councilArea31Count).toHaveTextContaining("70");
    expect(dashboard.councilArea32Count).toHaveTextContaining("67");
  });
});
