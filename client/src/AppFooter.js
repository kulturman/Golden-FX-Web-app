import React, { Component } from "react";

export class AppFooter extends Component {
    render() {
        return (
            <div className="layout-footer">
                <span className="footer-text-left">
                    <img alt="Logo" src="assets/layout/images/logo.png" style = {{
                        height: '45px'
                    }}/>
                </span>
                <span className="footer-text-right">
                    <button
                        onClick={() => window.open('https://web.facebook.com/monpfm/' , '_blank')}
                        className="p-link">
                        <i className="fa fa-facebook" />
                        
                    </button>
                    <button className="p-link">
                        <i className="fa fa-twitter" />
                    </button>
                </span>
                <div className="footer-menu">
                    <ul className="footer-menu__items">
                        <li className="footer-menu__items">
                            <a href="#">Accueil</a>
                        </li>
                        <li className="footer-menu__items">
                            <a href="#">Qui sommes nous?</a>
                        </li>
                        <li className="footer-menu__items">
                            <a href="#">Que faisons nous?</a>
                        </li>
                        <li className="footer-menu__items">
                            <a href="#">Contactez nous</a>
                        </li>
                    </ul>
                </div>
                <div style={{textAlign: 'center'}}>
                    <p>Copyright &copy;	2019 all rights reserved</p>
                    <p>Private Fund Management</p>
                    <p>
                        <span>
                            <a href="#">Terms</a> /
                        </span>
                        <span>
                            <a href="#"> Privacy</a>
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}
