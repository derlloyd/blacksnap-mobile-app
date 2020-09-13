import * as React from 'react';
import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, createAppContainer } from "react-navigation";

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen ok</Text>
    </View>
  );
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);


// import React from 'react';
// import { StyleProvider, Root } from "native-base";
// import { StyleSheet, Text, View } from 'react-native';
// import { AppLoading } from 'expo';
// import * as Font from 'expo-font';

// // import getTheme from './native-base-theme/components';
// // import material from './native-base-theme/variables/material';

// import Route from './src/Routes';

// export default class App extends React.Component {
//   state = {
//     fontLoaded: false,
//   };
//   async componentDidMount() {
//     await Font.loadAsync({
//       // 'wolfsbane2-out': require('./assets/fonts/wolfsbane2iiout.ttf'),
//       // 'wolfsbane2-grad': require('./assets/fonts/wolfsbane2iigrad.ttf'),
//       'wolfsbane2': require('./assets/fonts/wolfsbane2ii.ttf'),
//       'ubuntu-light': require('./assets/fonts/Ubuntu-L.ttf'),
//     });

//     // await Asset.fromModule(require('./assets/1.jpg')).downloadAsync();
//     // await Asset.fromModule(require('./assets/2.jpg')).downloadAsync();
//     // await Asset.fromModule(require('./assets/3.jpg')).downloadAsync();

//     this.setState({ fontLoaded: true });
//   }
//   render() {
//     // if (!this.state.fontLoaded) {
//     //   return <AppLoading />;
//     // }

//     return (<View>
//                <Text>OOKOKOKOKOKOK Open up App.js okokokoko to start working on your app!</Text>
//       </View>);

//     return (
//       <StyleProvider style={getTheme()}>
//         <Root>
//           <Router />
//         </Root>
//       </StyleProvider>
//     );
//   }
// }

