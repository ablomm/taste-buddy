import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";
import styles from '../../../styles/loginSignupPageComponents/buttons/loginSignupButtonStyles';

const SignUpButton = () =>{
    return(
        <View style={styles.container}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.button]}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
        </View>
    );
}
export default SignUpButton;