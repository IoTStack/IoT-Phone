import React, {
  Component,
  Text,
  Switch,
  View,
  DeviceEventEmitter
} from 'react-native';

let {Magnetometer} = require('NativeModules');

import styles from '../styles'

// Set timing intervals
Magnetometer.setMagnetometerUpdateInterval(1000);
 // in seconds
Magnetometer.startMagnetometerUpdates();

let MagnetometerManager = React.createClass({
  getInitialState: function () {
    return {
      x: 0,
      y: 0,
      z: 0,
      gyro: true
    }
  },
  componentDidMount: function () {

    let mqttClient = this.props.mqttClient;

    DeviceEventEmitter.addListener('MagnetometerData', function (data) {

      if(this.state.gyro) {
        let mqttData = JSON.stringify({meaning:"magnetometer", value: data})
        mqttClient.publish("/v1/" + this.props.deviceId + "/data", mqttData, 0, false);
      }

      this.setState({
        x: data.magneticField.x.toFixed(5),
        y: data.magneticField.y.toFixed(5),
        z: data.magneticField.z.toFixed(5)
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    Magnetometer.stopMagnetometerUpdates();
  },
  handleStart: function () {
    Magnetometer.startMagnetometerUpdates();
    this.setState({
      gyro: true
    });
  },
  handleStop: function () {
    Magnetometer.stopMagnetometerUpdates();
    this.setState({
      gyro: false
    });
  },
  render: function() {
    return (
      <View style={styles.widget}>
        <Text style={styles.welcome}>
          Magnetometer
        </Text>
        <Text>x: {this.state.x}</Text>
        <Text>y: {this.state.y}</Text>
        <Text>z: {this.state.z}</Text>
        {
          <Switch 
          onValueChange={(value) => (value) ? this.handleStart(): this.handleStop()}
          value={this.state.gyro} />
        }
      </View>
    );
  }
});

export default MagnetometerManager;