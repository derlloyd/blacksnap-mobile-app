import React from "react";
// import { StyleSheet } from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";

import Initial from "./screens/Initial.js";
import BlackSnap from "./screens/BlackSnap";
import Onboarding from "./screens/Onboarding";
import Settings from "./screens/Settings";
import PhotoGallery from "./screens/PhotoGallery";
import VideoGallery from "./screens/VideoGallery";
import PhotoDetails from "./screens/PhotoDetails";
import VideoDetails from "./screens/VideoDetails";

const Route = () => (
  <Router
  // navigationBarStyle={styles.navBar}
  // titleStyle={styles.navBarTitle}
  // barButtonTextStyle={styles.barButtonTextStyle}
  // barButtonIconStyle={styles.barButtonIconStyle}
  >
    <Stack key="root">
      <Scene
        // type="reset"
        key="Initial"
        title="Initial"
        component={Initial}
        hideNavBar
        initial
        />

      <Scene
        type="reset"
        key="BlackSnap"
        title="BlackSnap"
        component={BlackSnap}
        hideNavBar
        />

      <Scene
        key="Onboarding"
        title="Onboarding"
        component={Onboarding}
        hideNavBar
      />

      <Scene key="Settings" title="Settings" component={Settings} hideNavBar />

      <Scene
        key="PhotoGallery"
        title="PhotoGallery"
        component={PhotoGallery}
        hideNavBar
      />

      <Scene
        key="VideoGallery"
        title="VideoGallery"
        component={VideoGallery}
        hideNavBar
      />

      <Scene
        key="PhotoDetails"
        title="PhotoDetails"
        component={PhotoDetails}
        hideNavBar
      />

      <Scene
        key="VideoDetails"
        title="VideoDetails"
        component={VideoDetails}
        hideNavBar
      />
    </Stack>
  </Router>
);

// const styles = StyleSheet.create({
//   navBar: {
//     backgroundColor: "#0D47A1"
//   },
//   navBarTitle: {
//     color: "#FFFFFF"
//   },
//   barButtonTextStyle: {
//     color: "#FFFFFF"
//   },
//   barButtonIconStyle: {
//     tintColor: "rgb(255,255,255)"
//   }
// });

export default Route;
