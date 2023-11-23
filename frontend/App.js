import {userState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {Stack, useRouter} from 'expo-router';
import LoginPage from "./pages/LoginPage";
import LogInOrSignUpOptionPage from './pages/LogInOrSignUpOptionPage';

export default function App() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <LoginPage/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
