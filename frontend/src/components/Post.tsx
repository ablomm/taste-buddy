import React, {useState} from "react";
import { StyleSheet, Text, TextInput, View, Keyboard, Button, Image } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const cloudFrontUrl = "https://d1e4ghceuocadg.cloudfront.net/";

const Post = ({style, imageName }: any) => {    
    return (
        <View >
            <Image style={style} source={{ uri:cloudFrontUrl+imageName}}></Image>
        </View>
    );
};

export default Post;