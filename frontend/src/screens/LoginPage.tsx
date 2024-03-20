import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import LoginForm from "../components/loginSignupPageComponents/LoginForm";
import Header from "../components/header/Header";

const LoginPage = () =>{
    return(
        <View style={styles.container}>
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                    source={require("../../assets/logo/Logo.png")}
                    style={{ height: 42.7, width: 135.1, marginRight: 10}}
                />
                <Text >t a s t e b u d d y</Text>
            </View>
            <Header title = "Login"/>
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