import * as actionTypes from '../actions/actionTypes';

const initialState = {
    withdrawals: null,
    fundVariations: null,
    userFundVariations: null
}

const reducer = (state = initialState , action) => {
    switch(action.type) {
        case actionTypes.SET_WITHDRAWALS:
            return {
                ...state,
                withdrawals: action.payload
            }
        case actionTypes.SET_FUND_VARIATIONS:
            return {
                ...state,
                fundVariations: action.payload
            }
        case actionTypes.SET_USER_FUND_VARIATIONS:
            return {
                ...state,
                userFundVariations: action.payload
            }
        case actionTypes.REMOVE_WITHDRAWAL:
            const { payload : id } = action;
            const withdrawals = [...state.withdrawals];
            const index = withdrawals.findIndex(w => w.id === id);
            if(index >= 0) {
                withdrawals.splice(index , 1);
                return {
                    ...state,
                    withdrawals
                }
            }
            return {
                ...state
            }
        default:
            return state;
    }
}

export default reducer;