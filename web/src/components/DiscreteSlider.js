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

const marks = [
  {
    value: 2020,
    label: '2020-2039',
  },
  {
    value: 2040,
    label: '2040-2059',

  },
  {
    value: 2060,
    label: '2060-2079',

  },
  {
    value: 2080,
    label: '2080-2099',

  },
];



export default function DiscreteSlider({handleChange, name}) {
  const classes = useStyles();

  function valuetext(value) {
    return `${value}`;
  }
  
  function valueLabelFormat(value) {
      const m = marks.find(m => m.value == value);
      return m ? m.label : "error";
  }


  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-restrict" gutterBottom>
        Restricted values
      </Typography>
      <Slider
        // value={value}
        min={2020}
        max={2100}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        step={null}
        valueLabelDisplay="auto"
        name={name}
        onChangeCommitted={(_, v) => {
          const event = { "target": { "name": name, "value": v.toString()} };
          handleChange(event);
          }}
        marks={marks}
      />
    </div>
  );
}