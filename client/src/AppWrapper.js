import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";

import { connect } from "react-redux";
import PrivateRoute from "./components/utils/PrivateRoute";

class AppWrapper extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        switch (this.props.location.pathname) {
            
            case "/":
                return (
                    <PrivateRoute
                        redirectTo="/tableau-de-bord"
                        isAllowed={this.props.user === null}
                        path="/"
                        component={Login}
                    />
                );
            default:
                return <App />;
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    };
};
export default withRouter(connect(mapStateToProps)(AppWrapper));
