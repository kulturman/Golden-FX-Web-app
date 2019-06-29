import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as authActions from './store/actions/auth';
import { Link } from 'react-router-dom';


class AppTopbar extends Component {

    static defaultProps = {
        onMenuButtonClick: null,
        onTopbarMenuButtonClick: null,
        onTopbarItemClick: null,
        profileMode: null,
        horizontal: false,
        topbarMenuActive: false,
        activeTopbarItem: null
    }

    static propTypes = {
        onMenuButtonClick: PropTypes.func.isRequired,
        onTopbarMenuButtonClick: PropTypes.func.isRequired,
        onTopbarItemClick: PropTypes.func.isRequired,
        profileMode: PropTypes.string.isRequired,
        horizontal: PropTypes.bool.isRequired,
        topbarMenuActive: PropTypes.bool.isRequired,
        activeTopbarItem: PropTypes.string
    }

    constructor() {
        super();
        this.state = {};
    }

    onTopbarItemClick(event, item) {
        if(this.props.onTopbarItemClick) {
            this.props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    render() {
        let topbarItemsClassName = classNames('topbar-items fadeInDown', {'topbar-items-visible': this.props.topbarMenuActive});

        return <div className="topbar clearfix">
            <div className="topbar-left">
                <img alt="Logo" src="assets/layout/images/logo.png" className="topbar-logo"  style = {{
                        height: '45px'
                    }}/>
            </div>

            <div className="topbar-right">
                <button className="p-link" id="menu-button" onClick={this.props.onMenuButtonClick}>
                    <i className="fa fa-angle-left"></i>
                </button>

                <button className="p-link" id="topbar-menu-button" onClick={this.props.onTopbarMenuButtonClick}>
                    <i className="fa fa-bars"></i>
                </button>
                <ul className={topbarItemsClassName}>
                    {(this.props.profileMode === 'top' || this.props.horizontal) &&
                    <li className={classNames('profile-item', {'active-top-menu': this.props.activeTopbarItem === 'profile'})}
                        onClick={(e) => this.onTopbarItemClick(e, 'profile')}>
                        <button className="p-link">
                            <span className="topbar-item-role">
                                { this.props.user ? this.props.user.name + ' ' + this.props.user.forename : ''}
                            </span>
                        </button>

                        <ul className="layout-menu fadeInDown">
                            <li role="menuitem">
                                <Link to='/changer-mot-de-passe' className="p-link">
                                    <i className="fa fa-fw fa-lock"></i>
                                    <span>Changer votre mot de passe</span>
                                </Link>
                            </li>
                            <li role="menuitem">
                                <Link to='/' className="p-link">
                                    <i className="fa fa-fw fa-user"></i>
                                    <span>Profil</span>
                                </Link>
                            </li>
                            <li role="menuitem">
                                <button className="p-link" onClick={this.props.onLogout}>
                                    <i className="fa fa-fw fa-sign-out"></i>
                                    <span>Déconnexion</span>
                                </button>
                            </li>
                        </ul>
                    </li>}
                </ul>
            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authActions.logout())
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(AppTopbar);