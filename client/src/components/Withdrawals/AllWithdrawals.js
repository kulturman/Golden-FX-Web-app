import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/operation";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate } from "../../utils/util";
import { Link } from 'react-router-dom';

class AllWithdrawals extends Component {
    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.stateTemplate = this.stateTemplate.bind(this);
    }

    dateTemplate(rowData, column) {
        return formatDate(rowData.createdAt);
    }


    stateTemplate(rowData, column) {
        return rowData.granted ? "Accordée" : "En attente de traitement!";
    }

    state = {

    };

    componentDidMount() {
        this.props.onFetchWithdrawals();
    }

    render() {
        let content = <Spinner />;
        if (!this.props.loading && this.props.withdrawals) {
            content = (
                <DataTable
                    emptyMessage="Sélection vide"
                    value={this.props.withdrawals}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste de toutes les demandes de retrait effectuées sur le fond"
                    paginator={true}
                    rows={10}
                    responsive={true}
                    selection={this.state.dataTableSelection}
                    onSelectionChange={event =>
                        this.setState({ dataTableSelection: event.value })
                    }
                >
                    <Column field="id" header="Id" sortable={true} />
                    <Column field="amount" header="Montant" sortable={true} />
                    <Column
                    
                        field="createdAt"
                        header="Date de demande"
                        sortable={true}
                        body={this.dateTemplate}
                    />
                    <Column
                        field="state"
                        header="Etat"
                        body={this.stateTemplate}
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
                                Toutes les demandes de retrait
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Historique de toutes les demandes de retrait</h1>
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
        withdrawals: state.operation.withdrawals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchWithdrawals: () =>
            dispatch(actions.fetchAllWithdrawals())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllWithdrawals);
