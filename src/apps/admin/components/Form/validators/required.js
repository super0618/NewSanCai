import is from 'ramda/src/is';

const isEmptyValue = value => {
    if (is(String, value)) {
        return !value.trim();
    }
    if (is(Number, value)) {
        return isNaN(value);
    }
    if (is(Boolean, value)) {
        return !value;
    }
    if (Array.isArray(value)) {
        return !value.length;
    }

    return false;
};

export default function required (value, options = {}) {
    const isValid = !isEmptyValue(value);

    if (!isValid) {
        return options.text || 'Поле обязательное';
    }
}
