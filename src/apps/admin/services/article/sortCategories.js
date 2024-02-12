import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (ids) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/article/category/sort')
            .set('Authorization', `Bearer ${token}`)
            .send(ids)
    );
}
