import { Control, DomUtil, DomEvent } from "leaflet";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import "./FullscreenControl.css";
import { createControlComponent } from "@react-leaflet/core";

// eslint-disable-next-line jest/require-hook
var Zoom = Control.extend({
  options: {
    position: "topright",
    toggleFullscreen: null,
  },

  onAdd: function (map) {
    var fullscreenName = "leaflet-control-fullscreen",
      container = DomUtil.create("div", fullscreenName + " leaflet-bar");

    var link = DomUtil.create("a", "fullscreen", container);
    link.href = "#";
    link.title = "Fullscreen";
    link.setAttribute("role", "button");
    link.setAttribute("aria-label", "Fullscreen");

    this._enterFullscreenIcon = this._createIcon(faSearchPlus);
    this._exitFullscreenIcon = this._createIcon(faSearchMinus);
    link.appendChild(this._enterFullscreenIcon);
    link.appendChild(this._exitFullscreenIcon);
    this.setFullscreenIcon(false);

    DomEvent.disableClickPropagation(link);
    DomEvent.on(link, "click", DomEvent.stop);
    DomEvent.on(link, "click", this.options.toggleFullscreen, this);
    DomEvent.on(link, "click", this._refocusOnMap, this);

    this._fullscreenButton = link;

    return container;
  },

  _createIcon: function (iconData) {
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 512 512");
    icon.setAttribute("role", "img");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    icon.appendChild(path);
    path.setAttribute("fill", "currentColor");
    // Get path data directly from icon
    path.setAttribute("d", iconData.icon[4]);

    return icon;
  },

  onRemove: function (map) {
    // Do nothing
  },

  setFullscreenIcon: function (fullscreenEnabled) {
    this._enterFullscreenIcon.setAttribute(
      "display",
      !fullscreenEnabled ? "inline-block" : "none"
    );
    this._exitFullscreenIcon.setAttribute(
      "display",
      fullscreenEnabled ? "inline-block" : "none"
    );
  },
});

const FullscreenControl = createControlComponent(
  (props) => new Zoom(props)
);

export default FullscreenControl;
