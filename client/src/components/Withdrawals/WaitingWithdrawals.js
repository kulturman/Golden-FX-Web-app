import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/operation";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate } from "../../utils/util";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import * as util from '../../utils/util';

class WaitingWithdrawals extends Component {

    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.userTemplate = this.userTemplate.bind(this);
        this.grant = this.grant.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { successMessage } = this.props;
        if (successMessage && prevProps.successMessage !== successMessage) {
            util.successDialog(successMessage);
        }
    }

    grant() {
        util.questionDialog('Voulez vous vraiment accorder cette demande?' , () => {
            this.props.onGrantWithdrawals(this.state.selectedItem.id);
        });
    }

    delete() {
        util.questionDialog('Voulez vous vraiment supprimer cette demainde' , () => {
            this.props.onDeleteWithdrawals(this.state.selectedItem.id);
        })
    }

    dateTemplate({ createdAt }) {
        return formatDate(createdAt);
    }

    userTemplate({ user }) {
        return user ? user.name + " " + user.forename + ` (${user.phone})` : ''
    }

    state = {
        selectedItem: null
    };

    componentDidMount() {
        this.props.onFetchWithdrawals();
    }

    render() {
        let footer = (
            <div className="p-clearfix" style={{ width: "100%" }}>
                <Button
                    style={{ float: "left" }}
                    label="Accorder"
                    icon="pi pi-plus"
                    onClick={this.grant}
                    disabled={!this.state.selectedItem}
                />
                <Button
                    style={{ float: "left" }}
                    label="Supprimer"
                    icon="pi pi-trash"
                    onClick={this.delete}
                    disabled={!this.state.selectedItem}
                />
            </div>
        );
        let content = <Spinner />;
        if (!this.props.loading && this.props.withdrawals) {
            content = (
                <DataTable
                    emptyMessage="Aucune demande en attente"
                    footer={footer}
                    value={this.props.withdrawals}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste de toutes les demandes de retrait en attente de traitement"
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
                    <Column field="amount" header="Montant" sortable={true} />
                    <Column
                        body={this.userTemplate}
                        header="Auteur de la demande"
                    />
                    <Column
                        field="createdAt"
                        header="Date de demande"
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
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <Link to="/">Accueil</Link>
                            </li>
                            <li
                                class="breadcrumb-item active"
                                aria-current="page"
                            >
                                Demandes de retrait en attente de traitement
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Demandes de retrait en attente de traitement</h1>
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
        withdrawals: state.operation.withdrawals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchWithdrawals: () => dispatch(actions.fetchWaitingWithdrawals()),
        onGrantWithdrawals: id => dispatch(actions.grantWithdrawal(id)),
        onDeleteWithdrawals: id => dispatch(actions.deleteWithdrawal(id)),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WaitingWithdrawals);
