import React from "react";
import { format } from "date-fns";
import "./TimeLine.css";

// Add events here as necessary - order is not important (they're sorted anyway)
const defaultEvents = [
  {
    date: "2020-05-29",
    text: "Scotland moves to Phase 1 on the route map out of lockdown",
  },
  {
    date: "2020-06-19",
    text: "Scotland begins transition to Phase 2 of the Covid-19 roadmap",
  },
  { date: "2020-03-01", text: "First positive case in Scotland" },
  {
    date: "2020-03-11",
    text: "First identified case of community transmission",
  },
  { date: "2020-03-13", text: "First confirmed death in Scotland" },
  { date: "2020-03-24", text: "UK wide lockdown announced" },
  { date: "2020-04-02", text: "Worldwide cases exceeds 1 Million" },
  { date: "2020-04-10", text: "Global death toll surpasses 100,000" },
  { date: "2020-04-20", text: "NHS Louisa Jordan Hospital opens" },
  {
    date: "2020-05-06",
    text:
      "First weekly reduction of registered deaths since Pandemic started in Scotland",
  },
  {
    date: "2020-05-18",
    text:
      "Testing in Scotland available for everyone who is symptomatic over 5",
  },
  { date: "2020-05-21", text: "Scottish Covid-19 Roadmap published" },
];

// Override the events for testing
const TimeLine = ({ events = defaultEvents }) => {
  // The hoops we have to jump through to get a reliably non-wrapping string...
  const nbsp = String.fromCharCode(160);
  const dateFormatString = "d" + nbsp + "MMM";

  function getEventTableRow(date, text) {
    const dateString = format(new Date(date), dateFormatString);
    return (
      <tr key={date}>
        <td className="date">{dateString}</td>
        <td className="text">
          <span>{text}</span>
        </td>
      </tr>
    );
  }

  function getYearTableRows(year, dateEventMap) {
    const sortedDates = [...dateEventMap.keys()].sort().reverse();

    // Need to write the fragment longhand to avoid the missing key warnings
    return (
      <React.Fragment key={year}>
        <tr key={year}>
          <td className="year">{year}</td>
          <td className="text"></td>
        </tr>
        {sortedDates.map((date) =>
          getEventTableRow(date, dateEventMap.get(date))
        )}
      </React.Fragment>
    );
  }

  function getYearDateEventMap() {
    const result = new Map();

    events.forEach(({ date, text }, i) => {
      const dateVal = new Date(date);
      const year = dateVal.getFullYear();
      if (!result.has(year)) {
        result.set(year, new Map());
      }
      var dateEventMap = result.get(year);
      dateEventMap.set(date, text);
    });

    return result;
  }

  function getTableRows() {
    const yearDateEventMap = getYearDateEventMap();
    const sortedYears = [...yearDateEventMap.keys()].sort().reverse();

    return (
      <>
        {sortedYears.map((year) =>
          getYearTableRows(year, yearDateEventMap.get(year))
        )}
      </>
    );
  }

  return (
    <div className="events">
      <h5>Key Dates</h5>
      <div className="eventsTable">
        <table>
          <tbody>{getTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeLine;
