import React, { Component } from "react";
import {
  StyleSheet,
  Alert,
  // CameraRoll,
  View
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import * as MediaLibrary from 'expo-media-library';
import { Text, Button, Icon } from "native-base";
import FitImage from "react-native-fit-image";
import { Actions } from "react-native-router-flux";
import Moment from "moment";
import * as FileSystem from 'expo-file-system';

import { Spinner } from "../components/Spinner";

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
  }
});

export default class PhotoDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: this.props.photo,
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
  _askMovePic = () => {
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
          onPress: () => this._movePic()
        }
      ],
      { cancelable: true }
    );
  };
  _askDeletePic = () => {
    Alert.alert(
      "Permanently Delete Picture?",
      "",
      [
        {
          text: "Cancel",
          style: "Cancel"
        },
        {
          text: "OK",
          onPress: () => this._deletePic()
        }
      ],
      { cancelable: true }
    );
  };
  _movePic = () => {
    this.setState({ spinner: true });
    // copy to Camera Roll
    // MediaLibrary.saveToLibraryAsync(data.uri)
    CameraRoll.save(this.state.photo.uri)
      .then(uri => {
        // then delete pic and go back
        this._deletePic();
      })
      .catch(e => alert("Camera Roll Error"));
  };
  _deletePic = () => {
    this.setState({ spinner: true });
    // delete from filesystem
    FileSystem.deleteAsync(this.state.photo.uri)
      .then(() => {
        // then pop back to grid,
        // passed random props to trigger componentWillReceiveProps to refresh
        Actions.pop({ refresh: { refresh: Math.random() } });
        // Actions.refresh(this.props)
      })
      .catch(err => alert(err));
  };
  render() {
    const { uri, height, width, createdAt } = this.state.photo;
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
            <FitImage
              source={{ uri }}
              resizeMode="contain"
              originalHeight={height}
              originalWidth={width}
              style={styles.fitImage}
            />
          )}
        </View>

        <View style={styles.bottomBox}>
          <Button transparent onPress={this._askMovePic}>
            <Text>To Camera Roll</Text>
          </Button>

          <Button transparent onPress={this._askDeletePic}>
            <Text>Delete Picture</Text>
          </Button>
        </View>
      </View>
    );
  }
}
