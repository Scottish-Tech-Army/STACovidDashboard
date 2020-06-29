import Chart from "chart.js";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons";

function createImage(iconData) {
  const svgInput =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' height='25px' width='25px'><path fill='#319bd5' d='" +
    iconData.icon[4] +
    "'></path></svg>";
  const result = new Image(); // Create new img element
  result.src =
    "data:image/svg+xml;charset=utf8," + encodeURIComponent(svgInput);
  return result;
}

const enterFullscreenIcon = createImage(faSearchPlus);
const exitFullscreenIcon = createImage(faSearchMinus);

const FullscreenButton = {
  id: "chartJsPluginFullscreenButton",

  getIconBounds(chart) {
    return {
      left: chart.chartArea.right - 44,
      top: chart.chartArea.top + 10,
      width: 34,
      height: 34,
    };
  },

  afterDatasetsDraw(chart, easingValue, options) {
    const { ctx } = chart.chart;
    const bounds = this.getIconBounds(chart);

    ctx.restore();
    ctx.fillStyle = "white";
    ctx.fillRect(bounds.left, bounds.top, 30, 30);

    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(bounds.left, bounds.top, 30, 30);

    ctx.drawImage(
      options.fullscreenEnabled ? exitFullscreenIcon : enterFullscreenIcon,
      bounds.left + 3,
      bounds.top + 3
    );
  },

  afterEvent(chart, e, options) {
    if (e.type !== "click") {
      return;
    }

    var hitBox = this.getIconBounds(chart);
    var x = e.x,
      y = e.y;

    if (
      x >= hitBox.left &&
      x <= hitBox.left + hitBox.width &&
      y >= hitBox.top &&
      y <= hitBox.top + hitBox.height
    ) {
      options.toggleFullscreen();
    }
  },
};

Chart.pluginService.register(FullscreenButton);

export default FullscreenButton;
