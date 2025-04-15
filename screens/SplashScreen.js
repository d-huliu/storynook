// SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SplashScreen({ navigation }) {
  const handlePress = () => {
    navigation.replace('Library');
  };

  return (
    <TouchableOpacity style={styles.centered} onPress={handlePress}>
      <Text style={styles.title}>StoryNook</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#6A5ACD',
  },
});
