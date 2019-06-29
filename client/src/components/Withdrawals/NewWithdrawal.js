import React, { Component, Fragment } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Message } from "primereact/message";
import * as actions from "../../store/actions/operation";
import { Messages } from "primereact/messages";
import Spinner from "../UI/Spinner/Spinner";
import * as util from '../../utils/util';

class NewWithdrawal extends Component {
    state = {
        amount: "",
        checkbox: false
    };

    componentDidUpdate(prevProps) {
        const success = this.props.success;
        if (success && prevProps.success !== success) {
            util.successDialog("Votre demande a bien été transmise, elle sera prise en compte dès que possible");
            this.setState({ amount: "", checkbox: false });
        }
    }

    onChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onCheckboxChange = e => {
        this.setState({ checkbox: e.checked });
    };

    render() {
        const errors = this.props.errors;
        let content = <Spinner />;
        if (!this.props.loading) {
            content = (
                <Fragment>
                    <div className="p-col-12 p-md-8">
                        <InputText
                            placeholder="Montant à retirer"
                            keyfilter="money"
                            name="amount"
                            value={this.state.amount}
                            onChange={this.onChangeHandler}
                        />
                        {errors && errors.amount ? (
                            <Message
                                severity="error"
                                text={errors.amount}
                            />
                        ) : null}
                    </div>
                    <div className="p-col-12 col-md-8">
                        <Checkbox
                            onChange={this.onCheckboxChange}
                            checked={this.state.checkbox}
                        />
                        <label htmlFor="cb3" className="p-checkbox-label">
                            Veuillez cocher cette case pour autoriser la demande
                        </label>
                    </div>
                    <div className="p-col-12 p-md-8">
                        <Button
                            type="submit"
                            onClick={e =>
                                this.props.onCreateNewWithdrawal(this.state)
                            }
                            disabled={
                                !this.state.checkbox || this.state.amount === ""
                            }
                            label="Valider"
                        />
                    </div>
                </Fragment>
            );
        }
        return (
            <div className="p-col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <Link to="/">Accueil</Link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <Link to="/mes-retraits">
                                Vos demandes de retraits
                            </Link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            Nouvelle demande de retrait
                        </li>
                    </ol>
                </nav>
                <div className="card card-w-title">
                    <Messages ref={el => (this.messages = el)} />
                    <h1>Demande de retrait</h1>
                    <div className="p-grid">{content}</div>
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
        onCreateNewWithdrawal: payload =>
            dispatch(actions.newWithdrawal(payload))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewWithdrawal);
