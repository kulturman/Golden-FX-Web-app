import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/operation";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate } from "../../utils/util";
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils/util';
import classnames from 'classnames';

class FundVariations extends Component {
    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.amountTemplate = this.amountTemplate.bind(this);
        this.percentageTemplate = this.percentageTemplate.bind(this);
    }

    dateTemplate(rowData) {
        return formatDate(rowData.date);
    }


    amountTemplate(rowData , { field }) {
        return formatMoney(rowData[field]);
    }

    percentageTemplate({ loss , percentage }) {
        return <span
        className={
            classnames(
                'status' ,
                { 'loss' : loss },
                { 'gain' : !loss },
            )
        }>
        {percentage} %
    </span>
    }

    componentDidMount() {
        this.props.onFetchFundVariations();
    }

    render() {
        let content = <Spinner />;
        if (!this.props.loading && this.props.fundVariations) {
            content = (
                <DataTable
                    emptyMessage="Sélection vide"
                    value={this.props.fundVariations}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste des évolutions journalières du fonds"
                    paginator={true}
                    rows={10}
                    responsive={true}
                >
                    <Column
                        field="data"
                        header="Date"
                        sortable={true}
                        body={this.dateTemplate}
                    />
                    <Column field='fundAmount' header="Montant du fonds avant" body={this.amountTemplate} />
                    <Column
                        body={this.percentageTemplate}
                        header="Evolution"
                    />
                    <Column field='amountWithVariation' header="Montant du fonds après" body={this.amountTemplate} />
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
                                Historique des évolutions journalières du fonds
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Historique des évolutions journalières du fonds</h1>
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
        fundVariations: state.operation.fundVariations
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchFundVariations: () =>
            dispatch(actions.fetchFundVariations())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FundVariations);
