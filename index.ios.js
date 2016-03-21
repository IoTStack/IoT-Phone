/**
 * IoT Phone
 * https://github.com/j8/iotphone
 * https://github.com/j8/iotdashboard/iotphone
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  ScrollView,
  Text,
  Switch,
  View,
} from 'react-native';

import styles from './styles'
import mqtt from 'react-native-mqtt';
import AccelerometerManager from './components/accelerometer';
import GyroscopeManager from './components/gyroscope';
import MagnetometerManager from './components/magnetometer';
import GeolocationManager from './components/geolocation';

var {
    Magnetometer
} = require('NativeModules');

var mqttClient;
var deviceId = '0b149cd1-ca2f-43c1-a853-a501d51e5748';

// Mqtt configurations

var iotstack = {
  host: '172.20.10.7',
  port: 1883,
  clientId: 'TCxSc0covQ8GoU6UB1R5XSA'
};

var relayr = {
  host: 'mqtt.relayr.io',
  port: 1883,
  clientId: 'TCxSc0covQ8GoU6UB1R5XSA',
  user: deviceId,
  pass: 'pkHIhk-o6R8y',
}

mqtt.createClient(relayr).then(function(client) {

  mqttClient = client;

  client.on('closed', function(msg) {
    alert('mqtt.event.closed' + msg);
  });

  client.on('error', function(msg) {
    alert('mqtt.event.error' + msg);
  });

  client.on('message', function(msg) {
    alert('msg' + msg)
  });

  client.on('connect', function() {
    alert('connected');
    client.subscribe("/v1/" + deviceId+ "/cmd", 0);
  });

  client.connect()

}).catch(function(err){
  alert('error' + err);
});

class IoTPhone extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.welcome}>
          IoT Phone
        </Text>
          <AccelerometerManager mqttClient={mqttClient} deviceId={deviceId}></AccelerometerManager>
          <GyroscopeManager mqttClient={mqttClient} deviceId={deviceId}></GyroscopeManager>
          <MagnetometerManager mqttClient={mqttClient} deviceId={deviceId}></MagnetometerManager>
          <GeolocationManager mqttClient={mqttClient} deviceId={deviceId}></GeolocationManager>
        </ScrollView>
      </View>
    );
  }
}

console.ignoreYellowBox = ['jsSchedulingOverhead'];
AppRegistry.registerComponent('IoTPhone', () => IoTPhone);
