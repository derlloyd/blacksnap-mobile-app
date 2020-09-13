import React from "react";
import { StyleSheet, View } from "react-native";
// import { KeepAwake } from 'expo';
// import { useKeepAwake } from 'expo-keep-awake';
import { Actions } from "react-native-router-flux";
// import * as Animatable from "react-native-animatable";

// const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },
  textContainer: {},
  fullText: {
    fontFamily: "wolfsbane2",
    color: "blue",
    textAlign: "center",
    fontSize: 70,
    // position: "absolute"
  },
  outlineText: {
    fontFamily: "wolfsbane2-out",
    color: "blue",
    textAlign: "center",
    fontSize: 70
  }
});

const outline = {
  0: {
    opacity: 1
  },
  0.5: {
    opacity: 1
  },
  1: {
    opacity: 0
  }
};

const full = {
  0: {
    opacity: 0
  },
  0.5: {
    opacity: 1
  },
  1: {
    opacity: 0
  }
};

export default class Initial extends React.Component {
  _onDone = () => {
    Actions.BlackSnap();
  };
  render() {
    return (
      <View style={styles.container}>
      {/* <KeepAwake /> */}
        <View style={styles.textContainer}>
          <Text
            style={styles.fullText}
          >
            BlackSnap
          </Text>
          {/* <Animatable.Text
            // animation="fadeIn"
            animation={full}
            onAnimationEnd={this._onDone}
            duration={3000}
            style={styles.fullText}
          >
            BlackSnap
          </Animatable.Text> */}
          {/* <Animatable.Text
            // animation="fadeIn"
            animation={outline}
            // onAnimationEnd={this._onDone}
            duration={3000}
            style={styles.outlineText}
          >
            BlackSnap
          </Animatable.Text> */}
        </View>
      </View>
    );
  }
}
