import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import * as actions from "../../store/actions/operation";
import Spinner from "../UI/Spinner/Spinner";
import { formatDate } from "../../utils/util";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/util";
import classnames from "classnames";

class UserFundVariations extends Component {
    constructor() {
        super();
        this.dateTemplate = this.dateTemplate.bind(this);
        this.amountTemplate = this.amountTemplate.bind(this);
    }

    dateTemplate({ variation }) {
        return formatDate(variation.date);
    }

    amountTemplate(rowData, { field }) {
        return rowData[field] !== 0 ? this.evolutionColor(rowData[field] , rowData.variation.loss) : '-';
    }

    evolutionColor = (amount , loss) => {
        return (
            <span
                className={classnames(
                    "status",
                    { loss: loss },
                    { gain: !loss }
                )}
            >
                {formatMoney(amount)}
            </span>
        );
    }

    componentDidMount() {
        this.props.onFetchFundVariations();
    }

    render() {
        let content = <Spinner />;
        if (!this.props.loading && this.props.userFundVariations) {
            content = (
                <DataTable
                    emptyMessage="Sélection vide"
                    value={this.props.userFundVariations}
                    paginatorPosition="both"
                    selectionMode="single"
                    header="Liste de vos gains / pertes journaliers"
                    paginator={true}
                    rows={10}
                    responsive={true}
                >
                    <Column
                        header="Date"
                        sortable={true}
                        body={this.dateTemplate}
                    />
                    <Column
                        field="amountVariationOnUserGains"
                        body={this.amountTemplate}
                        header="Impact sur vos bénéfices (toujours positif ou nul)"
                    />
                    <Column
                        field="amountVariationOnUserFund"
                        header="Impact sur votre capital à la date concernée"
                        body={this.amountTemplate}
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
                                Historique de vos gains / pertes journaliers
                            </li>
                        </ol>
                    </nav>
                    <div className="card card-w-title">
                        <h1>Historique de vos gains / pertes journaliers</h1>
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
        userFundVariations: state.operation.userFundVariations
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchFundVariations: () => dispatch(actions.fetchUserFundVariations())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserFundVariations);
