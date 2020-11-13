import { Drawer, makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import Chart from 'chart.js';
import { useGraphQL } from "../hooks/graphql";
import { PrecipitationHistoryQuery, TemperatureHistoryQuery } from "../graphql/queries/HistoryQueries";
import { anomToGross, prettyVariable } from "../utils/string";

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: '100vw',
        minHeight: 300,
        flexShrink: 0,
    },
    drawerPaper: {
        width: '100vw',
        minHeight: 200,
        backgroundColor: 'rgba(250, 250, 250, 1)'
    },
}));

export const DataDrawer = ({ featuresCollection, clickedFeature, input }) => {
    const classes = useStyles();
    const canvasRef = useRef(null);

    const historyQuery = input.variable.includes("temperature") ? TemperatureHistoryQuery : PrecipitationHistoryQuery
    const [loading, error, data] = useGraphQL(historyQuery, { iso3: clickedFeature && clickedFeature.properties.ISO_A3 })

    useEffect(() => {
        const countryFeature = clickedFeature && featuresCollection.features.find(feature => feature.properties.ISO_A3 == clickedFeature.properties.ISO_A3);
        console.log(countryFeature)
        let historyData = [];
        if (data) historyData = data.history.data;
        console.log(historyData)
        const ctx = document.getElementById("myChart");

        let _data, _labels;
        let _datasets = [];

        // Add historical data 
        if (data) {
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


        if (_datasets.length > 0) console.log(_datasets)


        new Chart(ctx, {
            type: "line",
            data: {
                datasets: _datasets
            },
            options: {
                // responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: prettyVariable(anomToGross(input.variable))
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'year'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }, [data]);


    return <Drawer
        className={classes.drawer}

        variant="persistent"
        anchor="bottom"
        open={true}
        classes={{
            paper: classes.drawerPaper,
        }}>
        {clickedFeature && <p>  {clickedFeature.properties.ADMIN}</p>}
        <canvas id="myChart" height="200px !important" width="600px !important"/>
    </Drawer>
}