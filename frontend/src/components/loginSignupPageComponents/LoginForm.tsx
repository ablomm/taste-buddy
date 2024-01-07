import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Alert } from "react-native";
import * as yup from 'yup';
import { Formik } from 'formik';
import ValidatedInput from '../ValidatedInput';
import { UserContext } from '../../providers/UserProvider';
import TBButton from '../TBButton';

const LoginForm = () => {
    const userContext = React.useContext(UserContext) as any;

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
    const onSubmit = async (data: any) => {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            });

            if (response.status !== 200) {
                Alert.alert("Login failed please try again")
            } else {
                userContext.login(data.username)
            }
        } catch (error: any) {
            Alert.alert("Login failed please try again")
            console.error(error.stack);
        }
    };
    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={onSubmit}
            validateOnChange={true}
            validationSchema={LoginFormSchema}
        >
            {({ errors, handleChange, handleBlur, handleSubmit, values, isValid }) => (
                <View style={styles.container}>
                    <ValidatedInput
                        placeholder='Username'
                        textContentType='username'
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        secureTextEntry={false}
                        value={values.username}
                        error={errors.username}
                    />

                    <ValidatedInput
                        placeholder='Password'
                        secureTextEntry={true}
                        textContentType='password'
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        error={errors.password}
                    />
                    <TBButton onPress={handleSubmit} title="Login"/>
                </View>
            )}
        </Formik>

    );
}
export default LoginForm;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 80,
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