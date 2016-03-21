import React, {
  Component,
  Text,
  Switch,
  View,
  DeviceEventEmitter
} from 'react-native';

var {Gyroscope} = require('NativeModules');

import styles from '../styles'

// Set timing intervals
Gyroscope.setGyroUpdateInterval(0.3);
// Set updates
Gyroscope.startGyroUpdates();

var GyroscopeManager = React.createClass({
  getInitialState: function () {
    return {
      x: 0,
      y: 0,
      z: 0,
      gyro: true
    }
  },
  componentDidMount: function () {

  	var mqttClient = this.props.mqttClient;

    DeviceEventEmitter.addListener('GyroData', function (data) {

      if(this.state.gyro) {
        var mqttData = JSON.stringify({meaning:"gyroscope", value: data})
        mqttClient.publish("/v1/" + this.props.deviceId + "/data", mqttData, 0, false);
      }

      this.setState({
        x: data.rotationRate.x.toFixed(5),
        y: data.rotationRate.y.toFixed(5),
        z: data.rotationRate.z.toFixed(5)
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    Gyroscope.stopGyroUpdates();
  },
  handleStart: function () {
    Gyroscope.startGyroUpdates();
    this.setState({
      gyro: true
    });
  },
  handleStop: function () {
    Gyroscope.stopGyroUpdates();
    this.setState({
      gyro: false
    });
  },
  render: function() {
    return (
      <View style={styles.widget}>
        <Text style={styles.welcome}>
          Gyroscope
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

export default GyroscopeManager;