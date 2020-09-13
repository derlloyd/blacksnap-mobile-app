import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { Text, Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as FileSystem from 'expo-file-system';
// import * as Animatable from "react-native-animatable";

import _ from "lodash";

import { Header } from "../components/Header";
import { Spinner } from '../components/Spinner';

const { width, height } = Dimensions.get("window");
// 3 pics in a row, each with 5 margin
const pictureSize = width / 3 - 5;

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
  pictures: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  picture: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: "contain"
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    marginBottom: 5,
    marginRight: 5
  }
});

export default class PhotoGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: null
    };
  }
  // componentWillMount() {
  //   // Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  //   this._loadPhotos();
  // }
  UNSAFE_componentWillReceiveProps() {
    this._loadPhotos();
  }
  componentDidMount() {
    this._loadPhotos();
    // console.log('did mount');
  }
  _loadPhotos() {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "photos").then(
      photosArray => {
        // new array that will contain obj with uri, width and height
        let photos = [];

        if (photosArray.length === 0) {
          // no results
          this.setState({ photos });
        }

        // there are pictures, iterate through each
        photosArray.forEach(photo => {
          let uri = `${FileSystem.documentDirectory}photos/${photo}`;

          // name of file is timestamp string, get it by splitting uri at .
          let filename = photo.split(".");
          let createdAt = Number(filename[0]);

          Image.getSize(
            uri,
            (width, height) => {
              photoInfo = {
                uri,
                width,
                height,
                createdAt
                // selected: false,
                // isPortrait: height > width ? true : false,
              };
              photos.push(photoInfo);
              // need this to keep setState until photos array fully populated
              if (photosArray.length === photos.length) {
                // sort photos by createdAt descending
                let sortedPhotos = _.sortBy(photos, "createdAt").reverse();

                this.setState({ photos: sortedPhotos });
              }
            },
            err => alert(err)
          );
        });
      }
    );
  }
  _back = () => {
    Actions.BlackSnap();
  };
  _onPressPhoto = (photo, i) => {
    Actions.PhotoDetails({ photo });
  };
  _renderContent = () => {
    let { photos } = this.state;
    if (photos === null) {
      return <Spinner />;
    }

    if (photos.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: white, textAlign: "center" }}>No Pictures</Text>
        </View>
      );
    }

    return (
      <ScrollView contentComponentStyle={{ flex: 1 }}>
        <View style={styles.pictures}>
          {this.state.photos.map((photo, i) => (
            <TouchableOpacity
              style={styles.pictureWrapper}
              key={photo.uri}
              onPress={() => this._onPressPhoto(photo, i)}
            >
              <Image
                // animation="fadeIn"
                key={photo.uri}
                style={styles.picture}
                source={{
                  uri: photo.uri
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
        <Header onPressBack={this._back} title="Picture Gallery" />

        <Text> </Text>

        {this._renderContent()}
      </View>
    );
  }
}
