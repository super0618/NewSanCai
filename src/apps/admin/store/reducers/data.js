import { SET_ADMIN, SET_TOKEN } from '../types';

const initialState = {
    admin: null,
    token: null
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ADMIN:
        return { ...state, admin: action.payload };
    case SET_TOKEN:
        return { ...state, token: action.payload };
    default:
        return state;
    }
}
