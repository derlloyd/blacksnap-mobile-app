import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Text } from "native-base";
import { Actions } from "react-native-router-flux";
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import _ from "lodash";

import { Spinner } from "../components/Spinner";
import { Header } from "../components/Header";

const { width, height } = Dimensions.get("window");
// 3 pics in a row, each with 5 margin
const videoSize = width / 3 - 5;

const white = "#cccccc";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  videos: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  video: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: "contain"
  },
  videoWrapper: {
    width: videoSize,
    height: videoSize,
    marginBottom: 5,
    marginRight: 5
    // borderWidth: 1,
    // borderColor: "blue"
  }
});

export default class VideoGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: null
    };
  }
  // componentWillMount() {
  //   // Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  //   this._loadVideos();
  // }
  UNSAFE_componentWillReceiveProps() {
    this._loadVideos();
  }
  componentDidMount() {
    this._loadVideos();
  }
  _loadVideos() {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "videos").then(
      videosArray => {
        // new array that will contain obj with uri, width and height
        let videos = [];

        if (videosArray.length === 0) {
          // no results
          this.setState({ videos });
        }

        // there are videos, iterate through each
        videosArray.forEach(video => {
          let uri = `${FileSystem.documentDirectory}videos/${video}`;

          // name of file is timestamp string, get it by splitting uri at .
          let filename = video.split(".");
          let createdAt = Number(filename[0]);

          let info = {
            uri,
            createdAt
          };

          videos.push(info);
        });

        let sortedVideos = _.sortBy(videos, "createdAt").reverse();
        this.setState({ videos: sortedVideos });
      }
    );
  }
  _back = () => {
    Actions.BlackSnap();
  };
  _onPressVideo = (video, i) => {
    Actions.VideoDetails({ video });
  };
  _renderContent = () => {
    let { videos } = this.state;
    if (videos === null) {
      return <Spinner />;
    }

    if (videos.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: white, textAlign: "center" }}>No Videos</Text>
        </View>
      );
    }

    return (
      <ScrollView contentComponentStyle={{ flex: 1 }}>
        <View style={styles.videos}>
          {this.state.videos.map((video, i) => (
            <TouchableOpacity
              style={styles.videoWrapper}
              key={video.uri}
              onPress={() => this._onPressVideo(video, i)}
            >
              <Video
                source={{ uri: video.uri }}
                resizeMode="contain"
                shouldPlay={false}
                style={{
                  flex: 1
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Header onPressBack={this._back} title="Video Gallery" />

        <Text> </Text>

        {this._renderContent()}
      </View>
    );
  }
}
