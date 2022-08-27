import React, { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { PermissionsAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Linking } from 'react-native';

import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import img from './assets/img.png';
export default function App() {
  const [uploading, setUploading] = useState(false);
  const [uploadTaskSnapshot, setUploadTaskSnapshot] = useState({});
  const [paused, setPaused] = useState(false);
  const [uploadTask, setUploadTask] = useState();
  const [downloadURL, setDownloadURL] = useState();


  const pm1 = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  const pm2 = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  const pm3 = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

  const userResponse = PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.CAMERA,

  ]);

  //   if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
  //       userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
  // }


  // const reference = storage().ref('<filename>');
  // const reference = storage().ref('/directory1/directory2/filename.png');



  const onTakePhoto = () => launchCamera({ mediaType: 'image' }, onMediaSelect)

  const onTakeVideo = () => launchCamera({ mediaType: 'video' }, onMediaSelect);

  const onSelectImagePress = () =>
    launchImageLibrary({ mediaType: 'image' }, onMediaSelect);

  const onSelectVideoPress = () =>
    launchImageLibrary({ mediaType: 'video' }, onMediaSelect);



  const onMediaSelect = async (media) => {
    if (!media.didCancel) {
      setUploading(true);
      const reference = storage().ref(media.fileName);
      // console.log(media.uri)
      let task = reference.putFile(media.uri)
      setUploadTask(task);

      task.on('state_changed', (taskSnapshot) => {
        setUploadTaskSnapshot(taskSnapshot);
      });
      task.then(async () => {
        reference.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL)
          setDownloadURL(downloadURL);

        })
      });

      // .then(succ=>console.log(succ)).catch(err=>console.log(err))
    }
  };


  const togglePause = () => {
    if (paused) uploadTask.resume();
    else uploadTask.pause();
    setPaused((paused) => !paused);
  };


  return (
    <View style={styles.screen}>
      <View style={styles.titleBG}>
        <Text style={styles.title}>Firebase Storage</Text>
      </View>
      <View style={styles.container}>
        <Image source={img} style={styles.img}></Image>
        <TouchableOpacity style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onTakeVideo}>
          <Text style={styles.buttonText}>Record Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSelectImagePress}>
          <Text style={styles.buttonText}>Pick a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSelectVideoPress}>
          <Text style={styles.buttonText}>Pick a Video</Text>
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.uploading}>
          {!paused && <ActivityIndicator size={60} color="#47477b"></ActivityIndicator>}
          <Text style={styles.statusText}>
            {paused ? 'Paused' : 'Uploading'}
          </Text>
          <Text style={styles.statusText}>
            {`${((uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes) * 100).toFixed(2)}% / 100%`}
          </Text>
          <TouchableOpacity style={styles.button} onPress={togglePause}>
            <Text style={styles.buttonText}>{paused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>


          {downloadURL && (
            <TouchableOpacity
              style={[styles.button, styles.mediaButton]}
              onPress={() => Linking.openURL(downloadURL)}>
              <Text style={styles.buttonText}>View Media</Text>
            </TouchableOpacity>
          )}


        </View>
      )}

    </View>
  );
}














const styles = StyleSheet.create({
  titleBG: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    width: '100%',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',

  },
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 35,
    marginVertical: 45,
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'purple',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  center: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  uploading: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 20,
    fontSize: 20,
  },
  mediaButton: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 50,
    width: 300,
  },

});