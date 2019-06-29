import * as actionTypes from './actionTypes';
import { makeRequest } from '../../utils/util';

const fetchDashboard = () => {
    return makeRequest('/users/dashboard' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_DASHBOARD , payload: data });
    });
}

const fetchGraphData = (period , type) => {
    return makeRequest(`/fundVariations/graphData/${period}/${type}` , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_GRAPHDATA , payload: data });
    });
}
export { fetchDashboard , fetchGraphData };