import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Image} from "react-native";
import Header from '../components/header/Header';
import SignUpForm from '../components/loginSignupPageComponents/SignUpForm';

const SignUpPage = () => {
    return (
        <View style={styles.container}>
            <Header title = "Sign Up" />
            <SignUpForm />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
})
export default SignUpPage;