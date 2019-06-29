import React, { Component } from "react";

export class AppFooter extends Component {
    render() {
        return (
            <div className="layout-footer">
                <span className="footer-text-left">
                    <img alt="Logo" src="assets/layout/images/logo-dark.png" />
                </span>
                <span className="footer-text-right">
                    <button className="p-link">
                        <i className="fa fa-facebook" />
                    </button>
                    <button className="p-link">
                        <i className="fa fa-twitter" />
                    </button>
                </span>
            </div>
        );
    }
}
