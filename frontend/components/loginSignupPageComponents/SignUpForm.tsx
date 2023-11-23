import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable } from "react-native";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SignUpButton from './buttons/SignUpButton';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../validatedInput';

const SignUpForm = () => {
    // define validation rules for each field
    const schema = yup.object().shape({
        username: yup
            .string()
            .required('Username is required')
            .min(3, 'Username must contain at least 3 characters'),
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid Email '),
        password: yup
            .string()
            .required('Password is required')
            .min(10, 'Password must contain at least 10 characters'),
        confirmPassword: yup
            .string()
            .required('Confirm password is required')
            .oneOf([yup.ref('password'), ''], "Passwords don't match")
    });

    const [username, onChangeUsername] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [confirmPassword, onChangePasswordConfirm] = React.useState('');

    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                }}

                validationSchema={schema}
                onSubmit={values => {
                    console.log(values);
                }}
                >

                {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={styles.container}>
                        <ValidatedInput
                            placeholder="Username"
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            error={errors.username}
                        />
                        <ValidatedInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                        />
                        <ValidatedInput
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                        />
                        <ValidatedInput
                            placeholder="Confirm Password"
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('passwordConfirm')}
                            value={values.confirmPassword}
                            error={errors.confirmPassword}
                        />

                        {/* <Button title="Sign Up" color={"black"}></Button> */}
                        <SignUpButton handlePress={handleSubmit as any} />
                    </View>)}
            </Formik>
        </>);
}
export default SignUpForm;

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
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        borderColor: "#E8E8E8"
    }
})