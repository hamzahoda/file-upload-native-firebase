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







