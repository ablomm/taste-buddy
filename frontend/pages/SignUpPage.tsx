import React from 'react';
import {View, Text, TextInput, StyleSheet, Button, Pressable} from "react-native";
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import SignUpButton from '../components/loginSignupPageComponents/buttons/SignUpButton';
import Header from '../components/header/Header';
import SignUpForm from '../components/loginSignupPageComponents/SignUpForm';

const SignUpPage = () =>{

// define validation rules for each field
const schema = yup.object().shape({
    username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must contain at least 3 characters'),
    password: yup
    .string()
    .required('Password is required')
    .min(10, 'Password must contain at least 10 characters'),
    confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'),''], "Passwords don't match")

});

//set up form with validation schema, pass resolver property with yupResolver(schema) to handle validation logic
const{
    control,
    handleSubmit,
    formState: {errors},
} = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
        username: ''
    }
})

const [username, onChangeUsername] = React.useState('');
const [email, onChangeEmail] = React.useState('');
const [password, onChangePassword] = React.useState('');
const [passwordConfirm, onChangePasswordConfirm] = React.useState('');

    return(<View style={styles.container}>
        <Header/>
        <SignUpForm/>
    </View>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
})
export default SignUpPage;