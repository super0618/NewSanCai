import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ page = 1, size = 10, sort = 'asc', search, dateStart, dateEnd }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/post/comments')
            .query({
                page: page,
                size: size,
                sort: sort,
                search: search,
                dateStart: dateStart,
                dateEnd: dateEnd
            })
            .set('Authorization', `Bearer ${token}`)
    );
}
