import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const WIDTH = 300
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));



export default function SelectWrapper({label, name, defaultValue, handleChange, items, variant="outlined"}) {
    /**
     * Returns a formcontrol with input label and Select component.
     * label: string
     * name: string
     * defaultValue: any
     * handleChange: method called by Select's onChange
     * items: list of { "value": any, "label": any} which compose the select options
     */
    const classes = useStyles();

    return <FormControl variant={variant} className={classes.formControl}>
        <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
        <Select
            labelId={`${label}-select-label`}
            name={name}
            label={label}
            // placeholder="Select variable"
            defaultValue={defaultValue}
            onChange={handleChange}
        >
            {items.map((item, idx) => {
                return <MenuItem id={idx} value={item.value}>{item.label}</MenuItem>
            })}

        </Select>
</FormControl>

}