export const normalizeArray = (arr) => {
    /**
     * Returns new array with normalized values (aka values in [0-1])
     */
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);

    const a = 1/(maxValue - minValue);
    const b = -minValue / (maxValue-minValue);

    return arr.map(val => a*val + b);
}

/** Zip two arrays together: zip([1, 3, 5], ["a", "b", "c"]) = [[1, "a"], [3, "b"], [5, "c"]] **/
export const zip = (xs, ys) => xs.map((el, idx) => [el, ys[idx]]);
