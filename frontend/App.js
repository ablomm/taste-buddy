import {userState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {Stack, userRouter} from 'expo-router';
import LoginPage from "./pages/LoginPage";
import LogInOrSignUpOptionPage from './pages/LogInOrSignUpOptionPage';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LogInOrSignUpOptionPage/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
