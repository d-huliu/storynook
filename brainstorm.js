
// App structure for StoryNook - built with React Native (Expo)
// Splash > Auth (Google/Phone) > Name Input > Library > Recorder > Cover Upload

import AuthScreen from './screens/AuthScreen';


import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { SafeAreaProvider } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const Stack = createNativeStackNavigator();

function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Auth');
    }, 1500);
  }, []);

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>StoryNook</Text>
    </View>
  );
}

function AuthScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() => {
        navigation.replace('NameInput');
      });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Welcome to StoryNook</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>Sign in to save your bedtime stories</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneSignIn')}>
        <Text style={styles.buttonText}>📱 Sign in with Phone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>📧 Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

function NameInputScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleContinue = () => {
    navigation.replace('Library');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hi, my name is</Text>
      <TextInput style={styles.input} placeholder="Type your name" value={name} onChangeText={setName} />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Story Library</Text>
      <Text style={{ marginTop: 10, marginBottom: 20 }}>Coming soon: recorded stories will appear here.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9F7FB',
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#6A5ACD',
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
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});
