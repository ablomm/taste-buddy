import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Image} from "react-native";
import Header from '../components/header/Header';
import SignUpForm from '../components/loginSignupPageComponents/SignUpForm';

const SignUpPage = () => {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                    source={require("../../assets/logo/Logo.png")}
                    style={{ height: 42.7, width: 135.1, marginRight: 10}}
                />
                <Text >t a s t e b u d d y</Text>
            </View>
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