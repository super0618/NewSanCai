import path from 'ramda/src/path';
import { DEFAULT_LOCALE } from '../../../../client/constants';

export default item => path(['name'], item) ||
    path(['title'], item) ||
    path([DEFAULT_LOCALE, 'name'], item) ||
    path([DEFAULT_LOCALE, 'title'], item) ||
    path([DEFAULT_LOCALE, 'name'], item.data) ||
    path([DEFAULT_LOCALE, 'title'], item.data);
