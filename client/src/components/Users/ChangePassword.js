import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import { Message } from "primereact/message";
import Spinner from "../UI/Spinner/Spinner";
import * as util from "../../utils/util";

class ChangePassword extends Component {

    componentDidUpdate(prevProps) {
        const success = this.props.success;
        if (success && prevProps.success !== success) {
            util.successDialog("Votre mot de passe a été changé avec succès");
        }
    }

    state = {
        password: '',
        newPassword: '',
        passwordConfirmation: '',
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.onChangePassword(this.state);
    }

    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {
        const errors = this.props.errors;
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-lg-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <Link to="/">Accueil</Link>
                            </li>
                            <li
                                class="breadcrumb-item active"
                                aria-current="page"
                            >
                                Changer votre mot de passe
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="p-col-12 p-lg-6 p-offset-3">
                    <form onSubmit={this.onSubmit}>
                        <div className="card card-w-title">
                            <h1>Changer votre mot de passe</h1>
                            <div className=" p-lg-12">
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Ancien mot de passe"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        name='password'
                                    />
                                    {errors && errors.password ? (
                                        <Message
                                            severity="error"
                                            text={errors.password}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Nouveau mot de passe"
                                        value={this.state.newPassword}
                                        onChange={this.onChange}
                                        name='newPassword'
                                    />
                                    {errors && errors.newPassword ? (
                                        <Message
                                            severity="error"
                                            text={errors.newPassword}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Resaisir le mot de passe"
                                        value={this.state.passwordConfirmation}
                                        onChange={this.onChange}
                                        name='passwordConfirmation'
                                    />
                                    {errors && errors.passwordConfirmation ? (
                                        <Message
                                            severity="error"
                                            text={errors.passwordConfirmation}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <Button
                                        label="Valider"
                                        type="submit"
                                        disabled={
                                            !this.state.password || !this.state.newPassword || !this.state.passwordConfirmation
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {this.props.loading ? <Spinner /> : null}
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.fetchResource.loading,
        success: state.fetchResource.success,
        errors: state.fetchResource.errors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onChangePassword: payload => dispatch(actions.changePassword(payload))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);
