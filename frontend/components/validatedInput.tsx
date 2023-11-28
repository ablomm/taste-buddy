import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

export interface ValidatedInputProps {
    placeholder: string,
    onChangeText: ((text: string) => void) | undefined,
    onBlur: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
    value: string | undefined,
    error: any,
    textContentType?: any,
    secureTextEntry?: boolean,
}

const ValidatedInput = (props: ValidatedInputProps) => {
    let { placeholder, textContentType = "none", secureTextEntry = false, onChangeText, onBlur, value, error } = props;

    return (
        <View style={styles.input}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                onBlur={onBlur}
                textContentType={textContentType}
                secureTextEntry = {secureTextEntry}
                value={value}
                style={[
                    {backgroundColor: value? 'white' : '#F6F6F6',
                    color: value ? "#000":"#BDBDBD",
                    borderColor: error?'red':"#E8E8E8"} ,styles.textInput]}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        margin: 10
    },
    error: {
        display:"flex",
        color: "red",
        paddingLeft: 10
    },
    textInput: {
        height: 50,
        width: "100%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    }
})

export default ValidatedInput;