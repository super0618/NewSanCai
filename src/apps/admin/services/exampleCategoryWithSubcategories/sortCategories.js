import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (ids) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/example-with-subcategories/category/sort')
            .set('Authorization', `Bearer ${token}`)
            .send(ids)
    );
}
