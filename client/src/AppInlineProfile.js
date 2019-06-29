import React, { Component } from 'react';
import classNames from 'classnames';

export class AppInlineProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

    render() {
        return  <div>
                    <div className={classNames('profile', {'profile-expanded': this.state.expanded})}>
                        <button className="p-link" onClick={this.onClick}>
                            <img alt="Profile" className="profile-image" src="assets/layout/images/avatar.png" />
                            <span className="profile-name">Isabel Oliviera</span>
                            <i className="fa fa-fw fa-caret-down"></i>
                            <span className="profile-role">Marketing</span>
                        </button>
                    </div>
                    
                    <ul className="layout-menu profile-menu">
                        <li role="menuitem">
                            <button className="p-link" tabIndex={this.state.expanded ? null : '-1'}>
                                <i className="fa fa-fw fa-user"></i>
                                <span>Profile</span>
                            </button>
                            <div className="layout-menu-tooltip">
                                <div className="layout-menu-tooltip-arrow"></div>
                                <div className="layout-menu-tooltip-text">Profile</div>
                            </div>
                        </li>
                        <li role="menuitem">
                            <button className="p-link"  tabIndex={this.state.expanded ? null : '-1'}>
                                <i className="fa fa-fw fa-user-secret"></i>
                                <span>Privacy</span>
                            </button>
                            <div className="layout-menu-tooltip">
                                <div className="layout-menu-tooltip-arrow"></div>
                                <div className="layout-menu-tooltip-text">Privacy</div>
                            </div>
                        </li>
                        <li role="menuitem">
                            <button className="p-link"  tabIndex={this.state.expanded ? null : '-1'}>
                                <i className="fa fa-fw fa-cog"></i>
                                <span>Settings</span>
                            </button>
                            <div className="layout-menu-tooltip">
                                <div className="layout-menu-tooltip-arrow"></div>
                                <div className="layout-menu-tooltip-text">Settings</div>
                            </div>
                        </li>
                        <li role="menuitem">
                            <button className="p-link"  tabIndex={this.state.expanded ? null : '-1'}>
                                <i className="fa fa-fw fa-sign-out"></i>
                                <span>Logout</span>
                            </button>
                            <div className="layout-menu-tooltip">
                                <div className="layout-menu-tooltip-arrow"></div>
                                <div className="layout-menu-tooltip-text">Logout</div>
                            </div>
                        </li>
                    </ul>
                </div>
    }
}