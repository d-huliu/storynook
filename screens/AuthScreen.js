import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

// ✅ The whole component must be wrapped in a function
export default function AuthScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_WEB_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
    iosClientId: '819188664091-iuo1s3qqct554l02f2iluhetha1vf6lpfd.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      const auth = getAuth();
      signInWithCredential(auth, credential).then(() => {
        navigation.replace('NameInput');
      });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Welcome to StoryNook</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Sign in to save your bedtime stories
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneSignIn')}>
        <Text style={styles.buttonText}>📱 Sign in with Phone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>📧 Sign in with Google</Text>
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
  button: {
    backgroundColor: '#BAA5F8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});


