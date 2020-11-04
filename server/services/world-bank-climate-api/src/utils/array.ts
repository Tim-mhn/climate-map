export function arrayMin(arr: number[]) {
    return arr.reduce((prev, curr) => prev < curr ? prev : curr, Number.MAX_VALUE);
}

export function arrayMax(arr: number[]) {
    return arr.reduce((prev, curr) => prev > curr ? prev : curr, Number.MIN_VALUE);
};

export function arraySum(arr: number[]) {
    try {
        return arr.reduce((prev, curr) => prev + curr, 0);
    } catch (e) {
        console.error(e);
        return 0;
    }
}

export function arrayFlatten(nestedArr: any[][]) {
    return nestedArr.reduce((prev, curr) => prev.concat(curr), []);
}