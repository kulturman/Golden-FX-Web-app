import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loading: false,
    errors: {},
    fetchSuccess: false,
    success: false
}

const fetchresourceReducer = (state = initialState , action) => {
    
    let fetchSuccess = true;
    let success = false;

    if(action.isFetchRequest !== 'undefined') {
        const { isFetchRequest } = action;
        if(!isFetchRequest) {
            fetchSuccess = false;
            success = true;
        }
    }

    switch(action.type) {
        case actionTypes.FETCH_RESOURCE_START:
            return {
                ...state,
                loading: true,
                success: false,
                fetchSuccess: false,
                errors: {}
            };

        case actionTypes.FETCH_RESOURCE_FAIL:
            return {
                ...state,
                loading: false,
                errors: {...action.payload.errors},
                success: false,
                fetchSuccess: false
            };
        case actionTypes.FETCH_RESOURCE_SUCCESS:
            return {
                ...state,
                loading: false,
                errors: {},
                success,
                fetchSuccess
            };
        default:
            return state;
    }
}

export default fetchresourceReducer;