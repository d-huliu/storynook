// RecorderScreen.js - with Firebase Storage upload and metadata ready
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RecorderScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // const stopRecording = async () => {
  //   console.log('Stopping recording..');
  //   setIsRecording(false);
  //   await recordingRef.current.stopAndUnloadAsync();
  //   const uri = recordingRef.current.getURI();
  //   console.log('Recording stored at', uri);

  //   const response = await fetch(uri);
  //   const blob = await response.blob();

  //   const filename = `recordings/${Date.now()}.m4a`;
  //   const storage = getStorage();
  //   const storageRef = ref(storage, filename);

  //   try {
  //     await uploadBytes(storageRef, blob);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     console.log('Uploaded to Firebase:', downloadURL);

  //     // Save story metadata in Firestore
  //     const db = getFirestore();
  //     await addDoc(collection(db, 'stories'), {
  //       audioUrl: downloadURL,
  //       createdAt: serverTimestamp(),
  //       title: 'Untitled Story', // Will be updatable with cover flow later
  //     });

  //     navigation.navigate('AddCover', { storyId: newStoryId });
  //   } catch (error) {
  //     console.error('Upload failed', error);
  //   }
  // };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setIsRecording(false);
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    console.log('Recording stored at', uri);
  
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const filename = `recordings/${Date.now()}.m4a`;
    const storage = getStorage();
    const storageRef = ref(storage, filename);
  
    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Uploaded to Firebase:', downloadURL);
  
      // Save story metadata in Firestore
      const db = getFirestore();
      const newStoryRef = await addDoc(collection(db, 'stories'), {
        audioUrl: downloadURL,
        createdAt: serverTimestamp(),
        title: 'Untitled Story', // Will be updatable with cover flow later
      });
  
      // Pass the new story ID to the AddCover screen
      navigation.navigate('AddCover', { storyId: newStoryRef.id });
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Your Story</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Start'} Recording</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F7FB',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#6A5ACD',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#BAA5F8',
    padding: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
