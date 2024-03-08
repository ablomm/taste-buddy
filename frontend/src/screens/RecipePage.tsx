import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated, Dimensions, ImageBackground} from "react-native";
import Header from '../components/header/Header';
import PosterHeader from '../components/RecipesAndPosts/PosterHeader';
import { LinearGradient } from 'expo-linear-gradient';
import CheckboxRecipe from '../components/RecipesAndPosts/CheckboxRecipe';
import RecipeContentInteractionBar from '../components/RecipesAndPosts/RecipeContentInteractionBar';
import RecipeReviews from '../components/RecipesAndPosts/RecipeReviews';
import {Recipe} from "../interfaces/RecipeInterface";
import {UserContext} from "../providers/UserProvider";

const HEADER_EXPANDED_HEIGHT = 130;
const HEADER_COLLAPSED_HEIGHT = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const exampleRecipe: Recipe = {
    id: 2,
    authorID: 1,
    creationTime: "2024-02-23T23:36:34.705Z",
    recipeTitle: "Recipe",
    description: "Simple description",
    cookTimeHours: 1,
    cootTimeMinutes: 0,
    calories: 1000,
    servings: 4,
    recipeImage: "https://tastebuddy-images.s3.us-east-2.amazonaws.com/bc38304304213d170915c6441e9910d9",
    averageRating: 3,
    ingredients: [
        {
            recipeID: 2,
            ingredient: "Ingredient1",
            amount: 20,
            measurementType: "tsp"
        },
        {
            recipeID: 2,
            ingredient: "Ingredient2",
            amount: 100,
            measurementType: "g"
        }
    ],
    instructions: [
        {
            recipeID: 2,
            step: 1,
            instruction: "Step1"
        },
        {
            recipeID: 2,
            step: 2,
            instruction: "Step2"
        },
        {
            recipeID: 2,
            step: 3,
            instruction: "Step3"
        }
    ]
};

const RecipePage = ({ route, navigation }: any) => {
    const [recipe, setRecipe] = useState<Recipe>();
    const [tags, setTags] = useState(); // TODO: Need tags implemented in backend and frontend
    const [owner, setOwner] = useState<boolean>(false);

    const userContext = React.useContext(UserContext) as any;

    useEffect(() => {
        const userId = userContext.state.userId;

        if(route.params != undefined) {
            const {recipe} = route.params;
            checkOwnership(recipe.authorID, userId);
            setRecipe(recipe);
        } // TODO: REMOVE eventually when we don't need it for a demo
        else {
            setRecipe(exampleRecipe);
        }
    }, [route.params]);

    const [scrollY, setScrollY] = useState<any>(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
        outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
        extrapolate: 'clamp',
    });

    const heroTitleOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    function checkOwnership(recipeAuthorId: number, userId: number) {
        if(recipeAuthorId == userId) {
            setOwner(true);
        }
    }

    function reformatTime(creationTime: string) {
        // Convert the string to a Date object
        const postDate = new Date(creationTime);

        // Get the current date and time
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const difference = currentDate.getTime() - postDate.getTime();

        // Convert the difference to seconds
        const differenceInSeconds = Math.floor(difference / 1000);

        // Calculate the time ago
        let timeAgo: string;

        if (differenceInSeconds < 60) {
            timeAgo = `${differenceInSeconds} seconds ago`;
        } else if (differenceInSeconds < 3600) {
            const minutes = Math.floor(differenceInSeconds / 60);
            timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 86400) {
            const hours = Math.floor(differenceInSeconds / 3600);
            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(differenceInSeconds / 86400);
            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        return timeAgo;
    }

    function edit() {
        navigation.navigate('EditRecipePage', {
            recipe: recipe
        });
    }

    return(
        <View style={styles.container}>
            <Header navigation = {navigation}/>
            <View style={{ zIndex: 2 }}>
                <PosterHeader
                    owner={owner}
                    editFunction={edit}
                />

                <Animated.View style={{ height: headerHeight, width: SCREEN_WIDTH,top: 0, left: 0, zIndex: 1 }}>
                    {/** Placeholder image when url is not provided */}
                    <ImageBackground
                        source={recipe?.recipeImage ? { uri: recipe.recipeImage } : require('../../assets/temp/tempfood.jpg')}
                        style={{ flex: 1 }}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.49)', 'rgba(0,0,0,0.49)']} // Customize gradient colors
                            start={{ x: 0, y: 0 }} // Linear gradient start point
                            end={{ x: 0, y: 1 }} // Linear gradient end point
                            style={{ flex: 1 }}
                        >
                            <View style={{ top:8, left: 8}}>
                                <Animated.Text style={styles.recipeTitle}>{recipe?.recipeTitle}</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>tags</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>{recipe?.cookTimeHours} h {recipe?.cootTimeMinutes} m</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>{recipe?.calories} calories</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>{recipe?.servings} {recipe?.servings != undefined && recipe?.servings > 1 ? 'servings' : 'serving'}</Animated.Text>
                            </View>

                        </LinearGradient>
                    </ImageBackground>
                </Animated.View>
                <KeyboardAvoidingView
                            style={styles.avoidingView}
                            behavior='padding'
                            enabled={Platform.OS === "ios"}
                            keyboardVerticalOffset={40}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                        [{ nativeEvent: {
                             contentOffset: {
                               y: scrollY
                             }
                           }
                        }])}
                      scrollEventThrottle={16}>

                        <RecipeContentInteractionBar stars={recipe?.averageRating}/>
                        {
                            // stars
                            //description
                            //ingrediants (check list)
                            //instructions (text)
                        }
                        <Text style={styles.recipeDescription}>{recipe?.description}</Text>
                        <>
                            {/* Dynamically generate ingredients list */}
                            <Text style={styles.subTitle}>Ingredients</Text>
                            {recipe?.ingredients.map((ingredient, index) => (
                                <CheckboxRecipe key={index} checkboxText={ingredient.ingredient} />
                            ))}
                        </>
                        <>
                            {/* Dynamically generate instructions list */}
                            <Text style={styles.subTitle}>Instructions</Text>
                            {recipe?.instructions.map((instruction) => (
                                <CheckboxRecipe key={instruction.step} checkboxText={instruction.instruction} />
                            ))}
                        </>
                        <Text style={styles.postTime}>{recipe?.creationTime ? reformatTime(recipe.creationTime) : null}</Text>
                        {/* Separator */}
                        <View style={styles.separator}></View>
                        <RecipeReviews/>
                    </ScrollView>
                    </KeyboardAvoidingView>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    avoidingView: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    scrollContainer: {
        padding: 16,
        flexGrow: 1,
        paddingBottom: 300,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: '#000',
    },
    recipeTitle:{
        fontWeight: "600",
        color: '#fff',
        fontSize: 28
    },
    subSectionOfRecipeTitle:{
        color: '#fff',
        fontSize: 16,
        fontWeight: "600",
    },
    recipeDescription:{
        color:'#6E6E6E',
        fontSize: 14,
        fontWeight: "400",
        paddingBottom: 20
    },
    postTime:{
        color:'#6E6E6E',
        fontSize: 14,
        fontWeight: "400",
        padding: 5
    },
    separator: {
        borderBottomColor: '#6E6E6E',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
});
export default RecipePage;
