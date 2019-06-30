import React, { Component } from "react";
import { Panel } from "primereact/components/panel/Panel";
import { Chart } from "primereact/chart";
import { connect } from "react-redux";
import * as actions from "../store/actions/dashboard";
import Spinner from "./UI/Spinner/Spinner";
import classnames from "classnames";
import { formatDate, formatMoney , formatDateEnglish} from "../utils/util";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

class Dashboard extends Component {
    componentDidMount() {
        this.props.onFetchDashboard();
    }

    state = {
        byDay: true,
        byMonth: false,
        dateFrom: "",
        years: [
            {label: '2019' , value: 2019}
        ],
        selectedYear: 2019
    };

    onFetchGraphDataHandler = () => {
        const type = this.state.byDay ? 'day' : 'month';
        const period = this.state.byDay ? formatDateEnglish(this.state.dateFrom) : this.state.selectedYear;
        this.props.onFetchGraphData(period , type);
    }

    render() {
        let content = <Spinner />;
        let { user } = this.props;
        const dashboard = this.props.dashboard;
        if (dashboard != null) {
            content = (
                <React.Fragment>
                    <div
                        className={
                            classnames('p-col-12 p-md-6' , {
                                'p-lg-4' : user.isAdmin,
                                'p-lg-2' : !user.isAdmin,
                            })
                        }>
                        <div className="p-grid overview-box overview-box-4">
                            <div className="overview-box-title">
                                <i className="fa fa-user" />
                                <span>Partenaires</span>
                            </div>
                            <div className="overview-box-count">
                                {dashboard.usersCount}
                            </div>
                            <div className="overview-box-stats">
                                Le fonds: {formatMoney(dashboard.fundAmount)}
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            classnames('p-col-12 p-md-6' , {
                                'p-lg-4' : user.isAdmin,
                                'p-lg-2' : !user.isAdmin,
                            })
                        }
                    >
                        <div className="p-grid overview-box overview-box-1">
                            <div className="overview-box-title">
                                <i className="fa fa-money" />
                                <span>Fonds</span>
                            </div>
                            <div className="overview-box-count">
                                {formatMoney(dashboard.fundCurrentAmount)}
                            </div>
                            <div className="overview-box-stats">
                                Montant actuel du fonds
                            </div>
                        </div>
                    </div>
                    {
                        !user.isAdmin && (<div className="p-col-12 p-md-6 p-lg-2">
                            <div className="p-grid overview-box overview-box-5">
                                <div className="overview-box-title">
                                    <i className="fa fa-money" />
                                    <span>Capital initial</span>
                                </div>
                                <div className="overview-box-count">
                                    {formatMoney(dashboard.userFundAmount)}
                                </div>
                                <div className="overview-box-stats">
                                    Ceci est le montant investi
                                </div>
                            </div>
                        </div>)
                    }
                    {
                        !user.isAdmin && (<div className="p-col-12 p-md-6 p-lg-2">
                            <div className="p-grid overview-box overview-box-3">
                                <div className="overview-box-title">
                                    <i className="fa fa-money" />
                                    <span>Capital restant actuel</span>
                                </div>
                                <div className="overview-box-count">
                                    {formatMoney(dashboard.userCurrentFundAmount)}
                                </div>
                                <div className="overview-box-stats">
                                    Montant actuel de votre capital
                                </div>
                            </div>
                        </div>)
                    }
                    {
                        !user.isAdmin && (<div className="p-col-12 p-md-6 p-lg-2">
                            <div className="p-grid overview-box overview-box-2">
                                <div className="overview-box-title">
                                    <i className="fa fa-bank" />
                                    <span>Vos bénéfices</span>
                                </div>
                                <div className="overview-box-count">
                                    {formatMoney(dashboard.userTotalGains)}
                                </div>
                                <div className="overview-box-stats">
                                    Vos bénéfices non retirés
                                </div>
                            </div>
                        </div>)
                    }
                    <div className="p-lg-8">
                        <div className="card">
                            <h1 className="centerText">
                                Graphique d'évolution du fonds
                            </h1>
                            <Panel header="Filtrer">
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-4">
                                        <RadioButton
                                            onChange={() => {
                                                if (!this.state.byDay) {
                                                    this.setState({
                                                        byDay: true,
                                                        byMonth: false
                                                    });
                                                }
                                            }}
                                            checked={this.state.byDay}
                                        />
                                        <label className="p-radiobutton-label">
                                            Par jour
                                        </label>
                                    </div>
                                    {this.state.byDay ? (
                                        <div className="p-col-12 p-md-4">
                                            <Calendar
                                                value={this.state.dateFrom}
                                                onChange={e =>
                                                    this.setState({
                                                        dateFrom: e.value
                                                    })
                                                }
                                            />
                                            <label className="p-radiobutton-label">
                                                A partir du
                                            </label>
                                        </div>
                                    ) : null}
                                    <div className="p-col-12 p-md-4">
                                        <RadioButton
                                            onChange={() => {
                                                if (!this.state.byMonth) {
                                                    this.setState({
                                                        byDay: false,
                                                        byMonth: true
                                                    });
                                                }
                                            }}
                                            checked={this.state.byMonth}
                                        />
                                        <label className="p-radiobutton-label">
                                            Par mois
                                        </label>
                                    </div>
                                    {this.state.byMonth ? (
                                        <div className="p-col-12 p-md-4">
                                            <Dropdown
                                                options={this.state.years}
                                                value={this.state.selectedYear}

                                                autoWidth={false}
                                            />

                                            <label className="p-radiobutton-label">
                                                Année
                                            </label>
                                        </div>
                                    ) : null}
                                    <div className="p-col-12 p-md-2">
                                        <Button label="Lancer le filtre"
                                            onClick={this.onFetchGraphDataHandler}
                                            disabled={this.props.loading || (this.state.byDay && !this.state.dateFrom)}
                                             />
                                    </div>
                                </div>
                            </Panel>
                            {
                                this.props.loading ? <Spinner /> : <Chart type="line" data={dashboard.graphData} />
                            }
                        </div>
                    </div>

                    <div className="p-col-12 p-lg-4 contacts">
                        <Panel
                            header={
                                <span>
                                    <i className="fa fa-line-chart" />
                                    <span> Dernières évolutions du fonds </span>
                                </span>
                            }
                        >
                            <ul>
                                {dashboard.lastVariations && dashboard.lastVariations.map(variation => (
                                    <li key={variation.id} className="clearfix">
                                        <div className="contact-info">
                                            <span className="name">
                                                {formatDate(variation.date)}
                                            </span>
                                        </div>
                                        <div className="contact-actions">
                                            <span
                                                className={classnames(
                                                    "connection-status",
                                                    { online: !variation.loss },
                                                    { offline: variation.loss }
                                                )}
                                            >
                                                {variation.percentage} %
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    </div>
                </React.Fragment>
            );
        }
        return <div className="p-grid dashboard">{content}</div>;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.fetchResource.loading,
        dashboard: state.dashboard.dashboard,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchDashboard: () => dispatch(actions.fetchDashboard()),
        onFetchGraphData: (type , period) => dispatch(actions.fetchGraphData(type , period))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
