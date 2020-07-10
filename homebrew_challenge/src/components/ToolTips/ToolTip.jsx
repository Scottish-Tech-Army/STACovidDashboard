import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./ToolTip.css";
import 'popper.js';
import $ from 'jquery';
import 'bootstrap';

$(function(){
  $('[data-toggle="tooltip"]').tooltip()
})

function ToolTip({ tooltip }) {
  return (
    <div className="tooltip-icon">
      <a href="#" data-toggle="tooltip" title={tooltip}>
        <FontAwesomeIcon icon={faQuestionCircle} size="1x" color="#319bd5" />
      </a>
    </div>
  );
}

export default ToolTip;
