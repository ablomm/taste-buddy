import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";
import styles from '../../../styles/loginSignupPageComponents/buttons/loginSignupButtonStyles';
import axios from 'axios';

interface LoginButtonProps {
    onPress: () => void; // Define the type of the onPress function
}

const LoginButton : React.FC<LoginButtonProps> = ({ onPress }) => {
    /*const handleSubmit = async () => {
        try {
          let response = await axios.post('http://localhost:8080/login', {
            username: 'yourUsername', // replace with your data
            password: 'yourPassword', // replace with your data
          });
          alert("Login failed please try again")
          console.log('Response:', response.data);
          // Handle the response as needed
        } catch (error) {
          console.error('Error:', error);
        }
      };*/

    return(
        <View style={styles.container}>
            <Pressable onPress={onPress} style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.button]}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
        </View>
    );
}
export default LoginButton;
