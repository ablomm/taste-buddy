import React, { useEffect, useState } from 'react';
import {StyleSheet, ScrollView, NativeScrollEvent, RefreshControl} from 'react-native';
import { getPostPage } from '../functions/HTTPRequests';
import PostsGrid from './PostsGrid';

const AllPostsGrid = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [refreshing, setRefresh] = useState(false);

    const isCloseToBottom = (nativeEvent: NativeScrollEvent) => {

        const paddingToBottom = 20;
        return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom;
    };

    const retrievePosts = async () => {
        setPage(page + 1);
        try {
            let newPosts = await getPostPage(page);
            setData([...data, ...newPosts])
        } catch (error: any) {
            console.log("posts retrieving error")
            console.log(error)
        }
    };

    useEffect(() => {
        retrievePosts();
    }, []);

    const _onRefresh = React.useCallback(() => {
        setRefresh(true);
        console.log("refreshing")
        retrievePosts().then(() => {
            setRefresh(false);
        });
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.app}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                    retrievePosts();
                }
            }}
            scrollEventThrottle={400}
            refreshControl = {
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />
            }
        >
           <PostsGrid posts = {data}></PostsGrid>
        </ScrollView>
    );
};


const styles = StyleSheet.create({

    app: {
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

export default AllPostsGrid;
