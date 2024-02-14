import request from 'superagent';
import base from './base';

import getToken from '../utils/getToken';

export default function (file, webp = false) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/files/upload')
            .set('Authorization', `Bearer ${token}`)
            .send(file)
            .query({ webp })
    );
}
