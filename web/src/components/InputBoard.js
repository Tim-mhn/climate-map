import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SelectWrapper from './FormControl';
import { isAnomVariable, prettyVariable } from '../utils/string';
import { BASIC_REQ_TIME_PERIODS, INPUT_TO_TOOLTIP, MONTHS } from '../utils/constants';
import { Button, FormControlLabel, Icon } from '@material-ui/core';
import DiscreteSlider from './DiscreteSlider';
import { camelToSentence } from '../utils/string';
import { HtmlTooltip } from '../components/InputTooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

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

const scenarioOptions = [
    { "label": "Business as usual (A2 Scenario)", "value": "a2" },
    { "label": "Environmental Emphasis (B1 Scenario)", "value": "b1" },
]
export default function InputBoard({ input, setInput, alltimeQueriesResp }) {


    const classes = useStyles();

    return <Card className={classes.root} >
        <CardContent>
            <Grid container direction='column'>
                <Grid container item direction='row' xs={12}>
                    <Grid container item direction='column' xs={11}>
                        <Typography>
                            <SelectWrapper
                                label="Variable"
                                name="variable"
                                defaultValue="temperature"
                                handleChange={setInput}
                                items={Object.keys(alltimeQueriesResp).map(queryName => {
                                    return { "value": queryName, "label": prettyVariable(queryName) }
                                })} />


                        </Typography>
                    </Grid>
                    {/* Input tooltips */}
                    <Grid container item direction='column' justify="center" alignItems="center" xs={1}>
                        <HtmlTooltip title={
                            <React.Fragment>
                                <Typography color="inherit">Variable</Typography>
                                {INPUT_TO_TOOLTIP["variable"].map(tooltip => <p>{tooltip}</p>)}
                            </React.Fragment>
                        }>
                            {/* <Button style={{"minWidth": "0px", "padding": '0'}}><HelpOutlineIcon /></Button> */}
                            <HelpOutlineIcon />
                        </HtmlTooltip>
                    </Grid>
                </Grid>

                <Grid container item direction='row' xs={12}>
                    <Grid container item direction='column' xs={11}>

                        <Typography variant="body2">
                            <SelectWrapper
                                label="Scenario"
                                name="scenario"
                                defaultValue="a2"
                                handleChange={setInput}
                                items={scenarioOptions} />

                        </Typography>
                    </Grid>
                    {/* Input tooltips */}
                    <Grid container item direction='column' justify="center" alignItems="center" xs={1}>
                        <HtmlTooltip title={
                            <React.Fragment>
                                <Typography color="inherit">Scenario</Typography>
                                {INPUT_TO_TOOLTIP["scenario"].map(tooltip => <p style={{"marginBottom": "4px"}}>{tooltip}</p>)}
                            </React.Fragment>
                        }>
                            <HelpOutlineIcon />
                        </HtmlTooltip>
                    </Grid>
                </Grid>

                <Grid container item direction='row' xs={12}>
                    <Grid container item direction='column' xs={11}>

                        <Typography variant="body2">
                            <SelectWrapper
                                label="Granulation"
                                name="granulation"
                                defaultValue="year"
                                handleChange={setInput}
                                items={["year", "month"].map(gran => {
                                    return { "value": gran, "label": camelToSentence(gran) }
                                })} />

                        </Typography>
                    </Grid>
                    {/* Input tooltips */}
                    <Grid container item direction='column' justify="center" alignItems="center" xs={1}>
                        <HtmlTooltip title={
                            <React.Fragment>
                                <Typography color="inherit">Granulation</Typography>
                                {INPUT_TO_TOOLTIP["granulation"].map(tooltip => <p>{tooltip}</p>)}
                            </React.Fragment>
                        }>
                            <HelpOutlineIcon />
                        </HtmlTooltip>
                    </Grid>
                </Grid>


                <Typography variant="body2" >
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={false}
                                    onChange={setInput}
                                    name="relative"
                                    color="primary"
                                    disabled={!isAnomVariable(input.variable)}
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
            </Grid>


        </CardContent>

    </Card>
}