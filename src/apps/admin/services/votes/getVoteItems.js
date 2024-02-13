import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ completed }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/votesApi')
            .query({ completed })
            .set('Authorization', `Bearer ${token}`)
    );
}
