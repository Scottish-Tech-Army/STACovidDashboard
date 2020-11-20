module.exports = function (Chart) {
  /* eslint-disable global-require */
  var chartHelpers = Chart.helpers;
  var helpers = require("./helpers.js")(Chart);
  /* eslint-enable global-require */
  var lastHoveredElement;

  function collapseHoverEvents(events) {
    var hover = false;
    var filteredEvents = events.filter(function (eventName) {
      switch (eventName) {
        case "mouseenter":
        case "mouseover":
        case "mouseout":
        case "mouseleave":
          hover = true;
          return false;

        default:
          return true;
      }
    });
    if (hover && filteredEvents.indexOf("mousemove") === -1) {
      filteredEvents.push("mousemove");
    }
    return filteredEvents;
  }

  function startHover(element, e, eventHandlers) {
    var options = element.options;
    if (!element.hovering) {
      // fire hover events
      ["mouseenter", "mouseover"].forEach(function (eventName) {
        var handlerName = helpers.getEventHandlerName(eventName);
        var hoverEvent = helpers.createMouseEvent(eventName, e); // recreate the event to match the handler
        element.hovering = true;
        lastHoveredElement = element;
        if (typeof options[handlerName] === "function") {
          eventHandlers.push([options[handlerName], hoverEvent, element]);
        }
      });
    }
  }

  function endHover(element, e, eventHandlers) {
    var options = element.options;
    if (element.hovering) {
      // fire hover off events
      element.hovering = false;
      lastHoveredElement = undefined;
      ["mouseout", "mouseleave"].forEach(function (eventName) {
        var handlerName = helpers.getEventHandlerName(eventName);
        var hoverEvent = helpers.createMouseEvent(eventName, e); // recreate the event to match the handler
        if (typeof options[handlerName] === "function") {
          eventHandlers.push([options[handlerName], hoverEvent, element]);
        }
      });
    }
  }

  function dispatcher(e) {
    var ns = this.annotation;
    var elements = helpers.elements(this);
    var position = chartHelpers.getRelativePosition(e, this.chart);
    var element = helpers.getNearestItems(elements, position);
    var events = collapseHoverEvents(ns.options.events);
    var dblClickSpeed = ns.options.dblClickSpeed;
    var eventHandlers = [];
    var eventHandlerName = helpers.getEventHandlerName(e.type);
    var options = (element || {}).options;

    // Detect hover events
    if (e.type === "mousemove") {
      if (element && !element.hovering) {
        // end hover on the last hovered element
        if (lastHoveredElement && element !== lastHoveredElement) {
          endHover(lastHoveredElement, e, eventHandlers);
        }
        // hover started
        startHover(element, e, eventHandlers);
      } else if (!element) {
        // hover ended
        elements.forEach(function (el) {
          endHover(el, e, eventHandlers);
        });
      }
    }

    // Suppress duplicate click events during a double click
    // 1. click -> 2. click -> 3. dblclick
    //
    // 1: wait dblClickSpeed ms, then fire click
    // 2: cancel (1) if it is waiting then wait dblClickSpeed ms then fire click, else fire click immediately
    // 3: cancel (1) or (2) if waiting, then fire dblclick
    if (
      element &&
      events.indexOf("dblclick") > -1 &&
      typeof options.onDblclick === "function"
    ) {
      if (e.type === "click" && typeof options.onClick === "function") {
        clearTimeout(element.clickTimeout);
        element.clickTimeout = setTimeout(function () {
          delete element.clickTimeout;
          options.onClick.call(element, e);
        }, dblClickSpeed);
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      } else if (e.type === "dblclick" && element.clickTimeout) {
        clearTimeout(element.clickTimeout);
        delete element.clickTimeout;
      }
    }

    // Dispatch the event to the usual handler, but only if we haven't substituted it
    if (
      element &&
      typeof options[eventHandlerName] === "function" &&
      eventHandlers.length === 0
    ) {
      eventHandlers.push([options[eventHandlerName], e, element]);
    }

    if (eventHandlers.length > 0) {
      e.stopImmediatePropagation();

      if (!helpers.supportsEventListenerOptions) {
        e.preventDefault();
      }

      eventHandlers.forEach(function (eventHandler) {
        // [handler, event, element]
        eventHandler[0].call(eventHandler[2], eventHandler[1]);
      });
    }
  }

  return {
    dispatcher: dispatcher,
    collapseHoverEvents: collapseHoverEvents,
  };
};
