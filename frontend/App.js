import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {Stack, useRouter} from 'expo-router';
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./pages/LoginPage";
import LogInOrSignUpOptionPage from './pages/LogInOrSignUpOptionPage';

export default function App() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Screen
          options = {{
            headerStyle: {backgroundColor: '#fff'}
          }}
        />
      </NavigationContainer>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
