import Page from "./page";

class RegionalPage extends Page {
  get selectedRegionButton() {
    return $("button.selected-region");
  }

  open() {
    return super.open("/regional");
  }
}

export default new RegionalPage();
