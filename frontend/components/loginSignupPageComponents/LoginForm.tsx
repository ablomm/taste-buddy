import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import LoginButton from './buttons/LogInButton';
import axios from 'axios';



const LoginForm = () => {
    const [username, onChangeUsername] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    // define validation rules for each field
    const schema = yup.object().shape({
        username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must contain at least 3 characters'),
        password: yup
        .string()
        .required('Password is required')
        .min(10, 'Password must contain at least 10 characters')

    });

    //set up form with validation schema, pass resolver property with yupResolver(schema) to handle validation logic
    const{
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues:{
            //username: ''
        }
    })

    let onSubmitHandler = async () => {
        try {
          let response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          });
          console.log('Response:', response);
        
        } catch (error) {
            alert("Login failed please try again")
            console.error('Error:', error);
        }
    };

    return(
        
        <View style={styles.container}>
            {/*<Controller 
            control={control}
            rules={{required:true,}}
            render={({field:{onChange, value}}) => (
                <TextInput 
                style={styles.input}
                value ={value}
                onChangeText={onChange}
                />
            )}
            name="username"
            />*/}
            
            {errors.username && <Text>{errors.username.message}</Text>}
                <TextInput style={styles.input}
                    onChangeText={onChangeUsername}
                    value={username}
                    placeholder='Username'
                />
            
                <TextInput style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder='Password'
                    secureTextEntry = {true}
                />
            <LoginButton onPress={() => onSubmitHandler()}/>
        </View>
        
    );
}
export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 80,
        alignItems: 'center',
    },
    input: {
        height: 50,
        width: 340,
        borderWidth: 1,
        padding:10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        borderColor: "#E8E8E8"
    }
})