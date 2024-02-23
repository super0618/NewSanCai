export default (array, cropValue) => {
    const shuffled = array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return cropValue ? shuffled.slice(0, cropValue) : shuffled;
};
