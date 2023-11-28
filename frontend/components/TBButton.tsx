import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Pressable} from "react-native";

const SignUpButton = ({onPress, title}:any) =>{
    return(
        <View style={styles.container}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.button]} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        //flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    button:{
        height: 50,
        width: '95%',
        borderRadius: 100,
        borderWidth: 2,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize:16,
        lineHeight:19,
        fontWeight: "600"
    }
});



export default SignUpButton;