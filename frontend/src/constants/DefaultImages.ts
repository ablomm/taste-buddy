import {
  Image,
  Platform
} from "react-native";
import { isIos, isAndroid } from ".";

const tempProfPic = require("../../assets/profile.jpg");
export const defaultProfilePicture = Platform.select({
  ios: isIos ? Image.resolveAssetSource(tempProfPic).uri : tempProfPic,
  android: isAndroid ? Image.resolveAssetSource(tempProfPic).uri : tempProfPic,
  web: tempProfPic
});
