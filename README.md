![null](https://cloud.githubusercontent.com/assets/818400/17006668/c15f4ada-4ee2-11e6-8a3b-bbf0dcc65595.jpg)

# IoT Phone

IoT Phone is [React Native](https://facebook.github.io/react-native/) app converting your iPhone to fully enabled IoT Device. It sends Accelerometer, Gyroscope, Magnetometer and Geolocation data via MQTT. It can be used as a showcase and playground for many fun apps, such as tracking your location or create own database of tracking data for example. 

# Setup


## Setup the project:

```
$ git clone https://github.com/j8/IoT-Phone.git
$ cd IoT-Phone/
$ npm install
```

## Run React Native

```
npm start
```

## Xcode

Open the app in Xcode and AppDelegate.m file and change the following line with your IP address:

```
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.0.10:8081/index.ios.bundle?platform=ios&dev=true"];
```

## Change your host address to your IP in RCTWebSocketExecutor.m
NSString *URLString = [NSString stringWithFormat:@"http://0.0.0.0:%zd/debugger-proxy?role=client", port];

## Setup the MQTT broker

Edit the file in iotphone/IoTPhone/node_modules/react-native-mqtt/ios/RCTMqtt/Mqtt.m and change the self.defaultOptions to your MQTT cridentials:

```
        self.defaultOptions = @{
                                @"host": @"mqtt.relayr.io",
                                @"port": @1883,
                                @"protcol": @"tcp", //ws
                                @"tls": @NO,
                                @"keepalive": @120, //second
                                @"clientId" : @"T/BQQuGTfTzu88jG0q+C0Cw",
                                @"protocolLevel": @3,
                                @"clean": @YES,
                                @"auth": @YES,
                                @"user": @"fc1410b8-64df-4f3b-bcf2-31b4abe0b40b",
                                @"pass": @"mPb8AFT0npPe",
                                @"will": @NO,
                                @"willMsg": [NSNull null],
                                @"willtopic": @"",
                                @"willQos": @0,
                                @"willRetainFlag": @NO
                                };
```

# License
MIT