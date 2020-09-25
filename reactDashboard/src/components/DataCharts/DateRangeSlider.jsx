import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "90%",
    marginTop: 50,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "column",
  },
});

function valuetext(value) {
  return value;
}

function DateRangeSlider() {
  const classes = useStyles();
  const [value, setValue] = useState([0, 100]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
      <Typography id="range-slider" gutterBottom>
        Date range
      </Typography>
    </div>
  );
}

export default DateRangeSlider;
