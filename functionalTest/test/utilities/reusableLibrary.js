import dashboard from "../pageobjects/dashboardPage";

class reusableLibrary {
  calculatePercent(fromDate, toDate, factor) {
    var d1 = new Date(fromDate);
    var d2 = new Date(toDate);
    let days = (d2 - d1) / 86400000;
    let perDayFactor = 100 / days;
    let interval = 1;
    var weekOrMonth = factor.charAt(1);
    let numrOfWeekOrMonth = factor.charAt(0);
    let letMonthCorrectionFactor = 0;
    if (weekOrMonth == "W") {
      interval = 7;
    } else if (weekOrMonth == "Y") {
      interval = 365;
    } else {
      if (numrOfWeekOrMonth > 1) {
        letMonthCorrectionFactor =
          numrOfWeekOrMonth / (numrOfWeekOrMonth + numrOfWeekOrMonth / 2);
      }
      interval = 30 + letMonthCorrectionFactor;
    }
    let leftPercent = 100 - perDayFactor * interval * numrOfWeekOrMonth;
    return leftPercent;
  }

  retrieveLeftWidth(inputStr, requiredParam) {
    let returnValue = "";
    const paramArr = inputStr.split(";");
    for (let i = 0; i < paramArr.length; i++) {
      if (paramArr[i].includes(requiredParam)) {
        const valueArr = paramArr[i].split(":");
        returnValue = valueArr[1];
        returnValue = returnValue.replace(" ", "").replace("%", "");
      }
    }
    return returnValue;
  }

  valueCheck(expectedValue) {
    var Style = dashboard.sliderTrack.getAttribute("style");
    var actualValue = this.retrieveLeftWidth(Style, "left");
    let diff = Math.abs(expectedValue - actualValue);
    if (diff < 1) {
      expectedValue = actualValue;
    }
    expect(actualValue).toBe(expectedValue);
  }

  sliderTrackResult() {
    var fromDate = dashboard.fromDate.getText();
    var toDate = dashboard.toDate.getText();

    dashboard.selectTimeSpan("select-all").click();
    expect(dashboard.sliderTrack).toHaveAttributeContaining(
      "style",
      "left: 0%;"
    );

    dashboard.selectTimeSpan("select-last-three-months").click();
    var expectedValue = this.calculatePercent(fromDate, toDate, "3M");
    this.valueCheck(expectedValue);

    dashboard.selectTimeSpan("select-last-month").click();
    var expectedValue = this.calculatePercent(fromDate, toDate, "1M");
    this.valueCheck(expectedValue);

    dashboard.selectTimeSpan("select-last-two-weeks").click();
    var expectedValue = this.calculatePercent(fromDate, toDate, "2W");
    this.valueCheck(expectedValue);

    dashboard.selectTimeSpan("select-last-week").click();
    var expectedValue = this.calculatePercent(fromDate, toDate, "1W");
    this.valueCheck(expectedValue);
  }
}
export default new reusableLibrary();
