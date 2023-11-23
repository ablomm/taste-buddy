import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import LoginPage from "./pages/LoginPage";
import DietaryPreference from './pages/DietaryPreference';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <DietaryPreference />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
