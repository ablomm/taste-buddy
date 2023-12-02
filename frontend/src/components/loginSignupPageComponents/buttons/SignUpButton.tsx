import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";
import styles from '../../../../styles/loginSignupPageComponents/buttons/loginSignupButtonStyles';

const SignUpButton = ({handlePress, isButtonInteractable}:any) =>{
    return(
        <View style={styles.container}>
            <Pressable disabled={!isButtonInteractable}
                style={({pressed}) => [
                {backgroundColor: pressed ? '#BDBDBD' : 'white',
                borderColor: isButtonInteractable ? "#000":"#BDBDBD"} ,styles.button]} onPress={handlePress}>
                <Text style={[{color: isButtonInteractable ? "#000":"#BDBDBD"},styles.buttonText]}>Sign Up</Text>
            </Pressable>
        </View>
    );
}
export default SignUpButton;