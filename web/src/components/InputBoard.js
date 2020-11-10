import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SelectWrapper from './FormControl';
import { isInputVariableAnom } from '../utils/string';
import { BASIC_REQ_TIME_PERIODS, MONTHS } from '../utils/constants';
import { FormControlLabel } from '@material-ui/core';
import DiscreteSlider from './DiscreteSlider';
import { camelToSentence } from '../utils/string';

const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            minWidth: 100,
            backgroundColor: "rgba(255, 255, 255, 0.85)"
        },
    }));

const periodMarks = Object.entries(BASIC_REQ_TIME_PERIODS).map(([start, end]) => {
    return { label: `${start}-${end.slice(-2)}`, value: Number.parseInt(start) }
});

const monthMarks = MONTHS.map((month, idx) => { return { "value": idx, "label": month } });

export default function InputBoard({input, setInput, alltimeQueriesResp}) {


    const classes = useStyles();
    
    return <Card className={classes.root} >
        <CardContent>
            <Typography variant="body2">
                <SelectWrapper
                    label="Variable"
                    name="variable"
                    defaultValue="temperature"
                    handleChange={setInput}
                    items={Object.keys(alltimeQueriesResp).map(queryName => {
                        return { "value": queryName, "label": camelToSentence(queryName) }
                    })} />

            </Typography>
            <Typography variant="body2">
                <SelectWrapper
                    label="Scenario"
                    name="scenario"
                    defaultValue="a2"
                    handleChange={setInput}
                    items={["a2", "b1"].map(scenario => {
                        return { "label": scenario, "value": scenario }
                    })} />

            </Typography>

            <Typography variant="body2">
                <SelectWrapper
                    label="Granulation"
                    name="granulation"
                    defaultValue="year"
                    handleChange={setInput}
                    items={["year", "month"].map(gran => {
                        return { "label": gran, "value": gran }
                    })} />

            </Typography>

            <Typography variant="body2" >
                <Grid item>
                    <FormControlLabel
                        control={
                            <Switch
                                defaultChecked={false}
                                onChange={setInput}
                                name="relative"
                                color="primary"
                                disabled={!isInputVariableAnom(input)}
                            />
                        }
                        label="Relative anomaly"
                    />
                </Grid>

            </Typography>

            <Typography variant="body2">
                <Grid item >
                    <DiscreteSlider
                        label="Period"
                        name="fromYear"
                        handleChange={setInput}
                        marks={periodMarks}
                    />
                </Grid>

            </Typography>

            <Typography variant="body2">
                <Grid item >
                    {
                        input.granulation == "month" ?

                            <DiscreteSlider
                                label="Month"
                                name="month"
                                handleChange={setInput}
                                marks={monthMarks}
                            />

                            :

                            <span></span>
                    }
                </Grid>

            </Typography>

        </CardContent>
        {/* <CardActions>
        <Button size="small">Learn More</Button>
    </CardActions> */}
    </Card>
}