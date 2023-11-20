import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";

const SignUpButton = () =>{
    return(
        <View style={styles.container}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.button]}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
        </View>
    );
}
export default SignUpButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 80,
        alignItems: 'center',
    },
    button:{
        height: 50,
        width: 340,
        borderRadius: 100,
        borderWidth: 2,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize:16,
        lineHeight:19,
        fontWeight: "600"
    }
})