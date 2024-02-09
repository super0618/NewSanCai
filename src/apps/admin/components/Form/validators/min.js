import is from 'ramda/src/is';

function rule (value, options) {
    return !options || !is(Number, options.minValue) || isNaN(parseFloat(value)) || parseFloat(value) >= options.minValue;
}

export default (value, options = {}) => {
    const isValid = rule(value, options);

    if (!isValid) {
        return options.text || `Минимальное значение\u00a0- ${options.minValue}`;
    }
};
