import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (ids, categoryId) {
    const token = getToken();

    return base(
        request
            .delete(`/api/admin/example-with-subcategories/subcategory/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ ids })
    );
}
