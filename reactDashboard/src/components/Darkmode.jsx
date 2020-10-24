import React, { useEffect, useState } from "react";
import "./darkmode.css";

const Darkmode = () => {
  const [checkbox, setCheckbox] = useState(false);

  function handleChange() {
    if (checkbox == false) {
      setCheckbox(true);
    } else if (checkbox == true) {
      setCheckbox(false);
    }
  }

  useEffect(() => {
    toggleDarkmode();
  });

  function toggleDarkmode() {
    if (checkbox === false) {
      console.log("DARKMODE OFF!");
      
    } else {
      console.log("DARKMODE ON!");
    }
  }
  return <input type="checkbox" onChange={handleChange}></input>;
};

export default Darkmode;
