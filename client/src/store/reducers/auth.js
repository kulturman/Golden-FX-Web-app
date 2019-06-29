import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: null,
    token: null
}

const authReducer = (state = initialState , action) => {

    switch(action.type) {

        case actionTypes.AUTHENTICATE_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            }
        case actionTypes.LOGOUT :
            return {
                ...state,
                user: null,
                token: null
            }
        default:
            return state;
    }
}

export default authReducer;