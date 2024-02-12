import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ ids, locale, sort }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/article/getbyids')
            .query({ ids: ids, locale: locale, sort: sort })
            .set('Authorization', `Bearer ${token}`)
    );
}
