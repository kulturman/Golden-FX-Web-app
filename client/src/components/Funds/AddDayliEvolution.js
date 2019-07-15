import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { connect } from "react-redux";
import * as actions from "../../store/actions/operation";
import { Message } from "primereact/message";
import Spinner from "../UI/Spinner/Spinner";
import * as util from "../../utils/util";
import { Calendar } from "primereact/calendar";

class AddDayliEvolution extends Component {

    componentDidUpdate(prevProps) {
        const success = this.props.success;
        if (success && prevProps.success !== success) {
            util.successDialog("Evolution journalière enregistrée avec succès");
        }
    }

    state = {
        date: null,
        percentage: "",
        loss: false
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.onCreateDayliVariation(this.state);
    }

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
                                <Link to="/historique-evolution">
                                    Historique évolution journalière
                                </Link>
                            </li>
                            <li
                                class="breadcrumb-item active"
                                aria-current="page"
                            >
                                Ajouter l'évolution du jour
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="p-col-12 p-lg-6 p-offset-3">
                    <form onSubmit={this.onSubmit}>
                        <div className="card card-w-title">
                            <h1>Ajouter l'évolution du jour</h1>
                            <div className=" p-lg-12">
                                <div className="p-col-12">
                                    <Calendar
                                        placeholder="Date"
                                        dateFormat="mm-dd-yy"
                                        value={this.state.date}
                                        onChange={(e) => this.setState({date: e.value})}
                                    />
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-4">
                                        <RadioButton
                                            onChange={event =>
                                                this.setState({ loss: !event.checked })
                                            }
                                            checked={!this.state.loss}
                                        />
                                        <label
                                            htmlFor="rb2"
                                            className="p-radiobutton-label"
                                        >
                                            Gain
                                        </label>
                                    </div>
                                    <div className="p-col-12 p-md-4">
                                        <RadioButton
                                            onChange={event =>
                                                this.setState({ loss: event.checked })
                                            }
                                            checked={this.state.loss}
                                        />
                                        <label
                                            htmlFor="rb3"
                                            className="p-radiobutton-label"
                                        >
                                            Perte
                                        </label>
                                    </div>
                                </div>
                                <div className="p-lg-12">
                                    <InputText
                                        placeholder="Pourcentage"
                                        value={this.state.percentage}
                                        onChange={e => this.setState({ percentage: e.target.value })}
                                    />
                                    {errors && errors.percentage ? (
                                        <Message
                                            severity="error"
                                            text={errors.percentage}
                                        />
                                    ) : null}
                                </div>
                                <div className="p-lg-12">
                                    <Button
                                        label="Valider"
                                        type="submit"
                                        disabled={this.props.loading || !this.state.percentage}
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
        onCreateDayliVariation: payload => dispatch(actions.newDayliVariation(payload))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddDayliEvolution);
