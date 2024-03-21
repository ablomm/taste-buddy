import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, NativeScrollEvent, RefreshControl } from 'react-native';
import Post from '../Post';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RelevantPostsGrid = ({posts}) => {
    const [refreshing, setRefresh] = useState(false);
    const navigation: any = useNavigation();

    const isCloseToBottom = (nativeEvent: NativeScrollEvent) => {

        const paddingToBottom = 20;
        return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom;
    };

    const _onRefresh = React.useCallback(() => {
        if (!refreshing) {
            setRefresh(true);
            console.log("Refreshing");
            setTimeout(()=>{
                setRefresh(false);
                console.log("Done Refreshing")
            }, 3000)
        }
    }, [refreshing]);

    return (
        <ScrollView contentContainerStyle={styles.app}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            console.log("Reached the bottom");
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

            {posts.map((post: any, index) => {
                return (
                    <TouchableRipple key={index} onPress={() => {
                        navigation.push("ViewPostPage", post);
                    }}>
                        <Post key={post.id} imageUrl={post.image} />
                    </TouchableRipple>
                )
            })}
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

export default RelevantPostsGrid;
