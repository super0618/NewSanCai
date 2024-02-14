import request from 'superagent';
import base from './base';

export default function (credentials) {
    return base(
        request
            .post('/api/admin/admin/recover-change')
            .send(credentials)
    );
}
