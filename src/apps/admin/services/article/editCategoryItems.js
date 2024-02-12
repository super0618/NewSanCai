import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ ids, categoryId, subcategoryId }) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/article/updateCategory')
            .set('Authorization', `Bearer ${token}`)
            .send({ ids, categoryId, subcategoryId })
        , true);
}
