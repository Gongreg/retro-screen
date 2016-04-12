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
                <p>A website used to control raspberry to control a 16x16 led screen which can do many great things!</p>
                Available things:
                <ul>
                    <li>
                        Test screen
                    </li>
                </ul>

                <div className="center-block" style={{ width: '300px', height: '300px' }}>
                    <img className="img-responsive" src="images/logo.svg" />
                </div>
            </div>
        );
    },
});

