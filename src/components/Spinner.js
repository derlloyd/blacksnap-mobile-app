import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

// options: http://www.color-hex.com/color/ffffff
const white = "#cccccc";

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export const Spinner = () => {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator color={white} />
    </View>
  );
};
