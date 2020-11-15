import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { PrecipitationHistoryQuery, TemperatureHistoryQuery } from "../graphql/queries/HistoryQueries";
import { anomToGross, prettyVariable } from "../utils/string";
import { useGraphQL } from "../hooks/graphql";

export const DrawerPanel = ({ featuresCollection, clickedFeature, input }) => {
    const historyQuery = input.variable.includes("temperature") ? TemperatureHistoryQuery : PrecipitationHistoryQuery
    const [loading, error, data] = useGraphQL(historyQuery, { iso3: clickedFeature && clickedFeature.properties.ISO_A3 });

    if (loading) console.log(`Loading! ${loading}`)
    if (error) console.error(`Error: ${error}`)
    useEffect(() => {
        console.log(clickedFeature)
        const countryFeature = clickedFeature && featuresCollection.features.find(feature => feature.properties.ISO_A3 == clickedFeature.properties.ISO_A3);
        console.log(countryFeature)
        let historyData = [];
        if (data) historyData = data.history.data;
        console.log(historyData)
        const ctx = document.getElementById("myChart");

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

            console.log(_datasets);
        } catch (err) { console.error(err); _data = []; _labels = [] }

        console.info(_datasets)
        if (_datasets.length > 0) console.log(_datasets)


        const myChart = new Chart(ctx, {
            type: "line",
            height: "400px",
            // width: "800px",
            data: {
                datasets: _datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // title: {
                //     display: true,
                //     text: prettyVariable(anomToGross(input.variable))
                // },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'year'
                        }
                    }],
                    // yAxes: [{
                    //     ticks: {
                    //         beginAtZero: true
                    //     }
                    // }]
                }
            }
        });
        myChart.update();
        console.log(myChart.height)

    }, [data]);

    console.log(loading);


    return <Grid container direction='column' justify='flex-start' alignItems='flex-start' height="600px" style={{ 'padding': '24px' }}>

        <Grid container item direction='row' justify='flex-start'>
            <Typography>{clickedFeature ? clickedFeature.properties.ADMIN : ''} </Typography>
        </Grid>

        {/* row of 1 (or maybe more charts) */}
        <Grid container item direction='row' justify='flex-start' alignItems='flex-start' >
            <Grid container item direction='column' justify="flex-start" alignItems="center">
                <Grid contaier item direction='row' justify="flex-start" alignItems="start">
                    <p>{prettyVariable(anomToGross(input.variable))} </p>
                </Grid>

                <Grid contaier item direction='row' justify="flex-start" alignItems="start" style={{ 'visibility': loading ? 'hidden' : '', 'width': loading ? '0px' : '1400px' }}>
                    <canvas id="myChart" height="400px" />

                </Grid>

                <Grid container item direction='row' justify="flex-start" alignItems="start">
                    {loading && <CircularProgress size={50} />}
                </Grid>


            </Grid>



        </Grid>

    </Grid >

}