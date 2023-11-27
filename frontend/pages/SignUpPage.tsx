import React from 'react';
import {View, Text, TextInput, StyleSheet, Button, Pressable} from "react-native";
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import SignUpButton from '../components/loginSignupPageComponents/buttons/SignUpButton';
import Header from '../components/header/Header';
import SignUpForm from '../components/loginSignupPageComponents/SignUpForm';
import { Formik, Form, Field } from 'formik';

const SignUpPage = ({navigation}:any) =>{

const [username, onChangeUsername] = React.useState('');
const [email, onChangeEmail] = React.useState('');
const [password, onChangePassword] = React.useState('');
const [passwordConfirm, onChangePasswordConfirm] = React.useState('');

    return(<View style={styles.container}>
        <Header navigation = {navigation}/>
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