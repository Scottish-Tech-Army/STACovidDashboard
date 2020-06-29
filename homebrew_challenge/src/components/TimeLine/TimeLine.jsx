import React from "react";
import { format } from "date-fns";
import "./TimeLine.css";

const events = [
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
  {
    date: "2020-05-29",
    text: "Scotland moves to Phase 1 on the route map out of lockdown",
  },
  {
    date: "2020-06-19",
    text: "Scotland begins transition to Phase 2 of the Covid-19 roadmap",
  },
];

const TimeLine = () => {
  // The hoops we have to jump through to get a reliably non-wrapping string...
  const nbsp = String.fromCharCode(160);
  const dateFormatString = "dd" + nbsp + "MMM," + nbsp + "yyyy";

  function getTableEntry({ date, text }) {
    const dateString = format(new Date(date), dateFormatString);
    return (
      <tr>
        <td className="date">{dateString}</td>
        <td className="tick"></td>
        <td className="text">
          <span>{text}</span>
        </td>
      </tr>
    );
  }

  return (
    <div className="events">
      <table>
        <tbody>{events.map(getTableEntry)}</tbody>
      </table>
    </div>
  );
};

export default TimeLine;
