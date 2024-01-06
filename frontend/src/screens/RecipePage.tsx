import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Image, Platform, Animated, Dimensions } from "react-native";
import Header from '../components/header/Header';
import PosterHeader from '../components/RecipesAndPosts/PosterHeader';

const HEADER_EXPANDED_HEIGHT = 100;
const HEADER_COLLAPSED_HEIGHT = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const RecipePage = ({ route, navigation }: any) => {
    

    const [scrollY, setScrollY] = useState<any>(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
        outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
        extrapolate: 'clamp',
    });

    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const heroTitleOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    return(
        <View style={styles.container}>
            <Header navigation = {navigation}/>
            <View>
                <PosterHeader/>
                
                    <Animated.View style={{height: headerHeight, width: SCREEN_WIDTH,position: 'absolute', top: 0, left: 0}}>
                        <Animated.Text style={{textAlign: 'center', marginTop: 28, opacity: headerTitleOpacity}}>idke</Animated.Text>
                        <Animated.Text style={{position: 'absolute', bottom: 16, left: 16, opacity: heroTitleOpacity}}>idk</Animated.Text>
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
                        <Text style={styles.title}>This is Title</Text>
                        <Text>Collapsing toolbar is really cool, both visually and in user experience point of view. We can start with initial view with huge header, giving the user a bit of context, then collapsing it when the user start scrolling the content, giving her the screen real estate to enjoy the page’s content. In this article, I will explore how we can achieve that using React Native. View Structure
Let’s start with a very simple view structure. We will have a header that we will collapse and a ScrollView that will contain our long content.
Our first attempt doesn’t look so good as the header stays where it is. So, we will make the height changes as we scroll the content up using RN’s Animated library.

Animated and onScroll Combination
The Animated library provides several useful APIs to create an animation, but we will focus on the event and interpolate method. The event method can map scrolling events into animated values. We w
good as the header stays where it is. So, we will make the height changes as we scroll the content up using RN’s Animated library.

Animated and onScroll Combination
The Animated library provides several useful APIs to create an animation, but we will focus on the event and interpolate method. The eve
Collapsing toolbar is really cool, both visually and in user experience point of view. We can start with initial view with huge header, giving the user a bit of context, then collapsing it when the user start scrolling the content, giving her the screen real estate to enjoy the page’s content. In this article, I will explore how we can achieve that using React Native. View Structure
Let’s start with a very simple view structure. We will have a header that we will collapse and a ScrollView that will contain our long content.
Our first attempt doesn’t look so good as the header stays where it is. So, we will make the height changes as we scroll the content up using RN’s Animated library.

Animated and onScroll Combination
The Animated library provides several useful APIs to create an animation, but we will focus on the event and interpolate method. The event method can map scrolling events into animated values. We w
good as the header stays where it is. So, we will make the height changes as we scroll the content up using RN’s Animated library.

Animated and onScroll Combination
The Animated library provides several useful APIs to create an animation, but we will focus on the event and interpolate method. The eve
</Text>
                    </ScrollView>
                </View>
            
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
    scrollContainer: {
        padding: 16,
        flexGrow: 1,
        paddingBottom: 150,
        paddingTop: HEADER_EXPANDED_HEIGHT
    }, 
    title: {
        fontSize: 24,
        marginVertical: 16
    }
});
export default RecipePage;