import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

export interface ValidatedInputProps {
    placeholder: string,
    onChangeText: ((text: string) => void) | undefined,
    onBlur: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
    value: string | undefined,
    error: any,
}

const ValidatedInput = (props: ValidatedInputProps) => {
    let { placeholder, onChangeText, onBlur, value, error } = props;

    return (
        <View style={styles.input}>
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                onChangeText={onChangeText}
                onBlur={onBlur}
                value={value}
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
        color: "red",
        paddingLeft: 10
    },
    textInput: {
        height: 50,
        width: 340,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        borderColor: "#E8E8E8"
    }
})

export default ValidatedInput;