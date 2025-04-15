// AddCoverScreen.js - upload image or choose from premium options
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export default function AddCoverScreen({ route, navigation }) {
  const { storyId } = route.params;
  const [coverUri, setCoverUri] = useState(null);

  const chooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setCoverUri(image.uri);
    }
  };

  const uploadCover = async () => {
    if (!coverUri) return;

    const response = await fetch(coverUri);
    const blob = await response.blob();
    const filename = `covers/${storyId}.jpg`;
    const storage = getStorage();
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    const db = getFirestore();
    await updateDoc(doc(db, 'stories', storyId), {
      coverUrl: downloadURL,
    });

    navigation.navigate('Library');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Cover Image</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={chooseFromGallery}>
        <Text style={styles.uploadText}>📷 Pick from Photo Library</Text>
      </TouchableOpacity>

      {coverUri && (
        <Image source={{ uri: coverUri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={uploadCover}>
        <Text style={styles.saveText}>✅ Save Cover</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9F7FB',
  },
  title: {
    fontSize: 24,
    color: '#6A5ACD',
    fontWeight: '600',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#BAA5F8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
  preview: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#6A5ACD',
    padding: 12,
    borderRadius: 10,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

