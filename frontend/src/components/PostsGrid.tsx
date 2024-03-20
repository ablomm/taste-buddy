import React from 'react';
import {StyleSheet, View} from 'react-native';
import Post from './Post';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PostsGrid = ({posts, navigation = null}: any) => {
    navigation = navigation == null ? useNavigation() : navigation;

    return (
        <View style = {styles.container}>
            {posts.map((post: any) => {
                return (
                    <TouchableRipple
                        key={post.id}
                        onPress={() => {
                        navigation.push("ViewPostPage", post);
                    }}>
                        <Post key={post.id} imageUrl={post.image} />
                    </TouchableRipple>
                )
            })}
        </View>
    );
};


const styles = StyleSheet.create({

    container: {
        marginHorizontal: "auto",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    item: {
        flex: 1,
        minWidth: 100,
        maxWidth: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        backgroundColor: "rgba(249, 180, 45, 0.25)",
        borderWidth: 1,
        borderColor: "#fff"
    }

});

export default PostsGrid;
