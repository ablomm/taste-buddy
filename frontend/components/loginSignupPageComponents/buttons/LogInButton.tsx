import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";
import styles from '../../../styles/loginSignupPageComponents/buttons/loginSignupButtonStyles';

const LoginButton = ({handlePress}:any) =>{
    return(
        <View style={styles.container}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.button]} onPress={handlePress}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
        </View>
    );
}
export default LoginButton;
