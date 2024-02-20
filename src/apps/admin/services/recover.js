import request from 'superagent';
import base from './base';

export default function (email) {
    return base(
        request
            .get('/api/admin/admin/recover')
            .query({ email })
    );
}
