import request from 'superagent';
import base from './base';

import getToken from '../utils/getToken';

export default function uploadDb (file) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/db/upload')
            .set('Authorization', `Bearer ${token}`)
            .send(file)
    );
}
