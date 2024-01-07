import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import { TouchableRipple } from "react-native-paper";

const BackButton = ({navigation}:any) =>{
    return(
        <TouchableRipple style={styles.buttonContainer} onPress={() => navigation.goBack()} borderless={true}>
            <Text style={styles.buttonText}>{`⇐`}</Text>
        </TouchableRipple>
    );
}
export default BackButton;

const styles = StyleSheet.create({
    buttonContainer:{
        height: 40,
        width: 40,
        borderRadius: 100,
        float:'left',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 'auto', 
    },
    buttonText: {
        fontSize:16,
        lineHeight:19,
        textAlign: 'center',
        fontWeight: "600",
    }
});