/**
 * IoT Phone
 * https://github.com/j8/iotphone
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

let {
    Magnetometer
} = require('NativeModules');

let mqttClient;
let deviceId = 'fc1410b8-64df-4f3b-bcf2-31b4abe0b40b';

// Mqtt configurations

let relayr = {
  host: 'mqtt.relayr.io',
  port: 1883,
  clientId: 'T/BQQuGTfTzu88jG0q+C0Cw',
  user: deviceId,
  pass: 'mPb8AFT0npPe',
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
