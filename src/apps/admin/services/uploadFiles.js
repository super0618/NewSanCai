import request from 'superagent';
import base from './base';

import getToken from '../utils/getToken';

export default function (file) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/db/upload/files')
            .set('Authorization', `Bearer ${token}`)
            .send(file)
    );
}
