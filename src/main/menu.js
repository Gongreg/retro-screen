import React, { PropTypes } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap/lib';
import NavItem from 'nav-item/nav-item';
import MenuItem from 'menu-item/menu-item';
import { Link } from 'react-router';

export default React.createClass({
    displayName: 'Menu',

    propTypes: {
        screenData: PropTypes.object,
    },

    onChangeBrightness(e) {
        this.props.onChangeBrightness(e.target.value);
    },

    render() {

        const { screenData } = this.props;

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
                            <NavItem><Link to="clock">Clock</Link></NavItem>
                            <NavItem><Link to="equalizer">Equalizer</Link></NavItem>
                            <NavItem><Link to="scripts">Script runner</Link></NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem>
                                <div style={{ padding: '15px 0' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max={ screenData.maxBrightness }
                                        value={ screenData.brightness }
                                        onChange={ this.onChangeBrightness}
                                    />
                                </div>
                            </NavItem>
                            <NavItem><Link to="screen">Test screen</Link></NavItem>
                            <NavItem><a onClick={ this.props.onReset }>Reset</a></NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    },
});

