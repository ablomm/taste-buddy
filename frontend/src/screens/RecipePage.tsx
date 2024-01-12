import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated, Dimensions, ImageBackground} from "react-native";
import Header from '../components/header/Header';
import PosterHeader from '../components/RecipesAndPosts/PosterHeader';
import { LinearGradient } from 'expo-linear-gradient';
import CheckboxRecipe from '../components/RecipesAndPosts/CheckboxRecipe';
import RecipeContentInteractionBar from '../components/RecipesAndPosts/RecipeContentInteractionBar';
import RecipeReviews from '../components/RecipesAndPosts/RecipeReviews';

const HEADER_EXPANDED_HEIGHT = 130;
const HEADER_COLLAPSED_HEIGHT = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const RecipePage = ({ route, navigation }: any) => {
    

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

    return(
        <View style={styles.container}>
            <Header navigation = {navigation}/>
            <View style={{ zIndex: 2 }}>
                <PosterHeader/>
                
                <Animated.View style={{ height: headerHeight, width: SCREEN_WIDTH,top: 0, left: 0, zIndex: 1 }}>
                    {/** place holder image */}
                    <ImageBackground
                        source={require('../../assets/temp/tempfood.jpg')} 
                        style={{ flex: 1 }}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.49)', 'rgba(0,0,0,0.49)']} // Customize gradient colors
                            start={{ x: 0, y: 0 }} // Linear gradient start point
                            end={{ x: 0, y: 1 }} // Linear gradient end point
                            style={{ flex: 1 }}
                        >
                            <View style={{ top:8, left: 8}}>
                                <Animated.Text style={styles.recipeTitle}>Recipe Title</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>tags</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>cook time</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>calories</Animated.Text>
                                <Animated.Text style={[styles.subSectionOfRecipeTitle, {opacity: heroTitleOpacity}]}>servings</Animated.Text>
                            </View>
                            
                        </LinearGradient>
                    </ImageBackground>
                </Animated.View>
                    <ScrollView contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                        [{ nativeEvent: {
                             contentOffset: {
                               y: scrollY
                             }
                           }
                        }])}
                      scrollEventThrottle={16}>
                        <KeyboardAvoidingView
                            style={styles.avoidingView}
                            behavior='padding'
                            enabled={Platform.OS === "ios"}
                            keyboardVerticalOffset={40}
                        >
                        <RecipeContentInteractionBar/> 
                        {
                            // stars
                            //description
                            //ingrediants (check list)
                            //instructions (text)
                        }
                        <Text style={styles.recipeDescription}>short description</Text>
                        <>
                            <Text style={styles.subTitle}>Ingredients</Text>{/**loop throught the list of ingredients */}
                            <CheckboxRecipe checkboxText="hi"/>
                            <CheckboxRecipe /> 
                        </>
                        <>
                            <Text style={styles.subTitle}>Instructions</Text>
                            <CheckboxRecipe checkboxText="hi"/>
                            <CheckboxRecipe checkboxText="hi2" /> 
                        </>
                        <Text style={styles.postTime}>post time</Text>
                        <Text>~~~~~~~~~~~~~~~~</Text>
                        <RecipeReviews/>
                        </KeyboardAvoidingView>
                    </ScrollView>
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
    }
});
export default RecipePage;