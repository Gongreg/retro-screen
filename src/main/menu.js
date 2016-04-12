import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap/lib';
import NavItem from 'nav-item/nav-item';
import MenuItem from 'menu-item/menu-item';
import { Link } from 'react-router';

export default React.createClass({

    displayName: 'Menu',

    render() {
        return (
            <div>
                <Navbar className="topBar" inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">RetroScreen</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href="draw"><Link to="draw">Draw</Link></NavItem>
                            <NavItem><Link to="images">Images</Link></NavItem>
                            <NavDropdown title="Games" id="dropdown-games">
                                <MenuItem><Link to="nonogram">Nonogram</Link></MenuItem>
                                <MenuItem><Link to="snake">Snake</Link></MenuItem>
                                <MenuItem><Link to="tetris">Tetris</Link></MenuItem>
                                <MenuItem><Link to="ping-pong">Ping pong</Link></MenuItem>
                            </NavDropdown>
                            <NavItem><Link to="equalizer">Equalizer</Link></NavItem>
                            <NavItem><Link to="scripts">Script runner</Link></NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem><Link to="screen">Test screen</Link></NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    },
});

