import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap/lib';
import NavItem from 'nav-item/nav-item';
import MenuItem from 'menu-item/menu-item';
import { Link } from 'react-router';

export default React.createClass({

    displayName: 'Main',

    render() {
        return (
            <div className="container">
                <h2>Retroscreen</h2>
                <div className="center-block" style={{ width: '500px', height: '500px' }}>
                    <img className="img-responsive" src="images/logo.svg" />
                </div>
            </div>
        );
    },
});

