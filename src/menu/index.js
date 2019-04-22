import React, {PureComponent} from 'react';
import {Nav, Navbar, Modal, ModalBody, ModalHeader, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import NavItem from './nav-item';
import * as actions from '../state/actions';


class Menu extends PureComponent {
  static displayName = 'Menu';

  state = {
    showModal: false,
  };

  onChangeBrightness = (e) => {
    this.props.dispatch(actions.onChangeBrightness(e.target.value));
  };

  onChangeVisualizerEnabled = () => {
    this.props.dispatch(actions.onChangeVisualizerEnabled());
  };

  onClickShutdown = () => {
    this.setState({
      showModal: true,
    });
  };

  onHide = () => {
    this.setState({
      showModal: false,
    });
  };

  onShutdown = () => {
    this.props.dispatch(actions.onShutdown());
  };

  onReset = () => {
    this.props.dispatch(actions.onReset());
  };

  render() {
    const {visualizerEnabled, maxBrightness, brightness} = this.props;

    return (
      <div>
        <Navbar className="topBar" inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">RetroScreen</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem href="draw"><Link to="/draw">Draw</Link></NavItem>
              <NavItem><Link to="/clock">Clock</Link></NavItem>
              <NavItem><Link to="/images">Images</Link></NavItem>
              <NavItem><Link to="/scripts">Scripts</Link></NavItem>
              <NavItem><Link to="/text">Text</Link></NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem>
                <div style={{padding: '15px 0'}}>
                  <label>
                    Visualizer
                    <input
                      type="checkbox"
                      checked={visualizerEnabled || false}
                      onChange={this.onChangeVisualizerEnabled}
                    />
                  </label>
                </div>
              </NavItem>
              <NavItem>
                <div style={{padding: '15px 0'}}>
                  <input
                    type="range"
                    min="0"
                    max={maxBrightness}
                    value={brightness}
                    onChange={this.onChangeBrightness}
                  />
                </div>
              </NavItem>
              <NavItem><Link to="screen">Test screen</Link></NavItem>
              <NavItem><a onClick={this.onReset}>Reset</a></NavItem>
              <NavItem><a onClick={this.onClickShutdown}>Shutdown</a></NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Modal show={this.state.showModal} onHide={this.onHide}>
          <ModalHeader closeButton>
            <Modal.Title>Turn off?</Modal.Title>
          </ModalHeader>
          <ModalBody>
            <Button onClick={this.onShutdown}>Shutdown</Button>
            <Button onClick={this.onHide}>Close</Button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  visualizerEnabled: state.screenData.visualizerEnabled,
  maxBrightness: state.screenData.maxBrightness,
  brightness: state.screenData.brightness,
});

export default connect(mapStateToProps)(Menu);
