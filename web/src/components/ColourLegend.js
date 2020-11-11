import { Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { normalizeArray, zip } from "../utils/array";
import { getForecastUnit } from "../utils/features";
import { isAnomVariable, prettyVariable } from "../utils/string";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        marginTop: 24,
        minWidth: 100,
        maxWidth: 400,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        maxHeight: 80
    },
}));


export const ColourLegend = ({ colorStops, width, input }) => {
    const classes = useStyles();

    // we use a ref to access the canvas' DOM node
    const canvasRef = useRef(null);

    useEffect(() => {

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.setAttribute('width', '475');

        const WIDTH = 290
        // ...drawing using the context
        var gradient = ctx.createLinearGradient(20, 0, width, 0);

        // Add three color stops
        const colors = colorStops.map(stop => stop[1]);
        const stopValues = colorStops.map(stop => stop[0]);
        const normalizedStopVals = normalizeArray(stopValues);

        for (const [value, color] of zip(normalizedStopVals, colors)) {
            try {
                gradient.addColorStop(value, color);
            } catch (err) {
                console.error(`ColorLegend.js: error when adding color stop. \
                                Value=${value}, Color=${color}. \
                                Full error message: ${err.message}`)
            }
        }

        // Set the fill style and draw a rectangle
        ctx.fillStyle = gradient;
        ctx.fillRect(10, 10, width, 20);
        ctx.font = '18px serif';
        ctx.fillStyle = 'black';
        const text = `${stopValues[0]}-${stopValues[stopValues.length - 1]}`;
        ctx.fillText(text, WIDTH + 15, 25);
    }, [canvasRef, colorStops]);

    const unit = (input.relative && isAnomVariable(input.variable)) ? '%' : getForecastUnit(input.variable, input.granulation);

    return <Card className={classes.root} >
        <CardContent>
            <Typography variant="body2">
                <p>{ prettyVariable(input.variable) } ({ unit}) </p>
                <canvas ref={canvasRef} />
            </Typography>
        </CardContent>
    </Card>
};