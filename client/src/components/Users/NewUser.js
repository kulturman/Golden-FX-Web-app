import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import { Message } from "primereact/message";
import Spinner from "../UI/Spinner/Spinner";
import * as util from "../../utils/util";
import axios from 'axios';


class NewUser extends Component {

    constructor(props) {
        super(props);
        this.fileUpload = React.createRef();
        this.image = "";
    }

    onSubmit = async e => {
        e.preventDefault();
        this.image = this.fileUpload.current.state.files[0];
        if(!this.image) {
            util.errorDialog('Veuillez sélectionner une image')
            return;
        }
        const url = await this.handleImageUpload();
        this.props.onRegisterUser({
            ...this.state,
            identityProof: url
        });
    };

    handleImageUpload = async () => {
        const data = new FormData();
        data.append('file' , this.image);
        data.append('upload_preset' , 'golden-fx');
        data.append('cloud_name' , 'kulturman-assets');
        const axios_ = axios.create({
            headers: {}
        });
        const response = await axios_.post('https://api.cloudinary.com/v1_1/kulturman-assets/image/upload' , data);
        return response.data.url;
    }

    componentDidUpdate(prevProps) {
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
        amount: "",
        accountNumber: "",
        institutionName: "",
        identityProof: ""
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
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Accueil</Link>
                            </li>
                            {
                                this.props.user.isAdmin ? <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
                                    <Link to="/utilisateurs">Utilisateurs</Link>
                                </li> : null
                            }
                            <li
                                className="breadcrumb-item active"
                                aria-current="page"
                            >
                                Ouvrir un compte
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="p-col-12 p-lg-6 p-offset-3">
                    <form onSubmit={this.onSubmit}>
                        <div className="card card-w-title">
                            <h1>Ouvrir un compte</h1>
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
                                {this.state.isAdmin ? null : (
                                    <div className="p-lg-12">
                                        <InputText
                                            placeholder="Numéro de compte"
                                            value={this.state.accountNumber}
                                            name="accountNumber"
                                            onChange={this.onChange}
                                        />
                                        {errors && errors.accountNumber ? (
                                            <Message
                                                severity="error"
                                                text={errors.accountNumber}
                                            />
                                        ) : null}
                                    </div>
                                )}
                                {this.state.isAdmin ? null : (
                                    <div className="p-lg-12">
                                        <InputText
                                            placeholder="Institution financière"
                                            value={this.state.institutionName}
                                            name="institutionName"
                                            onChange={this.onChange}
                                        />
                                        {errors && errors.institutionName ? (
                                            <Message
                                                severity="error"
                                                text={errors.institutionName}
                                            />
                                        ) : null}
                                    </div>
                                )}
                                {this.state.isAdmin ? null : (
                                    <FileUpload
                                        accept="image/*"
                                        chooseLabel="Uploader votre pièce d'identité"
                                        onError={e => console.log(e.files)}
                                        name="demo[]" url="./upload" customUpload={true}
                                        uploadHandler={e => alert('yoooo')}
                                        ref={this.fileUpload}
                                     />
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
                                {
                                    this.props.user.isAdmin ?
                                        <div className="p-lg-12">
                                            <Checkbox
                                                onChange={this.onCheckboxChange}
                                                checked={this.state.isAdmin}
                                            />
                                            <label className="p-checkbox-label">
                                                Administrateur ?
                                            </label>
                                        </div> : null
                                }

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
        user: state.auth.user
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
