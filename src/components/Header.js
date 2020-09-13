import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import { Text, Icon, Button } from "native-base";
// import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");
const isIphoneX =
Platform.OS === "ios" && height === 812 && width === 375;

// options: http://www.color-hex.com/color/ffffff
const white = '#cccccc';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingTop: isIphoneX ? 40 : 0,
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
  },
  backIcon: {
    fontSize: 40,
    color: "blue",
    paddingTop: isIphoneX ? 55 : 25,
    paddingBottom: 25,
    paddingLeft: 5,
    paddingRight: 60,
  }
});

  export const Header = ({
    onPressBack,
    title,
  }) => {
  
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={onPressBack}
            style={styles.backIconContainer}
          >
            <Icon name="ios-arrow-back-outline" style={styles.backIcon} />
          </TouchableOpacity>
  
          <Text
            // animation="fadeIn"
            style={{
              fontFamily: "wolfsbane2",
              color: "blue",
              textAlign: "center",
              fontSize: 70
            }}
            >
            BlackSnap
          </Text>
  
          <Text style={{ color: white, textAlign: "center", fontSize: 25 }}>
            {title}
          </Text>

        </View>
      );
    }
  
  