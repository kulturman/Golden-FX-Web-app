import * as actionTypes from './actionTypes';
import { makeRequest } from '../../utils/util';


const grantWithdrawal = payload => {
    return makeRequest('/withdrawals/grant/' + payload , 'POST' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.REMOVE_WITHDRAWAL , payload: data.id })
    } , false)
}

const fetchWithdrawals = url => {
    return makeRequest(url , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_WITHDRAWALS , payload: data });
    })
}

const fetchFundVariations = () => {
    return makeRequest('/fundVariations' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_FUND_VARIATIONS , payload: data });
    })
}

const fetchUserFundVariations = () => {
    return makeRequest('/fundVariations/user' , 'GET' , {} , (data , dispatch) => {
        dispatch({ type: actionTypes.SET_USER_FUND_VARIATIONS , payload: data });
    })
}

const newWithdrawal = payload => {
    return makeRequest('/withdrawals' , 'POST' , payload , (data , dispatch) => {
        dispatch({ type: actionTypes.FETCH_RESOURCE_SUCCESS });
    })
}

const newDayliVariation = payload => {
    return makeRequest('/fundVariations' , 'POST' , payload , (data , dispatch) => {
        dispatch({ type: actionTypes.FETCH_RESOURCE_SUCCESS });
    })
}

const fetchCurrentUserWithdrawals = () => {
    return fetchWithdrawals('/withdrawals/my-withdrawals');
}

const fetchAllWithdrawals = () => {
    return fetchWithdrawals('/withdrawals');
}

const fetchWaitingWithdrawals = () => {
    return fetchWithdrawals('/withdrawals/state/waiting');
}



export {
    fetchCurrentUserWithdrawals , newWithdrawal , fetchAllWithdrawals ,
    fetchWaitingWithdrawals , grantWithdrawal , fetchFundVariations , newDayliVariation,
    fetchUserFundVariations
}