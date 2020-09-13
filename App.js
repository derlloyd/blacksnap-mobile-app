import * as React from "react";
// import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { StyleProvider, Root } from "native-base";

import Router from './src/Routes';
import getTheme from './native-base-theme/components';
// import material from './native-base-theme/variables/material';


class App extends React.Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Font.loadAsync({
      // 'wolfsbane2-out': require('./assets/fonts/wolfsbane2iiout.ttf'),
      // 'wolfsbane2-grad': require('./assets/fonts/wolfsbane2iigrad.ttf'),
      wolfsbane2: require("./assets/fonts/wolfsbane2ii.ttf"),
      "ubuntu-light": require("./assets/fonts/Ubuntu-L.ttf")
    });

    // await Asset.fromModule(require('./assets/1.jpg')).downloadAsync();
    // await Asset.fromModule(require('./assets/2.jpg')).downloadAsync();
    // await Asset.fromModule(require('./assets/3.jpg')).downloadAsync();

    this.setState({ fontLoaded: true });
  }
  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }


    return (
      <StyleProvider style={getTheme()}>
        <Root>
          <Router />
        </Root>
      </StyleProvider>
    );
  }
}


export default App;
