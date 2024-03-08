import {StyleSheet, Text, View} from "react-native";
import React from "react";

export function NoResultMessage({message}) {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        padding: 10
    },
    message: {
        textAlign: 'center',
        fontSize: 16
    }
});
