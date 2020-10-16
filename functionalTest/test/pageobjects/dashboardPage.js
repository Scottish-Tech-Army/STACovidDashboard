import Page from "./page";

/**
 * dashboard page containing specific selectors and methods for a page
 */
class DashboardPage extends Page {
  get imgLogo() {
    return $('img[id="logo"]');
  }
  // Header
  get headingTitle() {
    return $('[class="heading heading-title"] ');
  }
  // Current phase banner
  get currentPhase() {
    return $('[class="current-phase col-12"] ');
  }
  // Totals cards
  get dailyCases() {
    return $("#dailyCases");
  }
  get totalCases() {
    return $("#totalCases");
  }
  get dailyDeaths() {
    return $("#dailyDeaths");
  }
  get totalDeaths() {
    return $("#totalDeaths");
  }
  get percentageCases() {
    return $("#percentageCases");
  }
  // Heatmap selector
  // Health Boards
  get healthBoard() {
    return $("#healthBoards");
  }
  get healthBoardTitleText() {
    return $("//div[text()='HEALTH BOARDS']");
  }
  get healthBoardSubheadingCount() {
    return $("//div[@class='subheading'][text()='14 Boards']");
  }
  get healthBoardTotalCasesText() {
    return $("//div[text()='TOTAL CASES']");
  }
  get healthBoardTotalCasesCount() {
    return $("//div[@class='subheading'][text()='34760']");
  }
  get healthBoardTotalDeathsText() {
    return $("//div[text()='TOTAL DEATHS']");
  }
  get healthBoardTotalDeathsCount() {
    return $("//div[@class='subheading'][text()='2533']");
  }
  get healthBoard01Name() {
    return $("//td[text()='Ayrshire & Arran']");
  }
  get healthBoard02Name() {
    return $("//td[text()='Borders']");
  }
  get healthBoard03Name() {
    return $("//td[text()='Dumfries & Galloway']");
  }
  get healthBoard04Name() {
    return $("//td[text()='Fife']");
  }
  get healthBoard05Name() {
    return $("//td[text()='Forth Valley']");
  }
  get healthBoard06Name() {
    return $("//td[text()='Grampian']");
  }
  get healthBoard07Name() {
    return $("//td[text()='Greater Glasgow & Clyde']");
  }
  get healthBoard08Name() {
    return $("//td[text()='Highland']");
  }
  get healthBoard09Name() {
    return $("//td[text()='Lanarkshire']");
  }
  get healthBoard10Name() {
    return $("//td[text()='Lothian']");
  }
  get healthBoard11Name() {
    return $("//td[text()='Orkney']");
  }
  get healthBoard12Name() {
    return $("//td[text()='Shetland']");
  }
  get healthBoard13Name() {
    return $("//td[text()='Tayside']");
  }
  get healthBoard14Name() {
    return $("//td[text()='Western Isles']");
  }
  get healthBoard01Count() {
    return $("//tbody/tr[2]/td[2]");
  }
  get healthBoard02Count() {
    return $("//tbody/tr[3]/td[2]");
  }
  get healthBoard03Count() {
    return $("//tbody/tr[4]/td[2]");
  }
  get healthBoard04Count() {
    return $("//tbody/tr[5]/td[2]");
  }
  get healthBoard05Count() {
    return $("//tbody/tr[6]/td[2]");
  }
  get healthBoard06Count() {
    return $("//tbody/tr[7]/td[2]");
  }
  get healthBoard07Count() {
    return $("//tbody/tr[8]/td[2]");
  }
  get healthBoard08Count() {
    return $("//tbody/tr[9]/td[2]");
  }
  get healthBoard09Count() {
    return $("//tbody/tr[10]/td[2]");
  }
  get healthBoard10Count() {
    return $("//tbody/tr[11]/td[2]");
  }
  get healthBoard11Count() {
    return $("//tbody/tr[12]/td[2]");
  }
  get healthBoard12Count() {
    return $("//tbody/tr[13]/td[2]");
  }
  get healthBoard13Count() {
    return $("//tbody/tr[14]/td[2]");
  }
  get healthBoard14Count() {
    return $("//tbody/tr[15]/td[2]");
  }
  // Council Areas
  get councilAreas() {
    return $("#councilAreas");
  }
  get councilAreasTitleText() {
    return $("//div[text()='COUNCIL AREAS']");
  }
  get councilAreasSubheadingCount() {
    return $("//div[@class='subheading'][text()='32 Areas']");
  }
  get councilAreasTotalCasesText() {
    return $("//div[text()='TOTAL CASES']");
  }
  get councilAreasTotalCasesCount() {
    return $("//div[@class='subheading'][text()='23017']");
  }
  get councilArea01Name() {
    return $("//td[text()='Aberdeen City']");
  }
  get councilArea02Name() {
    return $("//td[text()='Aberdeenshire']");
  }
  get councilArea03Name() {
    return $("//td[text()='Angus']");
  }
  get councilArea04Name() {
    return $("//td[text()='Argyll & Bute']");
  }
  get councilArea05Name() {
    return $("//td[text()='City of Edinburgh']");
  }
  get councilArea06Name() {
    return $("//td[text()='Clackmannanshire']");
  }
  get councilArea07Name() {
    return $("//td[text()='Dumfries & Galloway']");
  }
  get councilArea08Name() {
    return $("//td[text()='Dundee City']");
  }
  get councilArea09Name() {
    return $("//td[text()='East Ayrshire']");
  }
  get councilArea10Name() {
    return $("//td[text()='East Dunbartonshire']");
  }
  get councilArea11Name() {
    return $("//td[text()='East Lothian']");
  }
  get councilArea12Name() {
    return $("//td[text()='East Renfrewshire']");
  }
  get councilArea13Name() {
    return $("//td[text()='Falkirk']");
  }
  get councilArea14Name() {
    return $("//td[text()='Fife']");
  }
  get councilArea15Name() {
    return $("//td[text()='Glasgow City']");
  }
  get councilArea16Name() {
    return $("//td[text()='Highland']");
  }
  get councilArea17Name() {
    return $("//td[text()='Inverclyde']");
  }
  get councilArea18Name() {
    return $("//td[text()='Midlothian']");
  }
  get councilArea19Name() {
    return $("//td[text()='Moray']");
  }
  get councilArea20Name() {
    return $("//td[text()='Na h-Eileanan Siar']");
  }
  get councilArea21Name() {
    return $("//td[text()='North Ayrshire']");
  }
  get councilArea22Name() {
    return $("//td[text()='North Lanarkshire']");
  }
  get councilArea23Name() {
    return $("//td[text()='Orkney Islands']");
  }
  get councilArea24Name() {
    return $("//td[text()='Perth & Kinross']");
  }
  get councilArea25Name() {
    return $("//td[text()='Renfrewshire']");
  }
  get councilArea26Name() {
    return $("//td[text()='Scottish Borders']");
  }
  get councilArea27Name() {
    return $("//td[text()='Shetland Islands']");
  }
  get councilArea28Name() {
    return $("//td[text()='South Ayrshire']");
  }
  get councilArea29Name() {
    return $("//td[text()='South Lanarkshire']");
  }
  get councilArea30Name() {
    return $("//td[text()='Stirling']");
  }
  get councilArea31Name() {
    return $("//td[text()='West Dunbartonshire']");
  }
  get councilArea32Name() {
    return $("//td[text()='West Lothian']");
  }
  get councilArea01Count() {
    return $("//tbody/tr[2]/td[2]");
  }
  get councilArea02Count() {
    return $("//tbody/tr[3]/td[2]");
  }
  get councilArea03Count() {
    return $("//tbody/tr[4]/td[2]");
  }
  get councilArea04Count() {
    return $("//tbody/tr[5]/td[2]");
  }
  get councilArea05Count() {
    return $("//tbody/tr[6]/td[2]");
  }
  get councilArea06Count() {
    return $("//tbody/tr[7]/td[2]");
  }
  get councilArea07Count() {
    return $("//tbody/tr[8]/td[2]");
  }
  get councilArea08Count() {
    return $("//tbody/tr[9]/td[2]");
  }
  get councilArea09Count() {
    return $("//tbody/tr[10]/td[2]");
  }
  get councilArea10Count() {
    return $("//tbody/tr[11]/td[2]");
  }
  get councilArea11Count() {
    return $("//tbody/tr[12]/td[2]");
  }
  get councilArea12Count() {
    return $("//tbody/tr[13]/td[2]");
  }
  get councilArea13Count() {
    return $("//tbody/tr[14]/td[2]");
  }
  get councilArea14Count() {
    return $("//tbody/tr[15]/td[2]");
  }
  get councilArea15Count() {
    return $("//tbody/tr[16]/td[2]");
  }
  get councilArea16Count() {
    return $("//tbody/tr[17]/td[2]");
  }
  get councilArea17Count() {
    return $("//tbody/tr[18]/td[2]");
  }
  get councilArea18Count() {
    return $("//tbody/tr[19]/td[2]");
  }
  get councilArea19Count() {
    return $("//tbody/tr[20]/td[2]");
  }
  get councilArea20Count() {
    return $("//tbody/tr[21]/td[2]");
  }
  get councilArea21Count() {
    return $("//tbody/tr[22]/td[2]");
  }
  get councilArea22Count() {
    return $("//tbody/tr[23]/td[2]");
  }
  get councilArea23Count() {
    return $("//tbody/tr[24]/td[2]");
  }
  get councilArea24Count() {
    return $("//tbody/tr[25]/td[2]");
  }
  get councilArea25Count() {
    return $("//tbody/tr[26]/td[2]");
  }
  get councilArea26Count() {
    return $("//tbody/tr[27]/td[2]");
  }
  get councilArea27Count() {
    return $("//tbody/tr[28]/td[2]");
  }
  get councilArea28Count() {
    return $("//tbody/tr[29]/td[2]");
  }
  get councilArea29Count() {
    return $("//tbody/tr[30]/td[2]");
  }
  get councilArea30Count() {
    return $("//tbody/tr[31]/td[2]");
  }
  get councilArea31Count() {
    return $("//tbody/tr[32]/td[2]");
  }
  get councilArea32Count() {
    return $("//tbody/tr[33]/td[2]");
  } // Cases & Deaths buttons
  get cases() {
    return $("#cases");
  }
  get deaths() {
    return $("#deaths");
  }
  /**
   * open base URL
   */
  open() {
    return super.open();
  }
}

export default new DashboardPage();
