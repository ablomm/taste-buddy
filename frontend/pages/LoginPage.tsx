import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import LoginForm from "../components/loginSignupPageComponents/LoginForm";
import Header from "../components/header/Header";

const LoginPage = () =>{
    return(
        <View style={styles.container}>
            <Header/>
            <LoginForm/>
        </View>
    );
}
export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
});