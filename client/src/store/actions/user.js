import * as actionTypes from '../actions/actionTypes';
import { makeRequest } from '../../utils/util';

const fetchUsers = () => {
    return makeRequest('/users' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_USERS , payload: data });
    })
}

export { fetchUsers }