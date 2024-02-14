import request from 'superagent';
import base from './base';

import getToken from '../utils/getToken';

export default function (credentials) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/admin/change')
            .set('Authorization', `Bearer ${token}`)
            .send(credentials)
    );
}
