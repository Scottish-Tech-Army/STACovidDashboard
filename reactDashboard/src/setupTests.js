// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "jest-canvas-mock";
import fetchMock from "jest-fetch-mock";

// eslint-disable-next-line jest/require-hook
fetchMock.enableMocks();

// To avoid JSDOM errors when rendering leaflet map in tests. From:
// https://stackoverflow.com/questions/54382414/fixing-react-leaflet-testing-error-cannot-read-property-layeradd-of-null
// eslint-disable-next-line jest/require-hook
var createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function (namespaceURI, qualifiedName) {
  if (
    namespaceURI === "http://www.w3.org/2000/svg" &&
    qualifiedName === "svg"
  ) {
    var element = createElementNSOrig.apply(this, arguments);
    element.createSVGRect = function () {
      // Do nothing
    };
    return element;
  }
  return createElementNSOrig.apply(this, arguments);
};

// Suppress console error message
global.suppressConsoleErrorLogs = () =>
  jest.spyOn(console, "error").mockImplementation(() => {
    // Do nothing
  });

// Suppress console warning message
global.suppressConsoleWarnLogs = () =>
  jest.spyOn(console, "warn").mockImplementation(() => {
    // Do nothing
  });

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();
});
