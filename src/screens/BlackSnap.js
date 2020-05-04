import React from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Vibration,
  Platform,
  CameraRoll,
  Image,
  AsyncStorage
} from "react-native";
import { Text, Button, Icon } from "native-base";
import { Actions } from "react-native-router-flux";
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system';
import * as Brightness from 'expo-brightness';
// import {
  // Camera,
  // Permissions,
  // KeepAwake,
  // ScreenOrientation,
  // FileSystem,
  // Brightness
// } from "expo";

import { Spinner } from "../components/Spinner";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0
  },
  backgroundImage: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    resizeMode: 'cover',
  },
  blackOverlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 100
  },
  buttonsOverlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "stretch",
    zIndex: 200
  },
  buttonsOverlayRecording: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-end",
    zIndex: 200
  },
  topContainer: {
    flex: 1,
    // backgroundColor: "blue",
    flexDirection: "row"
  },
  topLeft: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  },
  topRight: {
    flex: 1,
    // backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    flex: 5,
    flexDirection: "column"
  },
  bottomTop: {
    flex: 4,
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomBottom: {
    flex: 3,
    // backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center"
  },
  dot: {
    fontSize: 5,
    color: "white",
    padding: 5
  }
});

export default class BlackSnap extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      hideDots: false,
      type: "back",
      isRecording: false,
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      hasAudioPermission: null,
      autoBrightness: null,
      brightness: null,
      vibrate: null,
      saveToCameraRoll: null,
      longPressRecStop: null,
      dotSize: null,
      backgroundUri: null,
    };
  }
  async componentWillMount() {
    // KeepAwake.activate();
    useKeepAwake();
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    await this._requestCameraPermission();
    await this._requestCameraRollPermission();
    await this._requestAudioPermission();
    this._loadSettings();
  }
  componentDidMount() {
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch(e => {
      // console.log("Directory photos exists")
    });
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "videos"
    ).catch(e => {
      // console.log("Directory videos exists")
    });
  }
  componentWillUnmount() {
    if (this.camera) {
      this.camera = null;
    }
  }
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };
  _permissionPopup = () => {
    Alert.alert(
      "Please allow access to use your Photos, Camera and Recording",
      "",
      [
        {
          text: "OK",
          onPress: () => Linking.openURL("app-settings:")
        },
        {
          text: "Cancel",
          style: "Cancel"
        }
      ],
      { cancelable: true }
    );
  };
  _requestCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === "granted" });
  };
  _requestAudioPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ hasAudioPermission: status === "granted" });
  };
  _loadSettings = async () => {
    // console.log('loading settings');
    try {
      const value = await AsyncStorage.getItem("settings");
      if (value !== null) {
        const settings = JSON.parse(value);
        // console.log('setting state with', settings);
        await this.setState(settings);
        this._getSetBrightness();
      } else {
        // if none, first time in app
        // go to onboarding screen that will show info and populate base settings
        Actions.Onboarding();
      }
    } catch (error) {
      // Error retrieving data
      alert(error);
      Actions.Onboarding();
    }
  };
  _getSetBrightness = async () => {
    if (!this.state.autoBrightness) {
      // auto adjust brightness not selected
      return;
    }

    const { status } = await Permissions.getAsync(
      Permissions.SYSTEM_BRIGHTNESS
    );
    if (status === "granted") {
      // save original brightness to state
      Expo.Brightness.getBrightnessAsync().then(brightness => {
        // console.log("original brightness", brightness);
        // change this screen to dark as possible
        Expo.Brightness.setSystemBrightnessAsync(0);
        // this will render dots and enable blacksnap
        this.setState({ brightness });
      });
    } else {
      // no permission to set brightness, state.brightness remains null
    }
  };
  _resetBrightness = async () => {
    if (!this.state.autoBrightness) {
      // auto adjust brightness not selected
      return;
    }

    const { status } = await Expo.Permissions.getAsync(
      Expo.Permissions.SYSTEM_BRIGHTNESS
    );
    if (status === "granted") {
      // brightness back to original
      if (this.state.brightness) {
        Expo.Brightness.setSystemBrightnessAsync(this.state.brightness);
      }
    }
  };
  _switchType = () => {
    let newType;

    if (this.state.type === "back") {
      newType = "front";
    } else if (this.state.type === "front") {
      newType = "back";
    }

    this.setState({ type: newType });
  };
  _takePicture = () => {
    if (this.camera) {
      this.camera
        .takePictureAsync()
        .then(data => {
          if (this.state.saveToCameraRoll) {
            // save data.uri to camera roll
            CameraRoll.saveToCameraRoll(data.uri)
              .then(uri => {
                // console.log("saved to camera roll", uri)
              })
              .catch(e => {
                // console.log("cameraRoll error", e)
                alert(e);
              });
          } else {
            // save data to filesystem using timestamp
            let now = Date.now();
            let newLocation = `${
              FileSystem.documentDirectory
            }photos/${now}.jpg`;

            FileSystem.copyAsync({
              from: data.uri,
              to: newLocation
            })
              .then(() => {
                // console.log("saved photo to filesystem", newLocation)
              })
              .catch(err => alert(err));
          }

          // wether cameraroll or internal, vibrate once pic taken
          if (this.state.vibrate) {
            Vibration.vibrate();
          }
        })
        .catch(err => alert(err));
    }
  };
  _startRecording = () => {
    // activate camera, then...
    if (this.camera) {
      this.setState({ isRecording: true });
      if (this.state.vibrate) {
        Vibration.vibrate();
      }

      this.camera
        .recordAsync()
        .then(data => {
          this.setState({ isRecording: false });
          if (this.state.vibrate) {
            // double vibration on end
            let PATTERN = Platform.OS === "ios" ? [5, 700] : [0, 500, 500, 500];
            Vibration.vibrate(PATTERN);
          }

          if (this.state.saveToCameraRoll) {
            // save data.uri to camera roll
            CameraRoll.saveToCameraRoll(data.uri)
              .then(uri => {
                // console.log("saved to camera roll", uri)
              })
              .catch(e => alert(e));
          } else {
            // save data.uri to filesystem
            let now = Date.now();
            let newLocation = `${
              FileSystem.documentDirectory
            }videos/${now}.mov`;

            FileSystem.copyAsync({
              from: data.uri,
              to: newLocation
            })
              .then(() => {
                // console.log("saved video to filesystem", newLocation)
              })
              .catch(err => alert(err));
          }
        })
        .catch(err => {
          this.setState({ isRecording: false });
          alert(err);
        });
    }
  };
  _stopRecording = () => {
    this.setState({ isRecording: false });

    if (this.camera) {
      this.camera.stopRecording();
    }
  };
  // _onFacesDetected = data => {
  //   if (data.faces.length === 0) {
  //     return console.log("no faces");
  //   }

  //   data.faces.forEach(item => {
  //     console.log("face", item.faceID);
  //   });
  // };
  _goToSettings = () => {
    // hide dots so they dont change brightness
    this.setState({ hideDots: true });

    Actions.Settings({
      settings: {
        ...this.state
      }
    });
  };

  _dot = () => {
    let extrastyle = {};
    if (this.state.hideDots) {
      extrastyle = { color: "black" };
    }
    return (
      <Icon
        name="md-water"
        style={[styles.dot, { fontSize: this.state.dotSize }, extrastyle]}
      />
    );
  };
  // list = async () => {
  //   const arr = await FileSystem.readDirectoryAsync(
  //     FileSystem.documentDirectory + "photos"
  //   );

  //   console.log("all files in photos directory", arr);
  //   const arr2 = await FileSystem.readDirectoryAsync(
  //     FileSystem.documentDirectory + "videos"
  //   );

  //   console.log("all files in videos directory", arr2);
  // };
  _renderOverlayButtons = () => {
    return (
      <View style={styles.buttonsOverlay}>
        {/* --- CAMERA TYPE BUTTON --- */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            onLongPress={this._goToSettings}
            style={styles.topLeft}
          >
            <Text> </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._switchType} style={styles.topRight}>
            {this.state.type === "back" && this._dot()}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          {/* --- RECORD VIDEO BUTTON --- */}
          <TouchableOpacity
            onPress={this._startRecording}
            style={styles.bottomTop}
          >
            {this._dot()}
          </TouchableOpacity>

          {/* --- TAKE PICTURE BUTTON --- */}
          <TouchableOpacity
            style={styles.bottomBottom}
            onPress={this._takePicture}
          >
            {this._dot()}
            {this._dot()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  _renderRecordingOverlay = () => {
    let { longPressRecStop } = this.state; 
    return (
      <TouchableOpacity
        onPress={longPressRecStop ? null : this._stopRecording}
        onLongPress={longPressRecStop ? this._stopRecording : null}
        style={styles.buttonsOverlayRecording}
      >
        {this._dot()}
      </TouchableOpacity>
    );
  };
  _renderBlack = () => {
    if (this.state.backgroundUri) {
      return (
        <View style={styles.blackOverlay}>
          <Image source={{ uri: this.state.backgroundUri }} style={styles.backgroundImage}/>
        </View>
      );
    } 
    return <View style={styles.blackOverlay} />;
  };
  render() {
    // console.log('blacksnap state', this.state);
    const {
      hasCameraPermission,
      hasCameraRollPermission,
      hasAudioPermission,
      brightness
    } = this.state;

    // when null, first loading, display nothing
    if (hasCameraPermission === null) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
        </View>
      );
    }

    // if any permissions not given
    if (
      hasCameraPermission === false ||
      hasCameraRollPermission === false ||
      hasAudioPermission === false
    ) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <Text note>Permissions Missing</Text>
          <Text> </Text>
          {!hasCameraRollPermission && (
            <Text>Camera Roll Permission Missing</Text>
          )}
          <Text> </Text>
          {!hasAudioPermission && (
            <Text>Microphone Recording Permission Missing</Text>
          )}
          <Text> </Text>
          <Button bordered full onPress={this._permissionPopup}>
            <Text>Request Access</Text>
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* <KeepAwake /> */}
        <StatusBar hidden />

        {/* FULL SCREEN CAMERA */}
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.camera}
          type={this.state.type}
          keepAwake
          // onFacesDetected={this._onFacesDetected}
        />

        {/* -- BLACK OVERLAY -- */}
        {this._renderBlack()}

        {/* -- BUTTONS -- */}
        {this.state.isRecording
          ? this._renderRecordingOverlay()
          : this._renderOverlayButtons()}
      </View>
    );
  }
}
