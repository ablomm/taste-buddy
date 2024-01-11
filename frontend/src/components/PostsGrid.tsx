import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent, RefreshControl, Dimensions } from 'react-native';
import Post from './Post';

const PostsGrid = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [refreshing, setRefresh] = useState(false);

    const isCloseToBottom = (nativeEvent:NativeScrollEvent) => {
        
        const paddingToBottom = 20;
        return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - paddingToBottom;
    };

    const retrievePosts = async () => {
        setPage(page + 1);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/page/${page}`, {  //get secure s3 access url 
                method: 'GET',
            })
            .then((res) => { return res.json() })
            .then((json) => {         
                setData([...data, ...json])
            });
        } catch (error: any) {
            console.log("posts retrieving error")
            console.log(error)
        }
    };

    useEffect(() => {
        retrievePosts();
    }, []);

    const _onRefresh = React.useCallback(() => {
        setRefresh( true);
        console.log("refreshing")
        retrievePosts().then(() => {
            setRefresh(false);
        });
    }, [])
    
    return (
        <ScrollView contentContainerStyle={styles.app}
        onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
                retrievePosts();
            }
          }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={_onRefresh}
            />
          }
        >

            {data.map((post: any) => {
                return <Post key={post.id} imageUrl={post.image} />;
            })}
        </ScrollView>
    );
};


const styles = StyleSheet.create({

    app: {
        marginHorizontal: "auto",
        flexDirection: "row",
        justifyContent:"center",
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