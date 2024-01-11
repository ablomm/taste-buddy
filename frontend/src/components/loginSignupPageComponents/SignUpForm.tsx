import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable } from "react-native";
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import ValidatedInput from '../ValidatedInput';
import { UserContext } from '../../providers/UserProvider';
import TBButton from '../TBButton';

const SignUpForm = () => {

    const userContext = React.useContext(UserContext) as any;

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

    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={schema}
                onSubmit={async values => {
                    console.log(values);
                    try {
                        let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user`, {
                          method: 'POST',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                          },
                          credentials: 'include',
                          body: JSON.stringify({
                            username: values.username,
                            email: values.email,
                            password: values.password
                          })
                        });
                 
                        if (response.status !== 200) {
                            console.error("account creation unsuccessful");
                        } else {
                          console.log("account creation successful");
                          userContext.login(values.username);
                        }
                      } catch (error: any) {
                        console.error(error.stack);
                      }
                }}


            >

                {({ errors, handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={styles.container}>
                        <ValidatedInput
                            placeholder="Username"
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            textContentType='username'
                            secureTextEntry = {false}
                            value={values.username}
                            error={errors.username}
                        />
                        <ValidatedInput
                            placeholder="Email"
                            textContentType='emailAddress'
                            secureTextEntry = {false}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                        />
                        <ValidatedInput
                            placeholder="Password"
                            secureTextEntry = {true}
                            textContentType='password'
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                        />
                        <ValidatedInput
                            placeholder="Confirm Password"
                            secureTextEntry = {true}
                            textContentType='password'
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('passwordConfirm')}
                            value={values.confirmPassword}
                            error={errors.confirmPassword}
                        />

                        {/* <Button title="Sign Up" color={"black"}></Button> */}
                        <TBButton onPress={handleSubmit} title="Sign Up"/>
                    </View>)}
            </Formik>
        </>);
}
export default SignUpForm;

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
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        borderColor: "#E8E8E8"
    }
})