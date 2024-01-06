import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

export interface ValidatedInputProps {
    placeholder?: string,
    onChangeText: ((text: string) => void) | undefined,
    onBlur: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
    value: string | undefined,
    error: any,
    style?: any,
    multiline?: boolean,
    textContentType?: any,
    secureTextEntry?: boolean,
}

const ValidatedInput = (props: ValidatedInputProps) => {
    let { placeholder = "", textContentType = "none", secureTextEntry = false, onChangeText, onBlur, value, error, style, multiline = false } = props;

    return (
        <>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                onBlur={onBlur}
                textContentType={textContentType}
                secureTextEntry={secureTextEntry}
                value={value}
                multiline={multiline}
                style={[
                    {
                        backgroundColor: value ? 'white' : '#F6F6F6',
                        color: value ? "#000" : "#BDBDBD",
                        borderColor: error ? 'red' : "#E8E8E8"
                    }, styles.textInput, style]}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </>
    );
}

const styles = StyleSheet.create({
    error: {
        display: "flex",
        color: "red",
        paddingLeft: 10
    },
    textInput: {
        flexGrow: 1,
        alignSelf: 'center',
        height: 50,
        margin: 10,
        width: '95%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    }
})

export default ValidatedInput;