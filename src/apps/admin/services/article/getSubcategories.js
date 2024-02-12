import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (categoryId) {
    const token = getToken();

    return base(
        request
            .get(`/api/admin/article/subcategory/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
    );
}
