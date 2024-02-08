import * as actionTypes from "../actions/actionTypes";

const initialState = {
    users: null,
    editingUser: null,
    applications: null,
    godSons: null
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
        case actionTypes.SET_GOD_SONS:
            return {
                ...state,
                godSons: action.payload
            }
        case actionTypes.DELETE_USER:
            return updateUsers(state , action);
        case actionTypes.DELETE_APPLICATION:
            return updateUsers(state , action);
        default:
            return state;
    }
};

const updateUsers = (state , action) => {
    const { payload: id } = action;
    const users = action.type == actionTypes.DELETE_USER ? [...state.users] : [...state.applications];
    const index = users.findIndex(u => u.id === id)
    if (index >= 0) {
        users.splice(index, 1);
        return action.type == actionTypes.DELETE_USER ? {
            ...state,
            users
        } : {
            ...state,
            applications: users
        };
    }
    return state;
}
export default userReducer;
