import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/user";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate , formatMoney } from "../../utils/util";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

class AllUsers extends Component {

    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.isAdminTemplate = this.isAdminTemplate.bind(this);
    }

    dateTemplate({ createdAt }) {
        return formatDate(createdAt);
    }

    isAdminTemplate({ isAdmin }) {
        return isAdmin ? 'Oui' : 'Non';
    }

    state = {
        selectedItem: null
    };

    componentDidMount() {
        this.props.onFetchUsers();
    }

    render() {
        let footer = (
            <div className="p-clearfix" style={{ width: "100%" }}>
                <Button
                    style={{ float: "left" }}
                    label="Créer un utilisateur"
                    icon="pi pi-plus"
                    onClick={() => this.props.history.push('/nouvel-utilisateur')}
                />
                <Button
                    style={{ float: "left" }}
                    label="Modifier"
                    icon="pi pi-pencil"
                    disabled={!this.state.selectedItem}
                />
            </div>
        );
        let content = <Spinner />;
        if (!this.props.loading && this.props.users) {
            content = (
                <DataTable
                    footer={footer}
                    value={this.props.users}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste des utilisateurs du système"
                    paginator={true}
                    rows={10}
                    responsive={true}
                    selection={this.state.selectedItem}
                    onSelectionChange={e => {
                        this.setState({selectedItem: e.value});
                    }}
                >
                    <Column selectionMode="single" style={{ width: "3em" }} />

                    <Column field="id" header="Id" sortable={true} />
                    <Column field="name" header="Nom" />
                    <Column field="forename" header="Prénom(s)" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Téléphone" />
                    <Column field="profession" header="Profession" />
                    <Column header="Montant investi" body={(data) => data.isAdmin ? '-' : formatMoney(data.amount)}/>
                    <Column field="isAdmin" header="Administrateur" body={this.isAdminTemplate} />
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
                                Liste des utilisateurs du système
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Liste des utilisateurs du système</h1>
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
        users: state.user.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUsers: () => dispatch(actions.fetchUsers())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllUsers);
