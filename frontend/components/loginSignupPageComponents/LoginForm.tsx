import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable, Alert} from "react-native";
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import { Formik } from 'formik';
import LoginButton from './buttons/LogInButton';
import Validator from 'email-validator';
import ValidatedInput from '../validatedInput';

const LoginForm = () =>{
    const [username, onChangeUsername] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    // define validation rules for each field
    const LoginFormSchema = yup.object().shape({
        username: yup
            .string()
            .required('Username is required')
            .min(3, 'Username must contain at least 3 characters'),
        password: yup
        .string()
        .required('Password is required')
        .min(10, 'Password must contain at least 10 characters')
    });    
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

            if (response.status !== 200) {
                Alert.alert("Login failed please try again")
            }
        } catch (error) {
            Alert.alert("Login failed please try again")
            console.error('Error:', error);
        }
    };
    return(
            <Formik
                initialValues={{username: '', password: ''}}
                onSubmit={(values)=>{
                    console.log(values)
                }}
                validateOnChange={true}
                validationSchema={LoginFormSchema}
            >
                {({errors, handleChange, handleBlur, handleSubmit, values, isValid}) =>(
                    <View style={styles.container}>
                        <ValidatedInput 
                            placeholder='Username'
                            textContentType='username'
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            secureTextEntry = {false}
                            value={values.username}
                            error={errors.username}
                        />
                        
                        <ValidatedInput 
                            placeholder='Password'
                            secureTextEntry = {true}
                            textContentType='password'
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                        />
                        <LoginButton handlePress={handleSubmit} isButtonInteractable={isValid}/>
                    </View>
                )}
            </Formik>
        
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
        padding: 10,
        margin: 10,
        borderRadius: 10,
        borderColor: "#E8E8E8"
    }
})