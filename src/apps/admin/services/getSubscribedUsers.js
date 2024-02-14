import request from 'superagent';
import base from './base';

import getToken from '../utils/getToken';

export default function () {
    const token = getToken();

    return base(
        request
            .get('/api/admin/subscription')
            .set('Authorization', `Bearer ${token}`)
    );
}