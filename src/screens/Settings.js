import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  Switch,
  View,
  AsyncStorage,
  Dimensions,
  Slider,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Text, Button, Icon } from "native-base";
import { Actions } from "react-native-router-flux";
import { RadioButtons } from "react-native-radio-buttons";
// import { ImagePicker } from 'expo';
import * as ImagePicker from 'expo-image-picker';

import { Header } from "../components/Header";
const { width, height } = Dimensions.get("window");
const isIphoneX =
Platform.OS === "ios" && height === 812 && width === 375;

// options: http://www.color-hex.com/color/ffffff
const white = "#cccccc";
const grey = "#666666";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 2,
    paddingBottom: isIphoneX ? 20 : 0,
  },
  itemRow: {
    flexDirection: "row",
    width,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(32,32,32,1)"
  },
  radioItem: {
    flexDirection: "row",
    width,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "black"
  },
  sliderContainer: {
    width,
    alignItems: "stretch",
    padding: 10,
    backgroundColor: "rgba(32,32,32,1)"
  },
  buttonsContainer: {
    flexDirection: "row",
    width
  },
  buttons: {
    flex: 1
  }
});

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.settings.saveToCameraRoll
        ? "Camera Roll"
        : "Internal Gallery",
      selectedLongPress: this.props.settings.longPressRecStop
        ? "Long Press Screen"
        : "Single Tap Screen",
      ...this.props.settings
    };
  }
  componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  }
  componentDidMount() {
    this._resetBrightness();
  }
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
  _updateLocalStorage = async () => {
    const settings = JSON.stringify({
      vibrate: this.state.vibrate,
      saveToCameraRoll: this.state.saveToCameraRoll,
      longPressRecStop: this.state.longPressRecStop,
      dotSize: this.state.dotSize,
      backgroundUri: this.state.backgroundUri,
      autoBrightness: this.state.autoBrightness
    });
    try {
      await AsyncStorage.setItem("settings", settings);
      // console.log("2. set to asyncstorage", settings);
    } catch (error) {
      alert(error);
    }
  };
  _toggleVibrate = async () => {
    await this.setState({ vibrate: !this.state.vibrate });
    this._updateLocalStorage();
  };
  _toggleAutoBrightness = async () => {
    await this.setState({ autoBrightness: !this.state.autoBrightness });
    this._updateLocalStorage();
  };
  _toPhotoGallery = () => {
    if (this.state.saveToCameraRoll) {
      Alert.alert('','Save to Camera Roll is selected');
    }
    Actions.PhotoGallery();
  };
  _toVideoGallery = () => {
    if (this.state.saveToCameraRoll) {
      Alert.alert('','Save to Camera Roll is selected');
    }
    Actions.VideoGallery();
  };
  _back = () => {
    Actions.BlackSnap();
  };
  _updateBackgroundUri = async value => {
    // alert(value)
    await this.setState({ backgroundUri: value });
    this._updateLocalStorage();
  };
  _onSlidingComplete = async dotSize => {
    await this.setState({ dotSize });
    this._updateLocalStorage();
  };
  _setSelectedOption = async selected => {
    let saveToCameraRoll;
    if (selected === "Camera Roll") {
      saveToCameraRoll = true;
    } else {
      saveToCameraRoll = false;
    }
    await this.setState({ saveToCameraRoll, selected });
    this._updateLocalStorage();
  };
  _setSelectedOptionLongPress = async selectedLongPress => {
    let longPressRecStop;
    if (selectedLongPress === "Long Press Screen") {
      longPressRecStop = true;
    } else {
      longPressRecStop = false;
    }
    await this.setState({ longPressRecStop, selectedLongPress });
    this._updateLocalStorage();
  };

  _toIntro = () => {
    Actions.Onboarding({
      settings: {
        ...this.state
      }
    });
  };
  _pickBackgroundImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    // console.log(result);

    if (!result.cancelled) {
      this._updateBackgroundUri(result.uri);
    }
  };
  _removeBackgroundImage = () => {
    // delete from filesystem
    Expo.FileSystem.deleteAsync(this.state.backgroundUri)
      .then(() => {
        // console.log('file deleted ---')
        // then change backgroundUri to null, that will change button
        this._updateBackgroundUri(null);
      })
      .catch(err => alert(err));
  }
  _renderOption = (option, selected, onSelect, index) => {
    return (
      <TouchableOpacity onPress={onSelect} key={index}>
        <View style={styles.radioItem}>
          <Text
            style={{
              color: selected ? white : grey,
              padding: 15,
              paddingLeft: 30
            }}
          >
            {option}
          </Text>
          {selected ? (
            <Icon
              name="md-checkmark"
              style={{ color: white, paddingRight: 20 }}
            />
          ) : (
            <Text> </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  _renderContainer = options => {
    return (
      <View
        style={{
          backgroundColor: "rgba(32,32,32,1)"
        }}
      >
        <View style={styles.radioItem}>
          <Text style={{ color: white, padding: 10 }}>
            Save Pictures and Videos To:
          </Text>
        </View>

        {options}
      </View>
    );
  };
  _renderContainerLongPress = options => {
    return (
      <View
        style={{
          backgroundColor: "rgba(32,32,32,1)"
        }}
      >
        <View style={styles.radioItem}>
          <Text style={{ color: white, padding: 10 }}>
            To Stop Video Recording:
          </Text>
        </View>

        {options}
      </View>
    );
  };
  _renderChooseBackgroundButton = () => {
    if (this.state.backgroundUri) {
      return (
        <Button full warning bordered onPress={this._removeBackgroundImage}>
        <Text>REMOVE BACKGROUND IMAGE</Text>
      </Button>
    );
    } else {
      return (
        <Button full bordered onPress={this._pickBackgroundImage}>
        <Text>ADD BACKGROUND IMAGE</Text>
      </Button>
    );
  }
  }
  render() {
    // console.log(this.state);
    return (
      <View style={styles.container}>
        <Header onPressBack={this._back} title="Settings" />

        <Text> </Text>
        <ScrollView>

        <View style={styles.sliderContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            >
            <Text style={{ color: white }}>Indicator Dot Size</Text>
            <Icon
              name="md-water"
              style={{
                fontSize: this.state.dotSize,
                color: "white",
                paddingRight: 5
              }}
              />
          </View>

          <Slider
            maximumValue={15}
            minimumValue={1}
            onSlidingComplete={this._onSlidingComplete}
            step={1}
            value={this.state.dotSize}
            minimumTrackTintColor={"blue"}
            thumbTintColor={white}
            />
        </View>

        <Text> </Text>

        <View style={styles.itemRow}>
          <Text style={{ color: white }}>Vibrate on Camera Action</Text>
          <Switch
            onValueChange={this._toggleVibrate}
            value={this.state.vibrate}
            onTintColor={"blue"}
            thumbTintColor={white}
            />
        </View>

        <Text> </Text>
          <RadioButtons
            options={["Single Tap Screen", "Long Press Screen"]}
            onSelection={this._setSelectedOptionLongPress}
            selectedOption={this.state.selectedLongPress}
            renderOption={this._renderOption}
            renderContainer={this._renderContainerLongPress}
            />
            <Text> </Text>

        <View style={styles.itemRow}>
          <Text style={{ color: white }}>Auto-Adjust Screen Brightness</Text>
          <Switch
            onValueChange={this._toggleAutoBrightness}
            value={this.state.autoBrightness}
            onTintColor={"blue"}
            thumbTintColor={white}
            />
        </View>

        <Text> </Text>

        {this._renderChooseBackgroundButton()}

        <Text> </Text>

        <RadioButtons
          options={["Camera Roll", "Internal Gallery"]}
          onSelection={this._setSelectedOption}
          selectedOption={this.state.selected}
          renderOption={this._renderOption}
          renderContainer={this._renderContainer}
          />

        <Text> </Text>

        <View style={styles.buttonsContainer}>
          <Button
            full
            bordered
            style={styles.buttons}
            onPress={this._toPhotoGallery}
            >
            <Text>PICTURE GALLERY</Text>
          </Button>
          <Button
            full
            bordered
            style={styles.buttons}
            onPress={this._toVideoGallery}
            >
            <Text>VIDEO GALLERY</Text>
          </Button>
        </View>

        <Text> </Text>

          <Button full bordered onPress={this._toIntro}>
            <Text>INSTRUCTIONS</Text>
          </Button>

        <Text> </Text>

        <View style={{ justifyContent: "center" }}>
          <Text note style={{ textAlign: "center" }}>
            BlackSnap version 3.1
          </Text>
          <Text note style={{ textAlign: "center" }}>
            Created by DevStudio Montreal
          </Text>
        </View>

        <Text> </Text>
            </ScrollView>
      </View>
    );
  }
}
