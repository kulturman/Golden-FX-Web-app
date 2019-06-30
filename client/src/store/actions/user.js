import * as actionTypes from '../actions/actionTypes';
import { makeRequest } from '../../utils/util';

const fetchUsers = () => {
    return makeRequest('/users' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_USERS , payload: data });
    })
}

const deleteUser = id => {
    return makeRequest(`/users/${id}` , 'DELETE' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.DELETE_USER , payload: id });
    } , false )
}

const updateUser = (id , payload) => {
    return makeRequest(`/users/${id}` , 'PUT' , payload , null , false )
}

const getUser = id => {
    return makeRequest(`/users/${id}` , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_EDITING_USER , payload: data });
    })
}

export { fetchUsers , deleteUser , getUser , updateUser }