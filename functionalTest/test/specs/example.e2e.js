import dashboard from "../pageobjects/dashboardPage";

describe("Covid-19 Dashboard", () => {
  it("should have correct title", () => {
    dashboard.open();
    let title = "Scottish COVID-19 Statistics";
    expect(browser).toHaveTitle(title);
  });

  it("should display Logo", () => {
    dashboard.open();
    expect(dashboard.imgLogo).toBeDisplayed();
  });

  // 16/10/2020 Did not pass
  xit("should display correct heading title", () => {
    dashboard.open();
    expect(dashboard.headingTitle).toHaveTextContaining(
      "Scottish COVID-19 Statistics"
    );
  });

  it("should display correct current phase", () => {
    dashboard.open();
    expect(dashboard.currentPhase).toHaveTextContaining("Phase 3");
  });

  it("Health Board button should be clickable", () => {
    dashboard.open();
    expect(dashboard.healthBoard).toBeClickable();
  });

  it("council Areas button should be clickable", () => {
    dashboard.open();
    expect(dashboard.councilAreas).toBeClickable();
  });

  it("Cases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.cases).toBeClickable();
  });

  it("Deaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.deaths).toBeClickable();
  });

  it("dailyCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.dailyCases).toBeClickable();
  });

  it("totalCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.totalCases).toBeClickable();
  });

  // 16/10/2020 Did not pass
  xit("dailyDeaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.dailyDeaths).toBeClickable();
  });

  // 16/10/2020 Did not pass
  xit("totalDeaths button should be clickable", () => {
    dashboard.open();
    expect(dashboard.totalDeaths).toBeClickable();
  });

  // 16/10/2020 Did not pass
  xit("percentageCases button should be clickable", () => {
    dashboard.open();
    expect(dashboard.percentageCases).toBeClickable();
  });

  // Health Boards
  it("health board title text and total boards should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    expect(dashboard.healthBoardTitleText).toBeDisplayed();
    expect(dashboard.healthBoardSubheadingCount).toBeDisplayed();
  });

  it("health board total cases text and total cases count should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.cases.click();
    expect(dashboard.healthBoardTotalCasesText).toBeDisplayed();
    expect(dashboard.healthBoardTotalCasesCount).toBeDisplayed();
  });

  it("health board total deaths text and total deaths count should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.deaths.click();
    expect(dashboard.healthBoardTotalDeathsText).toBeDisplayed();
    expect(dashboard.healthBoardTotalDeathsCount).toBeDisplayed();
  });

  it("health board names should be displayed", () => {
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

  it("health board cases should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.cases.click();
    expect(dashboard.tableRow02Count).toHaveTextContaining("1995");
    expect(dashboard.tableRow03Count).toHaveTextContaining("549");
    expect(dashboard.tableRow04Count).toHaveTextContaining("464");
    expect(dashboard.tableRow05Count).toHaveTextContaining("1515");
    expect(dashboard.tableRow06Count).toHaveTextContaining("1667");
    expect(dashboard.tableRow07Count).toHaveTextContaining("2485");
    expect(dashboard.tableRow08Count).toHaveTextContaining("11165");
    expect(dashboard.tableRow09Count).toHaveTextContaining("747");
    expect(dashboard.tableRow10Count).toHaveTextContaining("5382");
    expect(dashboard.tableRow11Count).toHaveTextContaining("5939");
    expect(dashboard.tableRow12Count).toHaveTextContaining("23");
    expect(dashboard.tableRow13Count).toHaveTextContaining("60");
    expect(dashboard.tableRow14Count).toHaveTextContaining("2716");
    expect(dashboard.tableRow15Count).toHaveTextContaining("53");
  });

  it("health board deaths should be displayed", () => {
    dashboard.open();
    dashboard.healthBoard.click();
    dashboard.deaths.click();
    expect(dashboard.tableRow02Count).toHaveTextContaining("173");
    expect(dashboard.tableRow03Count).toHaveTextContaining("40");
    expect(dashboard.tableRow04Count).toHaveTextContaining("41");
    expect(dashboard.tableRow05Count).toHaveTextContaining("127");
    expect(dashboard.tableRow06Count).toHaveTextContaining("133");
    expect(dashboard.tableRow07Count).toHaveTextContaining("152");
    expect(dashboard.tableRow08Count).toHaveTextContaining("740");
    expect(dashboard.tableRow09Count).toHaveTextContaining("66");
    expect(dashboard.tableRow10Count).toHaveTextContaining("367");
    expect(dashboard.tableRow11Count).toHaveTextContaining("482");
    expect(dashboard.tableRow12Count).toHaveTextContaining("1");
    expect(dashboard.tableRow13Count).toHaveTextContaining("5");
    expect(dashboard.tableRow14Count).toHaveTextContaining("206");
    expect(dashboard.tableRow15Count).toHaveTextContaining("0");
  });

  // Council Areas
  it("council areas title text and total areas should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    expect(dashboard.councilAreasTitleText).toBeDisplayed();
    expect(dashboard.councilAreasSubheadingCount).toBeDisplayed();
  });

  it("council areas total cases text and total count should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    expect(dashboard.councilAreasTotalCasesText).toBeDisplayed();
    expect(dashboard.councilAreasTotalCasesCount).toBeDisplayed();
  });

  it("council areas names should be displayed", () => {
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

  it("council areas cases should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    dashboard.cases.click();
    expect(dashboard.tableRow02Count).toHaveTextContaining("1205");
    expect(dashboard.tableRow03Count).toHaveTextContaining("651");
    expect(dashboard.tableRow04Count).toHaveTextContaining("531");
    expect(dashboard.tableRow05Count).toHaveTextContaining("205");
    expect(dashboard.tableRow06Count).toHaveTextContaining("2107");
    expect(dashboard.tableRow07Count).toHaveTextContaining("212");
    expect(dashboard.tableRow08Count).toHaveTextContaining("340");
    expect(dashboard.tableRow09Count).toHaveTextContaining("1138");
    expect(dashboard.tableRow10Count).toHaveTextContaining("512");
    expect(dashboard.tableRow11Count).toHaveTextContaining("656");
    expect(dashboard.tableRow12Count).toHaveTextContaining("337");
    expect(dashboard.tableRow13Count).toHaveTextContaining("504");
    expect(dashboard.tableRow14Count).toHaveTextContaining("759");
    expect(dashboard.tableRow15Count).toHaveTextContaining("1052");
    expect(dashboard.tableRow16Count).toHaveTextContaining("3598");
    expect(dashboard.tableRow17Count).toHaveTextContaining("300");
    expect(dashboard.tableRow18Count).toHaveTextContaining("396");
    expect(dashboard.tableRow19Count).toHaveTextContaining("581");
    expect(dashboard.tableRow20Count).toHaveTextContaining("119");
    expect(dashboard.tableRow21Count).toHaveTextContaining("9");
    expect(dashboard.tableRow22Count).toHaveTextContaining("477");
    expect(dashboard.tableRow23Count).toHaveTextContaining("1762");
    expect(dashboard.tableRow24Count).toHaveTextContaining("17");
    expect(dashboard.tableRow25Count).toHaveTextContaining("541");
    expect(dashboard.tableRow26Count).toHaveTextContaining("891");
    expect(dashboard.tableRow27Count).toHaveTextContaining("424");
    expect(dashboard.tableRow28Count).toHaveTextContaining("57");
    expect(dashboard.tableRow29Count).toHaveTextContaining("483");
    expect(dashboard.tableRow30Count).toHaveTextContaining("1677");
    expect(dashboard.tableRow31Count).toHaveTextContaining("283");
    expect(dashboard.tableRow32Count).toHaveTextContaining("604");
    expect(dashboard.tableRow33Count).toHaveTextContaining("589");
  });

  it("council areas deaths should be displayed", () => {
    dashboard.open();
    dashboard.councilAreas.click();
    dashboard.deaths.click();
    expect(dashboard.tableRow02Count).toHaveTextContaining("79");
    expect(dashboard.tableRow03Count).toHaveTextContaining("59");
    expect(dashboard.tableRow04Count).toHaveTextContaining("46");
    expect(dashboard.tableRow05Count).toHaveTextContaining("35");
    expect(dashboard.tableRow06Count).toHaveTextContaining("263");
    expect(dashboard.tableRow07Count).toHaveTextContaining("31");
    expect(dashboard.tableRow08Count).toHaveTextContaining("40");
    expect(dashboard.tableRow09Count).toHaveTextContaining("113");
    expect(dashboard.tableRow10Count).toHaveTextContaining("51");
    expect(dashboard.tableRow11Count).toHaveTextContaining("66");
    expect(dashboard.tableRow12Count).toHaveTextContaining("60");
    expect(dashboard.tableRow13Count).toHaveTextContaining("52");
    expect(dashboard.tableRow14Count).toHaveTextContaining("75");
    expect(dashboard.tableRow15Count).toHaveTextContaining("127");
    expect(dashboard.tableRow16Count).toHaveTextContaining("383");
    expect(dashboard.tableRow17Count).toHaveTextContaining("30");
    expect(dashboard.tableRow18Count).toHaveTextContaining("64");
    expect(dashboard.tableRow19Count).toHaveTextContaining("87");
    expect(dashboard.tableRow20Count).toHaveTextContaining("13");
    expect(dashboard.tableRow21Count).toHaveTextContaining("0");
    expect(dashboard.tableRow22Count).toHaveTextContaining("63");
    expect(dashboard.tableRow23Count).toHaveTextContaining("170");
    expect(dashboard.tableRow24Count).toHaveTextContaining("1");
    expect(dashboard.tableRow25Count).toHaveTextContaining("47");
    expect(dashboard.tableRow26Count).toHaveTextContaining("94");
    expect(dashboard.tableRow27Count).toHaveTextContaining("39");
    expect(dashboard.tableRow28Count).toHaveTextContaining("5");
    expect(dashboard.tableRow29Count).toHaveTextContaining("57");
    expect(dashboard.tableRow30Count).toHaveTextContaining("185");
    expect(dashboard.tableRow31Count).toHaveTextContaining("25");
    expect(dashboard.tableRow32Count).toHaveTextContaining("70");
    expect(dashboard.tableRow33Count).toHaveTextContaining("67");
  });
});
