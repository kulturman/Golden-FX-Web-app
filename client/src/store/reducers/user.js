import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: null
}

const userReducer = (state = initialState , action) => {
    switch(action.type) {
        case actionTypes.SET_USERS:
            return {
                ...state,
                users: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;