import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, Keyboard, Button, Image } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const Post = ({ imageUrl }: any) => {    
    return (
        <View >
            <Image style={styles.post} source={{ uri:imageUrl}}></Image>
        </View>
    );
};

// styles
const styles = StyleSheet.create({
    post: {
        backgroundColor: 'gray',
        color: "fff",
        margin: 1,
        padding: 1,
        height: 100,
        width: 100,
        borderWidth: 1, 
        borderColor: 'white'
    }
});

export default Post;