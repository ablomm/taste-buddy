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

const squareDimension = Math.floor(window.innerWidth/3 - 2);

// styles
const styles = StyleSheet.create({
    post: {
        backgroundColor: 'gray',
        margin: 1,
        padding: 1,
        height: 300,
        width: 300,
        borderWidth: 1, 
        borderColor: 'white'
    }
});

export default Post;