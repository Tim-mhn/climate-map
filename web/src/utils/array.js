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

/** computes average of numbers array */
export const arrAvg = (arr) => arr.reduce((prev, el) => prev + el/arr.length, 0);

export const linearScale = (min, max, num, rounded=true) =>  {
    let arr = [];
    const step = (max-min)/(num-1);
    for (let i = min; i <= max; i+=step) {
      arr.push(rounded ? Math.round(i) : i);
    };
    return arr;
}

