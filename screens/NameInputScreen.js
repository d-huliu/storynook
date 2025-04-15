import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function NameInputScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleContinue = () => {
    navigation.replace('Library');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hi, my name is</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9F7FB',
  },
  label: {
    fontSize: 24,
    marginBottom: 12,
    color: '#6A5ACD',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BAA5F8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});

