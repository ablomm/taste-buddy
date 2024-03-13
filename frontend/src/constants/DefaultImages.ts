import {
  Image,
  Platform
} from "react-native";

const tempProfPic = require("../../assets/profile.jpg");
export const defaultProfilePicture = Platform.select({
  ios: Image.resolveAssetSource(tempProfPic).uri,
  android: tempProfPic,
});
