import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (ids, categoryId) {
    const token = getToken();

    return base(
        request
            .post(`/api/admin/article/subcategory/${categoryId}/sort`)
            .set('Authorization', `Bearer ${token}`)
            .send({ ids })
    );
}
