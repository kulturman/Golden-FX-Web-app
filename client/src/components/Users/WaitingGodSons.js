import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/user";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate, formatMoney } from "../../utils/util";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

class AllUsers extends Component {

    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
    }

    dateTemplate({ createdAt }) {
        return formatDate(createdAt);
    }

    state = {
        selectedItem: null,
        status: ''
    };

    componentDidMount() {
        this.props.onFetchUsers('waiting');
    }

    render() {
        let footer = (
            <div className="p-clearfix" style={{ width: "100%" }}>
                <Button
                    style={{ float: "left" }}
                    label="Créer un compte de trading"
                    icon="pi pi-plus"
                    onClick={() => this.props.history.push('/nouvel-utilisateur')}
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
        if (!this.props.loading && this.props.users) {
            content = (
                <DataTable
                    emptyMessage="Aucun filleul trouvé"
                    footer={footer}
                    value={this.props.users}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste de vos filleuls en attente de validation"
                    paginator={true}
                    rows={10}
                    responsive={true}
                    selection={this.state.selectedItem}
                    onSelectionChange={e => {
                        this.setState({ selectedItem: e.value });
                    }}
                >
                    <Column selectionMode="single" style={{ width: "3em" }} />
                    <Column field="id" header="Id" sortable={true} />
                    <Column field="name" header="Nom &amp; Prénom" />
                    <Column field="forename" header="Prénom(s)" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Téléphone" />
                    <Column field="profession" header="Profession" />
                    <Column header="Montant investi" body={(data) => data.isAdmin ? '-' : formatMoney(data.amount)} />
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
                        header="Date de création"
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
                                Liste de vos filleuls en attente de validation
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Liste de vos filleuls en attente de validation</h1>
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
        users: state.user.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUsers: status => dispatch(actions.fetchGodSons(status))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllUsers);
