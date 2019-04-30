import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Timekeeper from 'react-timekeeper';
import Checkbox from 'react-simple-checkbox';
import ioClient from '../io';

function CheckboxGroup(props) {
  return (
    <div style={{width: '54px', height: '54px', position: 'relative'}}>
      <span style={{position: 'absolute', alignSelf: 'center', fontSize: '24px', marginLeft: '3px'}}>{props.children}</span>
      <div style={{position: 'absolute'}}><Checkbox size={8} checked={props.s} onChange={() => props.onChange(props.k, !props.s)}/></div>
  </div>
  );
}

class Alarm extends PureComponent {
  static displayName = 'Alarm';

  static propTypes = {
    screenData: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      name: 'Pavadinimas',
      hour: {
        hour: 0,
        minute: 0,
      },
      days: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        0: false
      }
    }
  }

  onChangeTime = ({hour24, minute}) => {
    this.setState({
      hour: {
        hour: hour24,
        minute
      }
    });
  };

  onSelectDay = (k, s) => {
    this.setState({
      days: {
        ...this.state.days,
        [k]: s
      }
    });
  };

  onCreate = () => {
    ioClient.setAlarms(this.state);
  };

  removeAlarm = (k) => {
    ioClient.removeAlarm(k);
  }

  render() {

    const {hour, days} = this.state;

    const {loading} = this.props;

    if (loading) {
      return <div>Loading</div>;
    }



    return (
      <div className="clock">
        <h1>Alarm</h1>

        <h2>Current Alarms</h2>

        {Object.keys((this.props.screenData.alarms || {})).map(k =>
          (
            <div key={k} style={{marginBottom: '4px'}} onClick={() => this.removeAlarm(k)}>
              {k}: {this.props.screenData.alarms[k]}
            </div>
          )
        )}



        <div style={{marginTop: '100px'}}>

          <input value={this.state.name} style={{marginBottom: '20px'}} onChange={(e) => this.setState({name: e.target.value})}/>

          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
            <CheckboxGroup onChange={this.onSelectDay} k="1" s={days[1]}>M</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="2" s={days[2]}>T</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="3" s={days[3]}>W</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="4" s={days[4]}>T</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="5" s={days[5]}>F</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="6" s={days[6]}>S</CheckboxGroup>
            <CheckboxGroup onChange={this.onSelectDay} k="0" s={days[0]}>S</CheckboxGroup>

          </div>

          <div>
          <Timekeeper
            time={hour}
            switchToMinuteOnHourSelect
            onChange={this.onChangeTime}
          />
          </div>

          <button style={{marginTop: '20px'}} onClick={this.onCreate}>OK OK</button>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Alarm);
