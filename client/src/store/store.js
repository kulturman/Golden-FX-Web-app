import { createStore , applyMiddleware , combineReducers , compose } from 'redux';
import authReducer from './reducers/auth';
import fetchResourceReducer from './reducers/fetchResource';
import operationReducer from './reducers/operation';
import userReducer from './reducers/user';
import dashboardReducer from './reducers/dashboard';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    auth: authReducer,
    fetchResource: fetchResourceReducer,
    operation: operationReducer,
    user: userReducer,
    dashboard: dashboardReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer , composeEnhancers(applyMiddleware(thunk)));

export default store;