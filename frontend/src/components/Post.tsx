import React from "react";
import { StyleSheet, View, Image } from "react-native";

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
        margin: 1,
        padding: 1,
        height: 100,
        width: 100,
        borderWidth: 1,
        borderColor: 'white'
    }
});

export default Post;
