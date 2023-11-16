import React from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";

const SignUpPage = () =>{

const [username, onChangeUsername] = React.useState('');
const [email, onChangeEmail] = React.useState('');
const [password, onChangePassword] = React.useState('');
const [passwordConfirm, onChangePasswordConfirm] = React.useState('');


    return(<View>
        <Text>Sign Up</Text>
        <TextInput style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder='Username'
        />
        <TextInput style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder='Email'
        />
        <TextInput style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder='Password'
        />
        <TextInput style={styles.input}
        onChangeText={onChangePasswordConfirm}
        value={passwordConfirm}
        placeholder='Confirm Password'
        />
    </View>);
}


const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        width: 340,
        padding:10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        borderColor: "#E8E8E8"
    }
})
export default SignUpPage;