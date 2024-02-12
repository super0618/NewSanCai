import { getStore } from '../store/store';

export default () => {
    const store = getStore();

    if (!store) return null;

    return store.getState().data.token;
};
