import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { PrecipitationHistoryQuery, TemperatureHistoryQuery } from "../graphql/queries/HistoryQueries";
import { anomToGross, prettyVariable } from "../utils/string";
import { useGraphQL } from "../hooks/graphql";
import { getForecastUnit } from "../utils/features";

const CHART_CANVAS_HEIGHT = "200px";
let historyChart; // Our chart
export const DrawerPanel = ({ featuresCollection, clickedFeature, input }) => {
    const historyQuery = input.variable.includes("temperature") ? TemperatureHistoryQuery : PrecipitationHistoryQuery
    const [loading, error, data] = useGraphQL(historyQuery, { iso3: clickedFeature && clickedFeature.properties.ISO_A3 });


    if (error) console.error(`Error: ${error}`)

    useEffect(() => {
        const countryFeature = clickedFeature && featuresCollection.features.find(feature => feature.properties.ISO_A3 == clickedFeature.properties.ISO_A3);

        let historyData = [];
        if (data) historyData = data.history.data;

        // Destroying chart before creating new one to avoid glitch with Chartjs (other option: use update())
        if (typeof historyChart !== "undefined") historyChart.destroy();

        const ctx = document.getElementById("historyChart");

        let _data, _labels;
        let _datasets = [];

        // Add historical data 
        if (data && ctx) {
            historyData = historyData.map(point => { return { x: point.year.toString(), y: point.value } });
            _datasets.push({ data: historyData, label: "Historical", fill: false, borderColor: "blue" })
        }
        try {
            let scenarios = countryFeature.properties[anomToGross(input.variable)].reduce((uniqueScenarios, prop) => uniqueScenarios.add(prop.scenario), new Set());
            scenarios = Array.from(scenarios);
            // let percentiles = countryFeature.properties[input.variable].reduce((uniquePercentiles, prop) => uniquePercentiles.add(prop.percentile), new Set());
            // percentiles = Array.from(percentiles);


            for (let _scenario of scenarios) {
                const props = countryFeature.properties[anomToGross(input.variable)].filter(prop => prop.scenario == _scenario);
                _data = props.map(p => {
                    return { x: p.fromYear, y: p.annualVal[0] }
                });

                _datasets.push({ data: _data, label: _scenario, fill: false, borderColor: _scenario == "a2" ? "red" : "green" })
            }

        } catch (err) { console.error(err); _data = []; _labels = [] }

        historyChart = new Chart(ctx, {
            type: "line",
            data: {
                datasets: _datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'year'
                        }
                    }],
                }
            }
        });




    }, [data]);



    return <Grid container direction='column' justify='flex-start' alignItems='flex-start' height="280px" style={{ 'padding': '24px' }}>

        {/* Top row: country name */}
        <Grid container item direction='row' justify='flex-start'>
            <Typography>{clickedFeature ? clickedFeature.properties.ADMIN : ''} </Typography>
        </Grid>

        {/* row of 1 (or maybe more charts) */}
        <Grid container item direction='row' justify='flex-start' alignItems='flex-start' >
            <Grid container item direction='column' justify="flex-start" alignItems="start">
                <Grid container item direction='row' justify="flex-start" alignItems="start">
                    <p>{prettyVariable(anomToGross(input.variable))} ({getForecastUnit(anomToGross(input.variable))})</p>
                </Grid>
                <Grid container item direction='row' justify="flex-start" alignItems="start">

                    {/* Country historical + forecast chart */}
                    <Grid container item direction='row'
                        justify="flex-start"
                        alignItems="start"
                        style={{ 'visibility': loading ? 'hidden' : '', 'width': (loading) ? '0px' : '1400px' }}>

                        <canvas id="historyChart" height={CHART_CANVAS_HEIGHT} />

                    </Grid>

                    {/* Loading Spinner  */}
                    <Grid container item direction='row' justify="center" alignItems="center">
                        {loading && <CircularProgress size={80} />}
                    </Grid>



                </Grid>
            </Grid>
        </Grid>
    </Grid >

}