import {FlatList, Image, RefreshControl, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useState} from "react";
import {NoResultMessage} from "./NoResultMessage";
import {TouchableRipple} from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import {Recipe} from "../../interfaces/RecipeInterface";


export function RecipeTab({navigation, search, recipes}) {
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

    const Recipe = ({ item }: { item: Recipe }) => (
        <TouchableRipple onPress={()=> navigation.navigate('RecipePage', {
            recipe: item
        })}>
            <View style={styles.recipeContainer}>
                <Image style={styles.image} source={{ uri:item.recipeImage}} />
                <View style={styles.textContainer}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{truncateText(item.recipeTitle, 19)}</Text>
                    <StarRating
                        rating={item.averageRating}
                        onChange={()=>{}}
                        maxStars = {5}
                        starSize={24}
                    />
                    <Text>{item.calories} Calories</Text>
                    <Text>Cook Time: {item.cookTimeHours}h {item.cootTimeMinutes}m</Text>
                    <Text>{item.servings} {item.servings == 1 ? 'Serving' : 'Servings'}</Text>
                    <Text>{item.tags != undefined ? truncateText(item.tags.join(", "), 15) : ''}</Text>
                </View>
            </View>
        </TouchableRipple>
    );

    const truncateText = (text: string, maxLength: number): string => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <>
        {recipes.length != 0 ?
            <FlatList
                data={recipes}
                renderItem={Recipe}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            :
            <NoResultMessage message='No relevant recipes found.'/>
            }
        </>
    );
}

const styles = StyleSheet.create({
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
