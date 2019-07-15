import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import { Message } from "primereact/message";
import Spinner from "../UI/Spinner/Spinner";
import * as util from "../../utils/util";

class NewUser extends Component {
    onSubmit = e => {
        e.preventDefault();
        this.props.onRegisterUser(this.state);
    };

    componentDidUpdate(prevProps) {// Le mot de passe est : ${this.props.registeredUser.password}
        const { successMessage } = this.props;
        if (successMessage && prevProps.successMessage !== successMessage) {
            util.successDialog(successMessage);
        }
    }

    state = {
        name: "",
        forename: "",
        email: "",
        address: "",
        profession: "",
        phone: "",
        isAdmin: false,
        amount: ""
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onCheckboxChange = e => {
        this.setState({ isAdmin: e.checked });
    };

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
                                <Link to="/utilisateurs">Utilisateurs</Link>
                            </li>
                            <li
                                class="breadcrumb-item active"
                                aria-current="page"
                            >
                                Nouvel utilisateur
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="p-col-12 p-lg-6 p-offset-3">
                    <form onSubmit={this.onSubmit}>
                        <div className="card card-w-title">
                            <h1>Ajouter un utilisateur</h1>
                            <div className=" p-lg-12">
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Adresse email"
                                        value={this.state.email}
                                        name="email"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.email ? (
                                        <Message
                                            severity="error"
                                            text={errors.email}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Nom"
                                        value={this.state.name}
                                        name="name"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.name ? (
                                        <Message
                                            severity="error"
                                            text={errors.name}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Pénom(s)"
                                        value={this.state.forename}
                                        name="forename"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.forename ? (
                                        <Message
                                            severity="error"
                                            text={errors.forename}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Profession"
                                        value={this.state.profession}
                                        name="profession"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.profession ? (
                                        <Message
                                            severity="error"
                                            text={errors.profession}
                                        />
                                    ) : null}
                                </div>
                                {this.state.isAdmin ? null : (
                                    <div className="p-lg-12">
                                        <InputText
                                            placeholder="Montant de l'investissement"
                                            value={this.state.amount}
                                            name="amount"
                                            onChange={this.onChange}
                                        />
                                        {errors && errors.amount ? (
                                            <Message
                                                severity="error"
                                                text={errors.amount}
                                            />
                                        ) : null}
                                    </div>
                                )}
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Numéro de téléphone"
                                        value={this.state.phone}
                                        name="phone"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.phone ? (
                                        <Message
                                            severity="error"
                                            text={errors.phone}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Adresse"
                                        value={this.state.address}
                                        name="address"
                                        onChange={this.onChange}
                                    />
                                    {errors && errors.address ? (
                                        <Message
                                            severity="error"
                                            text={errors.address}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <Checkbox
                                        onChange={this.onCheckboxChange}
                                        checked={this.state.isAdmin}
                                    />
                                    <label className="p-checkbox-label">
                                        Administrateur ?
                                    </label>
                                </div>

                                <div className="p-lg-12">
                                    <Button
                                        label="Valider"
                                        type="submit"
                                        disabled={this.props.loading}
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
        successMessage: state.fetchResource.successMessage,
        errors: state.fetchResource.errors,
        registeredUser: state.auth.registeredUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRegisterUser: payload => dispatch(actions.registerUser(payload))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewUser);
