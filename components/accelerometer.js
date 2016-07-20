import React, {
  Component,
  Text,
  Switch,
  View,
  DeviceEventEmitter
} from 'react-native';

let {Accelerometer} = require('NativeModules');

import styles from '../styles'

// Set timing intervals
Accelerometer.setAccelerometerUpdateInterval(1000);
// Set updates
Accelerometer.startAccelerometerUpdates();

let AccelerometerManager = React.createClass({
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

    DeviceEventEmitter.addListener('AccelerationData', function (data) {

      if(this.state.gyro) {
        let mqttData = JSON.stringify({meaning:"accelerometer", value: data})
        mqttClient.publish("/v1/" + this.props.deviceId + "/data", mqttData, 0, false);
      }

      this.setState({
        x: data.acceleration.x.toFixed(5),
        y: data.acceleration.y.toFixed(5),
        z: data.acceleration.z.toFixed(5)
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    Accelerometer.stopAccelerometerUpdates();
  },
  handleStart: function () {
    Accelerometer.startAccelerometerUpdates();
    this.setState({
      gyro: true
    });
  },
  handleStop: function () {
    Accelerometer.stopAccelerometerUpdates();
    this.setState({
      gyro: false
    });
  },
  render: function() {
    return (
      <View style={styles.widget}>
        <Text style={styles.welcome}>
          Accelerometer
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

export default AccelerometerManager;