import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
const TBButton = ({ onPress, title, style, textColor }: any) => {
  return (
    <TouchableRipple
      style={[styles.button, style]}
      onPress={onPress}
      borderless={true}
    >
      <Text style={[styles.buttonText, textColor]}>{title}</Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "95%",
    borderRadius: 100,
    borderWidth: 2,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
    padding: 5,
  },
});

export default TBButton;
