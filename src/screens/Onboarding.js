import React from "react";
import { StyleSheet, View, Dimensions, Image, AsyncStorage } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { Actions } from "react-native-router-flux";
import { Ionicons } from '@expo/vector-icons';
import { Text } from "native-base";

const { width, height } = Dimensions.get("window");
const black = "black";
const bgColor = "rgba(20,20,20,1)";
const white = "#cccccc";

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor:'black',
    paddingBottom: '30%'
  },
  image: {
    width: width,
    height: width * 0.8,
    resizeMode: 'contain'
  },
  title: {
    fontFamily: 'wolfsbane2',
    // fontFamily: "ubuntu-light",
    fontSize: 65,
    // color: white,
    color: "blue",
    textAlign: "center",
    marginBottom: 30
  },
  titleEnd: {
    fontFamily: 'wolfsbane2',
    // fontFamily: "ubuntu-light",
    fontSize: 80,
    color: "blue",
    textAlign: "center"
  },
  text: {
    marginTop: 20,
    fontFamily: "ubuntu-light",
    color: white
  },
  textEnd: {
    fontFamily: "ubuntu-light",
    fontSize: 40,
    color: white
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: white
  },
  skip: {
    color: white
  }
});

const slides = [
  {
    key: "one",
    title: "BlackSnap",
    titleStyle: styles.titleEnd,
    textStyle: styles.text,
    text:
      "BlackSnap lets you take pictures and record video from a completely black screen\n\nSave media to the private BlackSnap gallery or directly to your phone's Camera Roll",
    image: require("../../assets/panther_bg.jpg"),
    imageStyle: styles.image,
    bg: black
  },
  {
    key: "two",
    title: "Screen Sections",
    titleStyle: styles.title,
    textStyle: styles.text,
    text:
      "The BlackSnap screen is divided into 4 sections. The small indicator dots help you identify the sections\n\nBy default, the screen will automatically dim to the phone's lowest brightness setting",
    image: require("../../assets/img2Screens.png"),
    imageStyle: styles.image,
    bg: bgColor
  },
  {
    key: "three",
    title: "Record Video",
    titleStyle: styles.title,
    textStyle: styles.text,
    text:
      "Tap the middle section to start recording a video and the phone will vibrate once\n\nWhile recording, the screen will have only 1 indicator dot in the top corner\n\nTap again anywhere to stop recording and the phone will vibrate twice when done.  Instead of a tap, you can choose to stop recording with a long press",
    image: require("../../assets/img3Recordvideo.png"),
    imageStyle: styles.image,
    bg: bgColor
  },
  {
    key: "four",
    title: "Take Picture",
    titleStyle: styles.title,
    textStyle: styles.text,
    text:
      "Tap the lower third section to take a picture\n\nThis section has 2 indicator dots\n\nThe phone will vibrate after the picture is taken",
    image: require("../../assets/img4Takepic.png"),
    imageStyle: styles.image,
    bg: bgColor
  },
  {
    key: "five",
    title: "Front or Back",
    titleStyle: styles.title,
    textStyle: styles.text,
    text:
      "Tap the top right section to switch from back (with a dot) to front facing camera (no dot)",
    image: require("../../assets/img5Frontorback.png"),
    imageStyle: styles.image,
    bg: bgColor
  },
  {
    key: "six",
    title: "Background Image",
    titleStyle: styles.title,
    textStyle: styles.text,
    text:
      "In the Settings menu, you can select an image to use as the background to the BlackSnap screen\n\nFor example, a screenshot from your phone",
    image: require("../../assets/img6Bckgimg.png"),
    imageStyle: styles.image,
    bg: bgColor
  },
  {
    key: "seven",
    title: "Settings",
    // titleStyle: styles.title,
    // textStyle: styles.text,
    text:
      "Tap and HOLD the top left section to access the Settings menu. Modify indicator dot size, vibration alerts, background image and save location\n\nAccess galleries where you can view, delete and move captured media",
    image: require("../../assets/img7Settings.png"),
    // imageStyle: styles.image,
    // bg: bgColor
  },
  {
    key: "eight",
    title: "BlackSnap",
    titleStyle: styles.titleEnd,
    textStyle: styles.textEnd,
    text: "Please use BlackSnap responsibly",
    image: require("../../assets/panther_bg.jpg"),
    imageStyle: styles.image,
    bg: black
  }
];

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
  }
  // componentWillMount() {
  //   // Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  // }
  componentDidMount() {
    this._loadSettings();
  }
  _loadSettings = async () => {
    try {
      const value = await AsyncStorage.getItem("settings");
      if (value !== null) {
        // settings exist, do nothing
      } else {
        // if none, first time in app, set defaults
        this._saveDefaultSettings();
      }
    } catch (error) {
      // Error retrieving data
      alert(error);
    }
  };
  _saveDefaultSettings = async () => {
    const settings = JSON.stringify({
      vibrate: true,
      saveToCameraRoll: false,
      longPressRecStop: false,
      dotSize: 8,
      autoBrightness: true,
      backgroundUri: null
    });

    try {
      await AsyncStorage.setItem("settings", settings);
    } catch (error) {
      alert(error);
      // Error saving data
    }
  };
  _onDone = () => {
    Actions.BlackSnap();
  };
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderSkipButton = () => {
    return <Text style={styles.skip}>Skip</Text>
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  render() {
    return (
      <AppIntroSlider
        // dotColor={"red"}
        dotStyle={{backgroundColor: 'grey'}}
        activeDotStyle={{backgroundColor: 'blue'}}
        // activeDotColor={"white"}
        data={slides}
        renderItem={this._renderItem}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        renderSkipButton={this._renderSkipButton}
        showSkipButton={true}
        onDone={this._onDone}
        onSkip={this._onDone}
      />
    );
  }
}
