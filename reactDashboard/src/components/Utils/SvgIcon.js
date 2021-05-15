import React from "react";
import "./SvgIcon.css";

// Lightweight replacement for @fortawesome/react-fontawesome/FontAwesomeIcon

export default function SvgIcon({ faIcon, color, title, className, size = 1 }) {

  const width = (faIcon.icon[0] / faIcon.icon[1]) + "em"

  return (
    <svg
      role="img" className={className ? className + " logo-svg" : "logo-svg"}
      xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${faIcon.icon[0]} ${faIcon.icon[1]}`}
      width={width} height="1em" fontSize={size + "em"} color={color}
    >
      {title && (<title id="svg-inline--fa-title-qL2kel3pRoBy">{title}</title>)}
      <path fill="currentColor" d={faIcon.icon[4]}></path>
    </svg>
  );
}
