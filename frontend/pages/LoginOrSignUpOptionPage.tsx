import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import SignUpButton from "../components/loginSignupPageComponents/buttons/SignUpButton";
import LoginButton from "../components/loginSignupPageComponents/buttons/LogInButton";

const LogInOrSignUpOptionPage = ({navigation}:any) =>{
    return(
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../assets/logo/Logo.png")} height={61} width={193}/>
                <Text style={styles.appNameText}>t a s t e    b u d d y</Text>
            </View>
            <SignUpButton handlePress={()=>navigation.push('SignUpPage')}/>
            <LoginButton handlePress={()=>navigation.push('LoginPage')}/>
        </View>
    );
}
export default LogInOrSignUpOptionPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flexShrink: 0,
        paddingVertical: 30,
        alignItems: 'center'
    },
    appNameText: {
        fontSize:16,
        paddingTop: 10,
        lineHeight:19,
    },
});