import * as actionTypes from '../actions/actionTypes';
import { makeRequest } from '../../utils/util';

const fetchUsers = () => {
    return makeRequest('/users' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_USERS , payload: data });
    })
}

const fetchGodSons = payload => {
    return makeRequest(`/users/god-sons/${payload}` , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_GOD_SONS , payload: data });
    })
}

const deleteUser = id => {
    return makeRequest(`/users/${id}` , 'DELETE' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.DELETE_USER , payload: id });
    } , false )
}

const deleteApplication = id => {
    return makeRequest(`/applications/${id}` , 'DELETE' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.DELETE_APPLICATION , payload: id });
    } , false )
}

const validateApplication = id => {
    return makeRequest(`/applications/validate/${id}` , 'PUT' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.DELETE_APPLICATION , payload: id });
    } , false )
}

const updateUser = (id , payload) => {
    return makeRequest(`/users/${id}` , 'PUT' , payload , null , false)
}

const reinitializePassword = payload => {
    return makeRequest(`/users/reinitilize-password/${payload}` , 'POST' , {} , null , false)
}

const getUser = id => {
    return makeRequest(`/users/${id}` , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_EDITING_USER , payload: data });
    })
}

const fetchApplications = () => {
    return makeRequest('/applications' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_APPLICATIONS , payload: data});
    })
}

export {
    fetchUsers , deleteUser , getUser , updateUser , fetchApplications ,
    reinitializePassword,
    deleteApplication,
    validateApplication,
    fetchGodSons
}