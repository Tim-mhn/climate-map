import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const WIDTH = 800
const useStyles = makeStyles({
  root: {
    width: WIDTH,
  },
});





export default function DiscreteSlider({label, handleChange, name, marks}) {
  const classes = useStyles();

  function valuetext(value) {
    return `${value}`;
  }
  
  function valueLabelFormat(value) {
      const m = marks.find(m => m.value == value);
      return m ? m.label : "error";
  }

  const _max = marks.reduce((prev, curr) => prev > curr.value ? prev : curr.value, -Number.MAX_VALUE);
  const _min = marks.reduce((prev, curr) => prev < curr.value ? prev : curr.value, Number.MAX_VALUE);


  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-restrict" gutterBottom>
        {label}
      </Typography>
      <Slider
        // value={value}
        min={_min}
        max={_max}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        step={null}
        valueLabelDisplay="auto"
        name={name}
        onChangeCommitted={(_, v) => {
          const event = { "target": { "name": name, "value": v.toString()} };
          if (handleChange) handleChange(event);
          }}
        marks={marks}
      />
    </div>
  );
}