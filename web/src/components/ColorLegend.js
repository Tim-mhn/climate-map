import React, { useEffect, useRef } from "react";
import { normalizeArray, zip } from "../utils/array";


export const ColorLegend = ({ colorStops }) => {
    // we use a ref to access the canvas' DOM node
    const canvasRef = useRef(null);
    console.log("Color legend rendering")
    console.log(colorStops)
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        // ...drawing using the context
        var gradient = ctx.createLinearGradient(20, 0, 220, 0);

        // Add three color stops
        const colors = colorStops.map(stop => stop[1]);
        let stopValues = colorStops.map(stop => stop[0]);
        stopValues = normalizeArray(stopValues); 
        console.log(stopValues)
        console.log(colors)

        for (const [value, color] of zip(stopValues, colors)) {
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
        ctx.fillRect(20, 10, 250, 50);
    }, [canvasRef, colorStops]);

    return <canvas ref={canvasRef} />;
};