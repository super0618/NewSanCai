import is from 'ramda/src/is';

function rule (value, options) {
    return !options || !is(Number, options.maxValue) || isNaN(parseFloat(value)) || parseFloat(value) <= options.maxValue;
}

export default (value, options = {}) => {
    const isValid = rule(value, options);

    if (!isValid) {
        return options.text || `Максимальное значение\u00a0- ${options.maxValue}`;
    }
};
