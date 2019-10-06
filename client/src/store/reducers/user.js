import * as actionTypes from "../actions/actionTypes";

const initialState = {
    users: null,
    editingUser: null,
    applications: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USERS:
            return {
                ...state,
                users: action.payload
            };
        case actionTypes.SET_APPLICATIONS:
            return {
                ...state,
                applications: action.payload
            };
        case actionTypes.SET_EDITING_USER:
            return {
                ...state,
                editingUser: action.payload
            };
        case actionTypes.DELETE_USER:
            const { payload: id } = action;
            const users = [...state.users];
            const index = users.findIndex(u => u.id === id);
            if (index >= 0) {
                users.splice(index, 1);
                return {
                    ...state,
                    users
                };
            }
            return state;
        default:
            return state;
    }
};

export default userReducer;
