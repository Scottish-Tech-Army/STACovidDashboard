import Page from "./page";

class RegionalPage extends Page {
  get selectedRegionButton() {
    return $("button.selected-region");
  }

  regionDropdownMenuItem(menuItemText) {
    return $(".region-menu").$(".dropdown-item=" + menuItemText);
  }

  open() {
    return super.open("regional");
  }
}

export default new RegionalPage();
