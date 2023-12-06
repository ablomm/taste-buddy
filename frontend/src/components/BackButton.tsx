import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";

const BackButton = ({navigation}:any) =>{
    return(
        <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.buttonContainer]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>{`<<`}</Text>
        </Pressable>
    );
}
export default BackButton;

const styles = StyleSheet.create({
    buttonContainer:{
        height: 60,
        width: 30,
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