import {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import LogInOrSignUpStack from "./navigation";

export default function App() {
  const router = useRouter();
  const verifyUser = async () => {
    try {
      let response = await fetch('http://localhost:8080/authorize', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            console.log('Response:', response);

            if (response.status !== 200) {
                Alert.alert("Login failed please try again")
            }
    } catch {
      Alert.alert("Login failed please try again")
            console.error('Error:', error);
    }
  }

  useEffect(() =>{
    verifyUser();
  }, []) 

  return (
    <SafeAreaView style={styles.container}>
      <LogInOrSignUpStack/>
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
