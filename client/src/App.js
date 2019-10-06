import React, { Component } from "react";
import classNames from "classnames";
import AppTopbar from "./AppTopbar";
import { withRouter } from 'react-router-dom';
import { AppInlineProfile } from "./AppInlineProfile";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import Dashboard from "./components/Dashboard";
import { ScrollPanel } from "primereact/components/scrollpanel/ScrollPanel";
import "primereact/resources/primereact.min.css";
import "fullcalendar/dist/fullcalendar.css";
import "font-awesome/css/font-awesome.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import PrivateRoute from "./components/utils/PrivateRoute";
import { connect } from "react-redux";
import MyWithdrawals from "./components/Withdrawals/MyWithdrawals";
import NewWithdrawal from "./components/Withdrawals/NewWithdrawal";
import AllWithdrawals from "./components/Withdrawals/AllWithdrawals";
import WaitingWithdrawals from "./components/Withdrawals/WaitingWithdrawals";
import AllUsers from "./components/Users/AllUsers";
import NewUser from "./components/Users/NewUser";
import FundVariations from "./components/Funds/FundVariations";
import AddDayliEvolution from "./components/Funds/AddDayliEvolution";
import UserFundVariations from "./components/Funds/UserFundVariations";
import ChangePassword from "./components/Users/ChangePassword";
import UpdateUser from "./components/Users/UpdateUser";
import Applications from "./components/Users/Applications";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutMode: "horizontal",
            profileMode: "inline",
            layoutCompact: true,
            overlayMenuActive: false,
            staticMenuDesktopInactive: false,
            staticMenuMobileActive: false,
            rotateMenuButton: false,
            topbarMenuActive: false,
            activeTopbarItem: null,
            darkMenu: false,
            menuActive: false,
            theme: "amber",
            layout: "sunkist",
            version: "v4"
        };

        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onTopbarMenuButtonClick = this.onTopbarMenuButtonClick.bind(this);
        this.onTopbarItemClick = this.onTopbarItemClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onRootMenuItemClick = this.onRootMenuItemClick.bind(this);
        this.createMenu();
        this.changeVersion(this.state.version);
    }

    onMenuClick(event) {
        this.menuClick = true;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.setState({
            rotateMenuButton: !this.state.rotateMenuButton,
            topbarMenuActive: false
        });

        if (this.state.layoutMode === "overlay") {
            this.setState({
                overlayMenuActive: !this.state.overlayMenuActive
            });
        } else {
            if (this.isDesktop())
                this.setState({
                    staticMenuDesktopInactive: !this.state
                        .staticMenuDesktopInactive
                });
            else
                this.setState({
                    staticMenuMobileActive: !this.state.staticMenuMobileActive
                });
        }

        event.preventDefault();
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.setState({ topbarMenuActive: !this.state.topbarMenuActive });
        this.hideOverlayMenu();
        event.preventDefault();
    }

    onTopbarItemClick(event) {
        this.topbarItemClick = true;

        if (this.state.activeTopbarItem === event.item)
            this.setState({ activeTopbarItem: null });
        else this.setState({ activeTopbarItem: event.item });

        event.originalEvent.preventDefault();
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.hideOverlayMenu();
        }
        if (!event.item.items && this.isHorizontal()) {
            this.setState({
                menuActive: false
            });
        }
    }

    onRootMenuItemClick(event) {
        this.setState({
            menuActive: !this.state.menuActive
        });
    }

    onDocumentClick(event) {
        if (!this.topbarItemClick) {
            this.setState({
                activeTopbarItem: null,
                topbarMenuActive: false
            });
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.setState({
                    menuActive: false
                });
            }

            this.hideOverlayMenu();
        }

        if (!this.rightPanelClick) {
            this.setState({
                rightPanelActive: false
            });
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    hideOverlayMenu() {
        this.setState({
            rotateMenuButton: false,
            overlayMenuActive: false,
            staticMenuMobileActive: false
        });
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.state.layoutMode === "overlay";
    }

    isHorizontal() {
        return this.state.layoutMode === "horizontal";
    }

    isSlim() {
        return this.state.layoutMode === "slim";
    }

    changeTheme(theme) {
        this.setState({ theme: theme });
        if (this.state.version === "v3") {
            this.changeStyleSheetUrl("theme-css", theme, "theme");
        } else {
            this.changeStyleSheetUrl("theme-css", theme + "-v4", "theme");
        }
    }

    changeLayout(layout, special) {
        this.setState({ layout: layout });
        if (this.state.version === "v3") {
            this.changeStyleSheetUrl("layout-css", layout, "layout");
        } else {
            this.changeStyleSheetUrl("layout-css", layout + "-v4", "layout");
        }

        if (special) {
            this.setState({
                darkMenu: true
            });
        }
    }

    changeVersion(version) {
        this.setState({ version: version });
        if (version === "v3") {
            this.changeStyleSheetUrl("layout-css", this.state.layout, "layout");
            this.changeStyleSheetUrl("theme-css", this.state.theme, "theme");
        } else {
            this.changeStyleSheetUrl(
                "layout-css",
                this.state.layout + "-v4",
                "layout"
            );
            this.changeStyleSheetUrl(
                "theme-css",
                this.state.theme + "-v4",
                "theme"
            );
        }
    }

    changeStyleSheetUrl(id, value, prefix) {
        let element = document.getElementById(id);
        let urlTokens = element.getAttribute("href").split("/");
        urlTokens[urlTokens.length - 1] = prefix + "-" + value + ".css";
        let newURL = urlTokens.join("/");
        element.setAttribute("href", newURL);
    }

    createMenu() {
        const user = this.props.user;
        const menu = [
            {
                label: "Tableau de bord",
                icon: "fa fa-fw fa-home",
                to: "/tableau-de-bord"
            }
        ];

        const fundSubmenu = {
            label: "Le fonds",
            icon: "fa fa-fw fa-money",
            items: [
                {
                    label: "Historique évolution journlière",
                    to: "/historique-evolution"
                }
            ]
        };

        const UsersSubmenu = {
            label: "Gestion des utilisateurs",
            icon: "fa fa-fw fa-users",
            items: [
                { label: "Liste des utilisateurs", to: "/utilisateurs" },
                { label: "Liste d'attente", to: "/liste-d-attente" },
                { label: "Ajouter un utilisateur", to: "/nouvel-utilisateur" }
            ]
        };

        const operationsSubmenu = {
            label: "Opérations",
            icon: "fa fa-fw fa-bars",
            items: [
                {
                    label: "Toutes les demandes de retraits",
                    to: "/tous-les-retraits"
                }
            ]
        }

        if (user) {
            if (user.isAdmin) {
                menu.push(UsersSubmenu);

                fundSubmenu.items.push({
                    label: "Ajouter l'évolution du jour",
                    to: "/ajouter-evolution-journalière"
                });
                operationsSubmenu.items.push({
                    label: "Demandes de retrait en attente",
                    to: "/retraits-en-attente"
                })
            } else {
                fundSubmenu.items.push({
                    label: "Historique de vos gains / pertes",
                    to: "/historique-evolution-client"
                });
                operationsSubmenu.items.push({
                    label: "Historique de vos retraits",
                    to: "/mes-retraits"
                });
                operationsSubmenu.items.push({
                    label: "Faire une demande de retrait",
                    to: "/nouveau-retrait"
                });
            }
            menu.push(operationsSubmenu);
            menu.push(fundSubmenu);
        }

        this.menu = menu;
    }

    render() {
        const user = this.props.user;
        let layoutClassName = classNames("layout-wrapper", {
            "menu-layout-static": this.state.layoutMode !== "overlay",
            "menu-layout-overlay": this.state.layoutMode === "overlay",
            "layout-menu-overlay-active": this.state.overlayMenuActive,
            "menu-layout-slim": this.state.layoutMode === "slim",
            "menu-layout-horizontal": this.state.layoutMode === "horizontal",
            "layout-menu-static-inactive": this.state.staticMenuDesktopInactive,
            "layout-menu-static-active": this.state.staticMenuMobileActive
        });
        let menuClassName = classNames("layout-menu-container", {
            "layout-menu-dark": this.state.darkMenu
        });

        return (
            <div className={layoutClassName} onClick={this.onDocumentClick}>
                <div>
                    <AppTopbar
                        profileMode={this.state.profileMode}
                        horizontal={this.isHorizontal()}
                        topbarMenuActive={this.state.topbarMenuActive}
                        activeTopbarItem={this.state.activeTopbarItem}
                        onMenuButtonClick={this.onMenuButtonClick}
                        onTopbarMenuButtonClick={this.onTopbarMenuButtonClick}
                        onTopbarItemClick={this.onTopbarItemClick}
                    />

                    <div className={menuClassName} onClick={this.onMenuClick}>
                        <ScrollPanel
                            ref={el => (this.layoutMenuScroller = el)}
                            style={{ height: "100%" }}
                        >
                            <div className="menu-scroll-content">
                                {this.state.profileMode === "inline" &&
                                    this.state.layoutMode !== "horizontal" && (
                                        <AppInlineProfile />
                                    )}
                                <AppMenu
                                    model={this.menu}
                                    onMenuItemClick={this.onMenuItemClick}
                                    onRootMenuItemClick={
                                        this.onRootMenuItemClick
                                    }
                                    layoutMode={this.state.layoutMode}
                                    active={this.state.menuActive}
                                />
                            </div>
                        </ScrollPanel>
                    </div>

                    <div className="layout-main">
                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/tableau-de-bord"
                            exact
                            component={Dashboard}
                        />
                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/changer-mot-de-passe"
                            exact
                            component={ChangePassword}
                        />

                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/utilisateurs"
                            exact
                            component={AllUsers}
                        />

                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/liste-d-attente"
                            exact
                            component={Applications}
                        />

                        <PrivateRoute
                            isAllowed={
                                user
                            }
                            redirectTo="/"
                            path="/nouvel-utilisateur"
                            exact
                            component={NewUser}
                        />

                        <PrivateRoute
                            isAllowed={
                                user
                            }
                            redirectTo="/"
                            path="/editer-un-utilisateur/:id"
                            exact
                            component={UpdateUser}
                        />

                        <PrivateRoute
                            isAllowed={this.props.user}
                            redirectTo="/"
                            path="/mes-retraits"
                            exact
                            component={MyWithdrawals}
                        />

                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/tous-les-retraits"
                            exact
                            component={AllWithdrawals}
                        />

                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/nouveau-retrait"
                            exact
                            component={NewWithdrawal}
                        />

                        <PrivateRoute
                            isAllowed={
                                user
                            }
                            redirectTo="/"
                            path="/retraits-en-attente"
                            exact
                            component={WaitingWithdrawals}
                        />

                        <PrivateRoute
                            isAllowed={this.props.user}
                            redirectTo="/"
                            path="/historique-evolution"
                            exact
                            component={FundVariations}
                        />
                        <PrivateRoute
                            isAllowed={
                                user
                            }
                            redirectTo="/"
                            path="/ajouter-evolution-journalière"
                            exact
                            component={AddDayliEvolution}
                        />
                        <PrivateRoute
                            isAllowed={user}
                            redirectTo="/"
                            path="/historique-evolution-client"
                            exact
                            component={UserFundVariations}
                        />
                    </div>

                    <div className="layout-mask" />

                    <AppFooter />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    };
};

export default withRouter(connect(mapStateToProps)(App));
