import React, { Component } from "react";
import {
  StyleSheet,
  Alert,
  // CameraRoll,
  View,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { Text, Button, Icon } from "native-base";
import { Actions } from "react-native-router-flux";
import { Video } from 'expo-av';
import Moment from "moment";
import * as FileSystem from 'expo-file-system';

import { Spinner } from '../components/Spinner';

const white = "#cccccc";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center"
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerText: {
    color: white,
    textAlign: "center"
  },
  backIcon: {
    fontSize: 40,
    color: "blue",
    paddingRight: 60
  },
  spacer: {
    fontSize: 40,
    color: "black",
    paddingRight: 60
  },
  imageContainer: {
    flex: 1,
    margin: 20
  },
  fitImage: {
    flex: 1
  },
  bottomBox: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
});

export default class VideoDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      video: this.props.video,
      spinner: false
    };
  }
  // componentWillMount() {
  //   Expo.ScreenOrientation.allow(
  //     Expo.ScreenOrientation.Orientation.ALL_BUT_UPSIDE_DOWN
  //   );
  // }
  _back = () => {
    Actions.pop();
  };
  _askMoveVideo = () => {
    Alert.alert(
      "Move to Camera Roll?",
      "(also deletes from BlackSnap gallery)",
      [
        {
          text: "Cancel",
          style: "Cancel"
        },
        {
          text: "OK",
          onPress: () => this._moveVideo()
        }
      ],
      { cancelable: true }
    );
  };
  _askDeleteVideo = () => {
    Alert.alert(
      "Permanently Delete Video?",
      "",
      [
        {
          text: "Cancel",
          style: "Cancel"
        },
        {
          text: "OK",
          onPress: () => this._deleteVideo()
        }
      ],
      { cancelable: true }
    );
  };
  _moveVideo = () => {
    this.setState({ spinner: true });
    // copy to Camera Roll
    CameraRoll.save(this.state.video.uri)
      .then(uri => {
        // console.log("saved to camera roll", uri);
        // then delete video and go back
        this._deleteVideo();
      })
      .catch(e => alert(e));
  };
  _deleteVideo = () => {
    this.setState({ spinner: true });
    // delete from filesystem
    FileSystem.deleteAsync(this.state.video.uri)
      .then(() => {
        // then pop back to grid,
        // passed random props to trigger componentWillReceiveProps to refresh
        Actions.pop({ refresh: { refresh: Math.random() } });
      })
      .catch(err => alert(err));
  };
  render() {
    const { uri, createdAt } = this.state.video;
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Button transparent onPress={this._back}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </Button>

          <View>
            <Text style={styles.headerText}>
              {Moment(createdAt).format("ddd MMM D, YYYY")}
            </Text>
            <Text style={styles.headerText}>
              {Moment(createdAt).format("h:mm:ss a")}
            </Text>
          </View>

          <Button transparent>
            <Icon name="ios-arrow-back" style={styles.spacer} />
          </Button>
        </View>

        <View style={styles.imageContainer}>
          {this.state.spinner ? (
            <Spinner />
          ) : (
            <Video
              source={{ uri }}
              resizeMode="contain"
              shouldPlay={false}
              style={{
                flex: 1
              }}
              useNativeControls={true}
            />
          )}
        </View>

        <View style={styles.bottomBox}>
          <Button transparent onPress={this._askMoveVideo}>
            <Text>To Camera Roll</Text>
          </Button>

          <Button transparent onPress={this._askDeleteVideo}>
            <Text>Delete Video</Text>
          </Button>
        </View>
      </View>
    );
  }
}
