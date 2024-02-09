import forEachObjIndexed from 'ramda/src/forEachObjIndexed';
import isNil from 'ramda/src/isNil';
import is from 'ramda/src/is';
import keys from 'ramda/src/keys';
import omit from 'ramda/src/omit';

const checkModel = (fieldName, settings, model) => {
    const unsupportedSettingsNames = keys(omit(keys(model), settings));

    forEachObjIndexed((modelValidators, settingName) => {
        const settingValue = settings[settingName];

        modelValidators.forEach(validator => {
            if (is(Object, validator) && !isNil(settingValue)) {
                if (!is(Array, settings[settingName])) {
                    return alert(`${fieldName} field. '${settingName}' must be an array!`);
                }

                return settings[settingName].forEach(settingsSubObj => {
                    checkModel(fieldName, settingsSubObj, validator);
                });
            }
            if (validator === 'required' && isNil(settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting is required!`);
            }
            if (validator === 'string' && !isNil(settingValue) && !is(String, settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting must be a string!`);
            }
            if (validator === 'number' && !isNil(settingValue) && !is(Number, settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting must be a number!`);
            }
            if (validator === 'array' && !isNil(settingValue) && !Array.isArray(settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting must be an array!`);
            }
            if (validator === 'boolean' && !isNil(settingValue) && !is(Boolean, settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting must be a boolean!`);
            }
            if (validator === 'function' && !isNil(settingValue) && !is(Function, settingValue)) {
                return alert(`${fieldName} field. '${settingName}' setting must be a function!`);
            }
        });
    }, model);

    if (unsupportedSettingsNames.length) {
        alert(`${fieldName} field. Unsupported settings: '${unsupportedSettingsNames.join('\', \'')}'!`);
    }
};

export default (fieldName, settings, model) => {
    setTimeout(() => {
        checkModel(fieldName, settings, model);
    }, 1000);
};
