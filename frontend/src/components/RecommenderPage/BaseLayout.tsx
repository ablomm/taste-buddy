import React from "react";
import type { ViewStyle } from "react-native";
import type { AnimatedStyleProp } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import type { IOpts } from "./useOffsetX";
import { useOffsetX } from "./useOffsetX";
import type { IVisibleRanges } from "./useVisibleRanges";
import type { ILayoutConfig } from "./stack";
import { CTX } from "./store";

export type TAnimationStyle = (value: number) => AnimatedStyleProp<ViewStyle>;

export const BaseLayout: React.FC<{
  index: number
  handlerOffset: Animated.SharedValue<number>
  visibleRanges: IVisibleRanges
  animationStyle: TAnimationStyle
  children: (ctx: {
    animationValue: Animated.SharedValue<number>
  }) => React.ReactElement
}> = (props) => {
  const { handlerOffset, index, children, visibleRanges, animationStyle }
    = props;

  const context = React.useContext(CTX);
  const {
    props: {
      loop,
      dataLength,
      width,
      height,
      vertical,
      customConfig,
      mode,
      modeConfig,
    },
  } = context;
  const size = vertical ? height : width;

  let offsetXConfig: IOpts = {
    handlerOffset,
    index,
    size,
    dataLength,
    loop,
    ...(typeof customConfig === "function" ? customConfig() : {}),
  };

  if (mode === "horizontal-stack") {
    const { snapDirection, showLength } = modeConfig as ILayoutConfig;

    offsetXConfig = {
      handlerOffset,
      index,
      size,
      dataLength,
      loop,
      type: snapDirection === "right" ? "negative" : "positive",
      viewCount: showLength,
    };
  }

  const x = useOffsetX(offsetXConfig, visibleRanges);
  const animationValue = useDerivedValue(() => x.value / size, [x, size]);
  const animatedStyle = useAnimatedStyle(
    () => {
      return animationStyle(x.value / size);
    },
    [animationStyle],
  );

  return (
    <Animated.View
      style={[
        {
          width: width || "100%",
          height: height || "100%",
          position: "absolute",
        },
        animatedStyle,
      ]}
      /**
       * We use this testID to know when the carousel item is ready to be tested in test.
       * e.g.
       *  The testID of first item will be changed to __CAROUSEL_ITEM_0_READY__ from __CAROUSEL_ITEM_0_NOT_READY__ when the item is ready.
       * */
      testID={`__CAROUSEL_ITEM_${index}__`}
    >
      {children({ animationValue })}
    </Animated.View>
  );
};