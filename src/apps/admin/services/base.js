import pathOr from 'ramda/src/pathOr';
import setUpdating from '../store/actions/setUpdating';
import setError from '../store/actions/setError';
import setSuccess from '../store/actions/setSuccess';
import { getStore } from '../store/store';

export default function (request, notify) {
    const store = notify && getStore();
    notify && store.dispatch(setUpdating(true));
    notify && store.dispatch(setError(false));
    notify && store.dispatch(setSuccess(false));

    return new Promise((resolve, reject) => {
        request
            .end((err, res) => {
                notify && store.dispatch(setUpdating(false));

                if (err) {
                    notify && !err.code && store.dispatch(setError(true));
                    return reject(pathOr({}, ['response', 'body'], err));
                }
                notify && store.dispatch(setSuccess(true));
                resolve(res.body || res.text);
            });
    });
}
