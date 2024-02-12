import {
    SET_AUTHENTICATED,
    SET_UPDATING,
    SET_ERROR,
    SET_SUCCESS
} from '../types';

const initialState = {
    authenticated: null,
    updating: false,
    error: false,
    success: false
};

export default function applicationReducer (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, authenticated: action.payload };
    case SET_UPDATING:
        return { ...state, updating: action.payload };
    case SET_ERROR:
        return { ...state, error: action.payload };
    case SET_SUCCESS:
        return { ...state, success: action.payload };
    default:
        return state;
    }
}
