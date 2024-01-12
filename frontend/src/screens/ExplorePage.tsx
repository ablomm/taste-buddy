import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageSourcePropType, Button } from 'react-native';
import Animated, { Extrapolate, interpolate, FadeInDown, useSharedValue } from 'react-native-reanimated';
import Carousel from "react-native-reanimated-carousel";
import { TAnimationStyle } from '../components/ExplorePage/BaseLayout';
import { window } from "../constants";
import { PanGesture } from 'react-native-gesture-handler';


const ExplorePage = () => {

    const PAGE_WIDTH = window.width;
    const PAGE_HEIGHT = 0.75 * window.height;
    const directionAnimVal = useSharedValue(0);

    const dataLength = 10;
    const data = [1,1,1];
    const [recipes, setRecipes] = useState();

    const tempRecipes = [{"id":1,"authorID":1,"creationTime":"2024-01-11T21:30:29.475Z","recipeTitle":"Cajun Honey Glazed Chicken ","description":"This cajun honey glazed chicken is a delicious dinner idea! The chicken is actually cooked IN the marinade, allowing for maximum flavour.","cookTimeHours":0,"cootTimeMinutes":30,"calories":0,"servings":4,"recipeImage":"https://tastebuddy-images.s3.us-east-2.amazonaws.com/af534c1081afa0a031b760eeac9a825a"},{"id":2,"authorID":1,"creationTime":"2024-01-11T21:30:53.964Z","recipeTitle":"Cajun Honey Glazed Chicken ","description":"This cajun honey glazed chicken is a delicious dinner idea! The chicken is actually cooked IN the marinade, allowing for maximum flavour.","cookTimeHours":0,"cootTimeMinutes":30,"calories":0,"servings":4,"recipeImage":"https://tastebuddy-images.s3.us-east-2.amazonaws.com/02383e9bc2297516e2eb341691e71539"},{"id":3,"authorID":1,"creationTime":"2024-01-12T01:05:50.087Z","recipeTitle":"testing title","description":"","cookTimeHours":0,"cootTimeMinutes":0,"calories":0,"servings":0,"recipeImage":"https://tastebuddy-images.s3.us-east-2.amazonaws.com/a839793446691e48363db4aa6f8ccc40"},{"id":4,"authorID":1,"creationTime":"2024-01-12T01:06:16.800Z","recipeTitle":"testing recipe title 2","description":"","cookTimeHours":0,"cootTimeMinutes":0,"calories":0,"servings":0,"recipeImage":"https://tastebuddy-images.s3.us-east-2.amazonaws.com/1066f99fc7a99d17388a7ceea9e5898c"}]

const fetchRecipeList = async () => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/recipe/get-all-recipes`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        await response.json().then(result => {
        setRecipes(result)
        console.log("RECIPES !!!" + recipes);
        console.log("RECIPES" + JSON.stringify(recipes));
        });
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
        fetchRecipeList();
      }, []);

    const fixedDirection = "negative";
    const onConfigurePanGesture = (g: PanGesture) => {
        g.onChange(e => {
            directionAnimVal.value = Math.sign(e.translationX)
        })};

    const animationStyle: TAnimationStyle = React.useCallback(
        (value: number) => {
            "worklet";
            const translateY = interpolate(
                value,
                [0, 1],
                [0, -18],
            );

            const translateX = interpolate(
                value,
                [-1, 0],
                [PAGE_WIDTH, 0],
                Extrapolate.CLAMP
            ) * directionAnimVal.value;

            const rotateZ = interpolate(
                value,
                [-1, 0],
                [15, 0],
                Extrapolate.CLAMP
            ) * directionAnimVal.value;

            const zIndex = interpolate(
                value,
                [0, 1, 2, 3, 4],
                [0, 1, 2, 3, 4].map((v) => (data.length - v) * 10),
                Extrapolate.CLAMP
            )

            const scale = interpolate(
                value,
                [0, 1],
                [1, 0.95]
            );

            const opacity = interpolate(
                value,
                [-1, -0.8, 0, 1],
                [0, 0.9, 1, 0.85],
                Extrapolate.EXTEND
            );

            return {
                transform: [
                    { translateY },
                    { translateX },
                    { rotateZ: `${rotateZ}deg` },
                    { scale },
                ],
                zIndex,
                opacity,
            };
        },
        [PAGE_HEIGHT, PAGE_WIDTH],
    );

    // const carouselProps = {
    //     loop: false,
    //     style:{
    //         width: PAGE_WIDTH,
    //         height: PAGE_HEIGHT,
    //         justifyContent: "center",
    //         alignItems: "center",
    //         backgroundColor: "white",
    //     },
    //     defaultIndex:0,
    //     vertical:false,
    //     width:PAGE_WIDTH,
    //     height:PAGE_HEIGHT,
    //     data:{...new Array(6).keys()},
    //     renderItem:({ index, item }) => (
    //         <Item
    //             key={index}
    //             img={item}
    //         />
    //     ),
    //     windowSize:5,
    //     customAnimation:animationStyle,
    // }

    return (
        <View>
            {/* <Text>
                Explore Page test update
            </Text> */}
            <Carousel 
                loop={false}
                style={{
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                }}
                defaultIndex={0}
                vertical={false}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                // data={[...new Array(dataLength).keys()]}
                data={tempRecipes}
                // onConfigurePanGesture={onConfigurePanGesture}
                // fixedDirection={fixedDirection}
                // renderItem={({ index, item }) => (
                //     <Item
                //         key={index}
                //         img={item.recipeImage}
                //     />
                // )}
                customAnimation={animationStyle}
                renderItem={({ index, item }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                            margin: 10,
                            borderRadius: 20,
                            backgroundColor: 'cornflowerblue'
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {item.recipeTitle}
                        </Text>
                    </View>
                )}
                windowSize={5}
            />
            {/* <Button title="fetch recipes list" onPress={fetchRecipeList}/> */}
        </View>
    );
}

const Item: React.FC<{ img: ImageSourcePropType }> = ({ img }) => {
    const width = window.width * 0.9;
    const height = window.height * 0.7;

    return (
        <Animated.View entering={FadeInDown.duration(300)} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View
                style={{
                    width,
                    height,
                    borderWidth: 1,
                    borderColor: "black",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",


                    elevation: 20,
                }}
            >
                <Image source={img} style={{
                    width,
                    height,
                    borderRadius: 20,
                }} />
            </View>
        </Animated.View>
    );
};

export default ExplorePage;