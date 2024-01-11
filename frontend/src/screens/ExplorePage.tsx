import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import Animated, { Extrapolate, interpolate, FadeInDown, useSharedValue } from 'react-native-reanimated';
import Carousel from "react-native-reanimated-carousel";
import { TAnimationStyle } from '../components/BaseLayout';
import { window } from "../constants";
import { PanGesture } from 'react-native-gesture-handler';

const ExplorePage = () => {

    const PAGE_WIDTH = window.width;
    const PAGE_HEIGHT = 0.75 * window.height;
    const directionAnimVal = useSharedValue(0);

    const data = [];

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
                data={[...new Array(5).keys()]}
                onConfigurePanGesture={onConfigurePanGesture}
                fixedDirection={fixedDirection}
                renderItem={({ index, item }) => (
                    <Item
                        key={index}
                        img={item}
                    />
                )}
                customAnimation={animationStyle}
                // renderItem={({ index, item }) => (
                //     <View
                //         style={{
                //             flex: 1,
                //             borderWidth: 1,
                //             justifyContent: 'center',
                //             margin: 10,
                //             borderRadius: 20
                //         }}
                //     >
                //         <Text style={{ textAlign: 'center', fontSize: 30 }}>
                //             {index}
                //         </Text>
                //         <Text style={{ textAlign: 'center', fontSize: 30 }}>
                //             {item}
                //         </Text>
                //     </View>
                // )}
                windowSize={5}
            />
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