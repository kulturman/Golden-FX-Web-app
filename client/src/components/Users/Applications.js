import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/user";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate , formatMoney } from "../../utils/util";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import * as util from "../../utils/util";

class Applications extends Component {

    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.onDeleteHandler = this.onDeleteHandler.bind(this);
        this.onValidateHandler = this.onValidateHandler.bind(this);
    }

    dateTemplate({ createdAt }) {
        return formatDate(createdAt);
    }

    state = {
        selectedItem: null
    };

    componentDidMount() {
        this.props.onFetchApplications();
    }

    componentDidUpdate(prevProps) {
        const successMessage = this.props.successMessage;
        if (successMessage && prevProps.successMessage !== successMessage) {
            util.successDialog(successMessage);
        }
    }

    onDeleteHandler() {
        util.questionDialog('Voulez vous vraiment supprimer cet utilisateur?' , () => {
            this.props.onDeleteUser(this.state.selectedItem.id);
        });
    }

    onValidateHandler() {
        util.questionDialog('Voulez vous vraiment valider cette demande?' , () => {
            this.props.onValidateApplication(this.state.selectedItem.id)
        });
    }

    render() {
        let footer = (
            <div className="p-clearfix" style={{ width: "100%" }}>
                <Button
                    style={{ float: "left" }}
                    label="Valider la demande"
                    disabled={!this.state.selectedItem}
                    icon="pi pi-plus"
                    onClick={this.onValidateHandler}
                />
                <Button
                    style={{ float: "left" }}
                    label="Supprimer"
                    icon="pi pi-ban"
                    disabled={!this.state.selectedItem}
                    onClick={this.onDeleteHandler}
                />
                <Button
                    style={{ float: "left" }}
                    label="Modifier"
                    icon="pi pi-pencil"
                    disabled={!this.state.selectedItem}
                    onClick={() => this.props.history.push(`/editer-un-utilisateur/${this.state.selectedItem.id}`)}
                />
            </div>
        );
        let content = <Spinner />;
        if (!this.props.loading && this.props.applications) {
            content = (
                <DataTable
                    emptyMessage="Aucune demande en attente"
                    footer={footer}
                    value={this.props.applications}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste d'attente"
                    paginator={true}
                    rows={10}
                    responsive={true}
                    selection={this.state.selectedItem}
                    onSelectionChange={e => {
                        this.setState({selectedItem: e.value});
                    }}
                >
                    <Column selectionMode="single" style={{ width: "3em" }} />
                    <Column field="name" header="Nom" />
                    <Column field="forename" header="Prénom(s)" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Téléphone" />
                    <Column field="profession" header="Profession" />
                    <Column header="Montant à investir" body={(data) => !data.amount ? 'Non précisé' : formatMoney(data.amount)}/>
                    <Column field="accountNumber" header="N° compte" />
                    <Column field="institutionName" header="Institution" />
                    <Column body={({ identityProof }) => {
                        return (
                            identityProof ? <Button
                                type="button"
                                icon="pi pi-eye"
                                className="p-button-success"
                                onClick={e => {
                                    window.open(identityProof , '_blank')
                                }}
                                style={{ marginRight: '.5em' }}>
                            </Button> : null
                        );
                    }} header="Pièce d'identité" />
                    <Column
                        field="createdAt"
                        header="Date de de la demande"
                        sortable={true}
                        body={this.dateTemplate}
                    />
                </DataTable>
            );
        }
        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Accueil</Link>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                aria-current="page"
                            >
                                Liste d'attente
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Liste des personnes souhaitant investir</h1>
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.fetchResource.loading,
        successMessage: state.fetchResource.successMessage,
        applications: state.user.applications
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchApplications: () => dispatch(actions.fetchApplications()),
        onDeleteUser: id => dispatch(actions.deleteApplication(id)),
        onValidateApplication: id => dispatch(actions.validateApplication(id)),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Applications);
