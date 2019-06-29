import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';
import { Router } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import 'babel-polyfill';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'font-awesome/css/font-awesome.css';
import 'primereact/resources/primereact.min.css';
import { Provider } from "react-redux";
import store from "./store/store";
import history from './utils/history';
import axios from 'axios';
import * as actions from './store/actions/auth';

axios.defaults.baseURL = 'http://localhost:5000/api';
store.dispatch(actions.authCheckState());

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <AppWrapper />
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();