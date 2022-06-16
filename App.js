import * as React from 'react';
import * as Network from 'expo-network';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FileSystemUploadType } from 'expo-file-system';
import { useState } from "react";


export default function App() {
  const [image, setImage] = useState("https://cdn.sick.com/media/ZOOM/2/82/782/IM0077782.png");
  const [text, setText] = useState("Pick an image");


  
  const handleOcr = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    let connected = await Network.getNetworkStateAsync()
    if (!result.cancelled) {
      setImage(result.uri);
    }
    console.log(connected.isConnected)
    if(!connected.isConnected){
      Alert.alert(
        "No internet connection",
        `Please connect to the internet first`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return
    }

    console.log(image+"That was the image")
    const file = await FileSystem.uploadAsync('http://192.168.100.151:3000/binary-upload',image);
    console.log(file.body)
    setText(file.body)
    Alert.alert(
      "Done!",
      `Text extracted from image: ${file.body}`,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card_template}>
        <Image
          style={styles.card_image}
          source={{
            uri: 'https://cdn.sick.com/media/ZOOM/2/82/782/IM0077782.png',
          }}
        />
        <View style={styles.text_container}>
          <TouchableOpacity onPress={handleOcr}>
            <Text style={styles.card_title}>{text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_template: {
    width: 250,
    height: 250,
    boxShadow: '10px 10px 17px -12px rgba(0,0,0,0.75)',
  },
  card_image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  text_container: {
    position: 'absolute',
    width: 250,
    height: 30,
    bottom: 0,
    padding: 5,
    backgroundColor: 'rgba(0,0,0, 0.3)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  card_title: {
    color: 'white',
    textAlign: 'center',
  },
});
