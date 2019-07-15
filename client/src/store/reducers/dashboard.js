import * as actions from '../actions/actionTypes';

const initialState = {
    dashboard: null
}

const dashboardReducer = (state = initialState , action) => {
    switch(action.type) {
        case actions.SET_DASHBOARD:
            return {
                ...state,
                dashboard: action.payload
            }
        case actions.SET_GRAPHDATA:
            const dashboard = state.dashboard;
            if(dashboard) {
                return {
                    ...state,
                    dashboard: {
                        ...state.dashboard,
                        graphData: action.payload
                    }
                }
            }
            return state;
        default:
            return state;
    }
}

export default dashboardReducer;