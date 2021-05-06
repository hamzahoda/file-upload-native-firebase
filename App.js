// // Example to Pick and Upload files in React Native
// // https://aboutreact.com/file-uploading-in-react-native/

// // Import React
// import React, { useState } from 'react';
// // Import core components
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity
// } from 'react-native';

// // Import Document Picker
// import DocumentPicker from 'react-native-document-picker';
// import database from '@react-native-firebase/database';

// // const reference = database().ref('/');
// import RNFetchBlob from 'rn-fetch-blob'
// var RNFS = require('react-native-fs');
// import { PermissionsAndroid } from 'react-native';

// import storage from '@react-native-firebase/storage';

//   const pm1 =  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
//   const pm2 =  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);


// //   const userResponse =  PermissionsAndroid.requestMultiple([
// //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
// //   ]);

// //   if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
// //       userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
// // }


// const App = () => {
//   selectFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });
    
//       console.log(res.uri);
//       //output: content://com.android.providers.media.documents/document/image%3A4055
    
//       RNFetchBlob.fs
//         .stat(res.uri)
//         .then((stats) => {
//           console.log("file:/"+stats.path);
//           const uri  = stats.path;
//   const filename = uri.substring(uri.lastIndexOf('/') + 1);
//   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//   const blob = new Blob([JSON.stringify(res, null, 2)], {type : 'application/json'});
//   console.log("Blob",blob)
// console.log(filename)
//   database().ref("/").child(`images/${filename.replace(".","-")}`).set(blob._data).then(()=>{console.log("successfull")})
//   const task = storage()
//     .ref(filename)
//     .putFile(uploadUri);

//      //output: /storage/emulated/0/WhatsApp/Media/WhatsApp Images/IMG-20200831-WA0019.jpg
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//       } else {
//         throw err;
//       }
//     }};

//   return (
//     <View style={styles.mainBody}>
//       <View style={{ alignItems: 'center' }}>
//         <Text style={{ fontSize: 30, textAlign: 'center' }}>
//           React Native File Upload Example
//         </Text>
//         <Text
//           style={{
//             fontSize: 25,
//             marginTop: 20,
//             marginBottom: 30,
//             textAlign: 'center',
//           }}>
//           www.aboutreact.com
//         </Text>
//       </View>
//       <TouchableOpacity
//         style={styles.buttonStyle}
//         activeOpacity={0.5}
//         onPress={selectFile}>
//         <Text style={styles.buttonTextStyle}>Select File</Text>
//       </TouchableOpacity>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   buttonStyle: {
//     backgroundColor: '#307ecc',
//     borderWidth: 0,
//     color: '#FFFFFF',
//     borderColor: '#307ecc',
//     height: 40,
//     alignItems: 'center',
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 15,
//   },
//   buttonTextStyle: {
//     color: '#FFFFFF',
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   textStyle: {
//     backgroundColor: '#fff',
//     fontSize: 15,
//     marginTop: 16,
//     marginLeft: 35,
//     marginRight: 35,
//     textAlign: 'center',
//   },
// });

// export default App;
















import React, { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { PermissionsAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Linking } from 'react-native';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [uploadTaskSnapshot, setUploadTaskSnapshot] = useState({});
  const [paused, setPaused] = useState(false);
  const [uploadTask, setUploadTask] = useState();
  const [downloadURL, setDownloadURL] = useState();


    const pm1 =  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  const pm2 =  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  const pm3 =  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

  const userResponse =  PermissionsAndroid.requestMultiple([
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
          reference.getDownloadURL().then((downloadURL) =>{
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
      <Text style={styles.title}>Firebase Storage</Text>
      <View>
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
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginVertical: 40,
  },
  button: {
    backgroundColor: '#47477b',
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