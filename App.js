// App structure for StoryNook - modularized version
// Splash > Auth (Google/Phone) > Name Input > Library > Recorder > Cover Upload

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Screens
import SplashScreen from '../storynook/screens/SplashScreen';
import AuthScreen from '../storynook/screens/AuthScreen';
import NameInputScreen from '../storynook/screens/NameInputScreen';
import LibraryScreen from '../storynook/screens/LibraryScreen';
import recorder from '../storynook/screens/Recorder'; 

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDmETa1EOlIHuzYTGDiiDctpkWi-s81Jt4",
  authDomain: "storynook-431a7.firebaseapp.com",
  projectId: "storynook-431a7",
  storageBucket: "storynook-431a7.firebasestorage.app",
  messagingSenderId: "819188664091",
  appId: "1:819188664091:web:aab4fd5dd5e5c1161bb5be",
  measurementId: "G-5320K8YBZ2"
};


// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            {/* change for testing */}
            <Stack.Screen name="Splash" component={SplashScreen} /> 
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
          <Stack.Screen name="Recorder" component={recorder} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


