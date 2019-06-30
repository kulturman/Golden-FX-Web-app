import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import * as userActions from "../../store/actions/user";
import { Message } from "primereact/message";
import Spinner from "../UI/Spinner/Spinner";
import * as util from "../../utils/util";

class UpdateUser extends Component {
    onSubmit = e => {
        e.preventDefault();
        this.props.onUserUpdate(this.props.user.id , this.state);
    };

    componentDidUpdate(prevProps) {
        const success = this.props.success;
        if (success && prevProps.success !== success) {
            util.successDialog("L'utilisateur a été édité avec succès");
        }
        if(this.props.user !== prevProps.user) {
            this.setState({
                ...this.props.user
            })
        }
    }

    componentDidMount() {
        this.props.onFecthUser(this.props.match.params.id);
    }

    state = {
        name: "",
        forename: "",
        email: "",
        address: "",
        profession: "",
        phone: "",
        amount: ""
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
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
                                Modifier un utilisateur
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="p-col-12 p-lg-6 p-offset-3">
                    <form onSubmit={this.onSubmit}>
                        <div className="card card-w-title">
                            <h1>Editer un utilisateur</h1>
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
        errors: state.fetchResource.errors,
        user: state.user.editingUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRegisterUser: payload => dispatch(actions.registerUser(payload)),
        onFecthUser: payload => dispatch(userActions.getUser(payload)),
        onUserUpdate: (id , payload) => dispatch(userActions.updateUser(id , payload))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateUser);
