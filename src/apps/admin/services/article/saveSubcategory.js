import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (categoryId, item) {
    const token = getToken();

    return base(
        request
            .post(`/api/admin/article/subcategory/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(item)
        , true);
}
