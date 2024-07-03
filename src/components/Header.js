import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../assets/css/header.css';
import logo from '../assets/img/logo.png';
// import search_icon from '../assets/img/new_home/search-icon.png';
import 'font-awesome/css/font-awesome.min.css';
// import Chains from "./Chains";
import Account from "./Account/Account";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
// import arrow_down from "../assets/img/arrow-down.png";
// import arrow_up from "../assets/img/arrow-up.png";


class Header extends Component {
    constructor() {
        super();

        this.state = {
            mobileMenu: false,
            marketDropdown: false
        }
    }

    openMenu = () => {
        const openMenu = this.state.mobileMenu;
        this.setState({
            mobileMenu: !openMenu
        });
    }

    onLinkChange = (option) => {

        const { history } = this.props;
        history.push('/' + option.value);
    }

    render() {
        const { mobileMenu } = this.state;
        const options = [
            { label: 'PRIMARY', value: 'primary' }, { label: 'SECONDARY', value: 'secondary' }
        ];
        return (
            <>
                <div className="header">
                    <div className="logo">
                        <div className="logo-img">
                            <Link to="/">
                                <img src={logo} alt="logo image" />
                            </Link>
                        </div>
                    </div>
                    {/* <div className="search-icon">
                            <img src={search_icon} alt="search icon" />
                        </div> */}
                    <div className="menu-bar">
                        <div className="menu-link active">
                            <Link to="/">
                                HOME
                            </Link>
                        </div>
                        <div className="menu-link">
                            <Dropdown
                                className="header-item"
                                controlClassName="header-item-control"
                                menuClassName="header-item-menu"
                                options={options}
                                placeholder="MARKETS"
                                color="#1890ff"
                                onChange={this.onLinkChange}
                            />

                        </div>
                        <div className="menu-link">
                            <Link to="/artist">
                                ARTISTS
                            </Link>
                        </div>
                        <div className="menu-link">
                            <Link to="/collector">
                                COLLECTORS
                            </Link>
                        </div>
                        {/* <Chains /> */}
                        {/* <div className='menu-link'>
                            <NativeBalance />
                        </div> */}
                        {/* <div className='menu-link'>
                            <Link to='/nftbalance'>
                                COLLECTIONS
                            </Link>
                        </div> */}
                        <div className='menu-link font-family'>
                            <Account />
                        </div>
                    </div>
                    <div className="hamburger-menu" onClick={() => this.openMenu()}>
                        <i className="fa fa-bars"></i>
                    </div>
                </div>
                <div className="mobile-menu" style={mobileMenu ? { height: "fit-content", paddingTop: "22px", paddingBottom: "22px", paddingRight: "22px", paddingLeft: "22px" } : {}}>
                    <div className="mobile-link active">
                        <Link to="/">
                            HOME
                        </Link>
                    </div>
                    <div className="mobile-link">
                        {/* <Link  to="/market">
                            MARKETPLACE
                        </Link> */}
                        <span onClick={() => this.setState({ marketDropdown: !this.state.marketDropdown })}>MARKETPLACE</span>
                        {this.state.marketDropdown && <ul className='marketplace-menu' id='marketplace-menu'>
                            <li className='marketplace-item'>
                                <Link to="/primary">PRIMARY</Link>
                            </li>
                            <li className='marketplace-item'>
                                <Link to="/secondary">SECONDARY</Link>
                            </li>
                        </ul>}

                    </div>
                    <div className="mobile-link">
                        <Link to="/artist">
                            ARTISTS
                        </Link>
                    </div>
                    <div className="mobile-link">
                        <Link to="/collector">
                            COLLECTORS
                        </Link>
                    </div>

                    <div className='mobile-link font-family'>
                        <Account />
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(Header);