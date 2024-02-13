import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function (postId, id, item) {
    const token = getToken();

    return base(
        request
            .put(`/api/admin/post/comments/edit/${postId}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(item)
        , true);
}
