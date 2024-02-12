import { DEFAULT_LOCALE } from '../../client/constants';
import path from 'ramda/src/path';

export default (item, defaultName = '') => {
    return path(['data', DEFAULT_LOCALE, 'name'], item) || path(['data', DEFAULT_LOCALE, 'title'], item) || defaultName;
};
