import { Dimensions, Platform, ScaledSize } from "react-native";

export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";

export const HEADER_HEIGHT = 200;

export const window: ScaledSize = isWeb ? {...Dimensions.get("window"), width: 700} : Dimensions.get("window");