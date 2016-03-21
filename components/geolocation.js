import React, {
  Component,
  Text,
  Switch,
  View,
  DeviceEventEmitter
} from 'react-native';

import styles from '../styles'

var GeolocationManager = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      map: true
    };
  },
  handleStart: function () {
    this.setState({
      map: true
    });
  },
  handleStop: function () {
    navigator.geolocation.clearWatch(this.watchID);
    this.setState({
      map: false
    });
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
      var data = JSON.stringify(position.coords);
      var mqttClient = this.props.mqttClient;
      
      if(this.state.map) {
        var mqttData = JSON.stringify({meaning:"geo location", value: data})
        mqttClient.publish("/v1/" + this.props.deviceId + "/data", mqttData, 0, false);
      }

      this.setState({data});
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    return (
      <View style={styles.widget}>
        <Text style={styles.welcome}>
          Geolocation
        </Text>
        <Text style={styles.title}>Current position: </Text>
        <Text>{this.state.data}</Text>
        {
          <Switch 
          onValueChange={(value) => (value) ? this.handleStart(): this.handleStop()}
          value={this.state.map} />
        }
      </View>
    );
  }
});

export default GeolocationManager;
