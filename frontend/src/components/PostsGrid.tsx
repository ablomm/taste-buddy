import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import Post from './Post';

const PostsGrid = () => {
    const [data, setData] = useState([]);

    const retrievePosts = async () => {

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/getPosts`, {  //get secure s3 access url 
                method: 'GET',
            })
                .then((res) => { return res.json() })
                .then((json) => {
                    console.log(json.posts)
                    setData(json.posts)
                });
        } catch (error: any) {
            console.log("posts retrieving error")
            console.log(error)
        }
    };

    useEffect(() => {
        retrievePosts();
    }, []);

    return (
        <View style={styles.app}>
            {data.map((post: any) => {
                return <Post key={post.id} imageUrl={post.recipeImage} />;
            })}
        </View>
    );
};



const styles = StyleSheet.create({

    app: {
        marginHorizontal: "auto",
        width: 400,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    item: {
        flex: 1,
        minWidth: 100,
        maxWidth: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "rgba(249, 180, 45, 0.25)",
        borderWidth: 1.5,
        borderColor: "#fff"
    }

});

export default PostsGrid;