import forEachObj from 'ramda/src/forEachObjIndexed';
import pathSet from 'lodash.set';
import path from 'ramda/src/path';
import is from 'ramda/src/is';

import getLangsValuesForArray from './getLangsValuesForArray';

export default function getLangsValuesForObject (resultPathValue, pathValue, value = {}, valueLangStructure, values, changesByLang) {
    forEachObj((propValue, propName) => {
        if (propValue === 'depend') {
            changesByLang = pathSet(changesByLang, [...resultPathValue, propName], path([...pathValue, propName], values));
        } else if (is(Object, propValue)) {
            changesByLang = getLangsValuesForObject(
                [...resultPathValue, propName],
                [...pathValue, propName],
                value[propName],
                valueLangStructure[propName],
                values,
                changesByLang
            );
        } else if (Array.isArray(propValue)) {
            changesByLang = getLangsValuesForArray(
                [...resultPathValue, propName],
                [...pathValue, propName],
                value[propName],
                valueLangStructure[propName],
                values,
                changesByLang
            );
        } else {
            changesByLang = pathSet(changesByLang, [...resultPathValue, propName], value[propName]);
        }
    }, valueLangStructure);

    return changesByLang;
}
