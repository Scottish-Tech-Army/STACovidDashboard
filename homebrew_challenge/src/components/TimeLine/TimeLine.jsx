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
    text: "Scotland begins transition to Phase 2 of the COVID-19 roadmap",
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
  { date: "2020-05-21", text: "Scottish COVID-19 Roadmap published" },

  { date: "2020-06-20", text: "Scottish Government publishes guidance to support the Tourism and Hospitality sector to prepare for opening on 15th July" },
  { date: "2020-06-24", text: "Updated COVID-19 routemap published with indicative Phase 2 dates" },
  { date: "2020-06-29", text: "Scottish Government announces transition to Phase 2" },
  { date: "2020-06-29", text: "Non-essential retail with street access can open" },
  { date: "2020-07-03", text: "5 mile travel distance is relaxed" },
  { date: "2020-07-03", text: "Self-contained accomodation can open" },
  { date: "2020-07-06", text: "Outdoor hospitality (such as beer gardens) permitted to reopen" },
  { date: "2020-07-10", text: "Face coverings to be mandatory in shops" },
  { date: "2020-07-13", text: "Face-to-face youth work resumed outdoors (under relevant guidance)" },
  { date: "2020-07-15", text: "Hairdressers and barbers re-opened with enhanced hygiene measures" },
  { date: "2020-07-22", text: "Motorcycle instruction and theory/hazard tests resumed (tractor tests also resumed)" },
  { date: "2020-07-22", text: "Other personal retail services such as beauticians and tailors re-opened – with enhanced hygiene measures" },
];

// Override the events for testing
const TimeLine = ({ events = defaultEvents }) => {
  // The hoops we have to jump through to get a reliably non-wrapping string...
  const nbsp = String.fromCharCode(160);
  const dateFormatString = "d" + nbsp + "MMM";

  function getEventTableRow(date, texts) {
    const dateString = format(new Date(date), dateFormatString);

    return (
      <tr key={date}>
        <td className="date">{dateString}</td>
        <td className="text">
          {texts.map((t,i) => (<div key={i}>{t}</div>))}
        </td>
      </tr>
    );
  }

  function getYearTableRows(year, dateEventsMap) {
    const sortedDates = [...dateEventsMap.keys()].sort().reverse();

    // Need to write the fragment longhand to avoid the missing key warnings
    return (
      <React.Fragment key={year}>
        <tr key={year}>
          <td className="year">{year}</td>
          <td className="text"></td>
        </tr>
        {sortedDates.map((date) =>
          getEventTableRow(date, dateEventsMap.get(date))
        )}
      </React.Fragment>
    );
  }

  function getYearDateEventsMap() {
    const result = new Map();

    events.forEach(({ date, text }, i) => {
      const dateVal = new Date(date);
      const year = dateVal.getFullYear();
      if (!result.has(year)) {
        result.set(year, new Map());
      }
      var dateEventsMap = result.get(year);
      if (!dateEventsMap.has(date)) {
        dateEventsMap.set(date, []);
      }
      const events = dateEventsMap.get(date)
      events.push(text);
    });

    return result;
  }

  function getTableRows() {
    const yearDateEventsMap = getYearDateEventsMap();
    const sortedYears = [...yearDateEventsMap.keys()].sort().reverse();

    return (
      <>
        {sortedYears.map((year) =>
          getYearTableRows(year, yearDateEventsMap.get(year))
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
