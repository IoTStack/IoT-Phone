/**
 * IoT Phone
 * https://github.com/j8/iotphone
 * https://github.com/j8/iotdashboard/iotphone
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  ScrollView,
  Text,
  Switch,
  View,
  DeviceEventEmitter
} from 'react-native';

var Button = require('react-native-button');

var {
    Accelerometer,
    Gyroscope,
    Magnetometer
} = require('NativeModules');

// Set timing intervals
Accelerometer.setAccelerometerUpdateInterval(0.1); // in seconds
Gyroscope.setGyroUpdateInterval(0.1);
Magnetometer.setMagnetometerUpdateInterval(0.1);

// Set updates
Gyroscope.startGyroUpdates();
Accelerometer.startAccelerometerUpdates();
Magnetometer.startMagnetometerUpdates();

var AccelerometerManager = React.createClass({
  getInitialState: function () {
    return {
      x: 0,
      y: 0,
      z: 0,
      gyro: true
    }
  },
  componentDidMount: function () {
    DeviceEventEmitter.addListener('AccelerationData', function (data) {
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
    console.log(this.state);
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
    DeviceEventEmitter.addListener('GyroData', function (data) {
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

var MagnetometerManager = React.createClass({
  getInitialState: function () {
    return {
      x: 0,
      y: 0,
      z: 0,
      gyro: true
    }
  },
  componentDidMount: function () {
    DeviceEventEmitter.addListener('MagnetometerData', function (data) {
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
    console.log(this.state);
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

var Geolocation = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position.coords);
      this.setState({lastPosition});
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    return (
      <View>
      <Text style={styles.welcome}>
        Geolocation
      </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.state.lastPosition}
        </Text>
      </View>
    );
  }
});

class IoTPhone extends Component {
  render() {
    return (
      // <View style={styles.container}>
        <ScrollView>
        <Text style={styles.welcome}>
          IoT Phone
        </Text>
          <AccelerometerManager></AccelerometerManager>
          <GyroscopeManager></GyroscopeManager>
          <MagnetometerManager></MagnetometerManager>
          <Geolocation></Geolocation>
        </ScrollView>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  widget: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'whitesmoke',
    padding: 5,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
});

console.ignoreYellowBox = ['jsSchedulingOverhead'];

AppRegistry.registerComponent('IoTPhone', () => IoTPhone);
