import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { NoResultMessage } from "./NoResultMessage";
import RecipeListItem from "../RecipeListItem";


export function RecipeTab({ navigation, search, recipes }) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        if (!refreshing) {
            setRefreshing(true);
            setTimeout(() => {
                search();
                setRefreshing(false);
            }, 1000);
        }
    }, [refreshing]);

    return (
        <>
            {recipes != null && recipes.length != 0 ?
                <View style={styles.container}>
                    <FlatList
                        data={recipes}
                        renderItem={({item}) => <RecipeListItem item={item} navigation={navigation}/>}
                        keyExtractor={item => item.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                </View>
                :
                <NoResultMessage message='No relevant recipes found.' />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 575
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        borderColor: '#c2c2c2',
        borderWidth: 1,
        borderRadius: 20,
        width: 'auto',
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    image: {
        backgroundColor: 'gray',
        aspectRatio: 1, // Set aspect ratio to 1:1 (square)
        height: 'auto',
        maxWidth: 'auto',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'white'
    },
    recipeContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 25
    },
    textContainer: {
        marginLeft: 10
    },
});
