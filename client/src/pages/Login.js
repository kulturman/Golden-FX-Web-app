import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { connect } from 'react-redux';
import * as authActions from '../store/actions/auth';
import { Growl } from "primereact/growl";

class Login extends Component {
    state = {
        email: "",
        password: ""
    };

    onLoginHandler = e => {
        e.preventDefault();
        this.props.onLogin(this.state);
    };

    onChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    componentDidUpdate(prevProps) {
        const errors = this.props.errors;
        if(errors && errors !== prevProps.errors) {
            const messages = [];
            for (let key in errors) {
                messages.push({severity:'error', summary:'', detail:errors[key]});
            }
            if(messages.length !== 0) {
                this.growl.show(messages);
            }
        }
    }

    render() {
        return (
            <div className="login-body">
                <div className="login-image" />
                <div className="card login-panel p-fluid">
                    <div className="login-panel-content">
                    <Growl ref={(el) => this.growl = el} style={{marginTop: '75px'}} />
                        <form onSubmit={this.onLoginHandler}>
                            <div className="p-grid">
                                <div
                                    className="p-col-3"
                                    style={{ textAlign: "left" }}
                                >
                                    <img
                                        src="assets/layout/images/login/icon-login.svg"
                                        alt="avalon-react"
                                    />
                                </div>
                                <div
                                    className="p-col-9"
                                    style={{ textAlign: "left" }}
                                >
                                    <h2 className="welcome-text">
                                        Bienvenue sur le tableau de bord du PFM
                                    </h2>
                                    <span className="guest-sign-in">
                                        Connectez vous
                                    </span>
                                </div>
                                <div
                                    className="p-col-12"
                                    style={{ textAlign: "left" }}
                                >
                                    <label className="login-label">
                                        Adresse email
                                    </label>
                                    <div className="login-input">
                                        <InputText
                                            type="email"
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.onChangeHandler}
                                        />
                                    </div>
                                </div>
                                <div
                                    className="p-col-12"
                                    style={{ textAlign: "left" }}
                                >
                                    <label className="login-label">
                                        Mot de passe
                                    </label>
                                    <div className="login-input">
                                        <InputText
                                            type="password"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.onChangeHandler}
                                        />
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-6 button-pane">
                                    <Button
                                        disabled={this.props.loading || !this.state.email || !this.state.password}
                                        label="Connexion"
                                        icon="pi-md-person"
                                    />
                                </div>
                                <div className="p-col-12 p-md-6 link-pane">
                                    <a href="/#">Mot de passe oublié</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.fetchResource.loading,
        errors: state.fetchResource.errors,
        isAuthenticated: state.auth.token != null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: payload => dispatch(authActions.authenticateUser(payload)) 
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(Login);