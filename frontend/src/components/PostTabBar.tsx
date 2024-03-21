import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const PostTabBar = () => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="heart-outline"
        size={25} // Reduced the size to 20
        iconColor="#FF5733" // Change the color as desired
        onPress={() => console.log("Like")}
      />
      <IconButton
        icon="share-variant"
        size={25} // Reduced the size to 20
        iconColor="#00CED1" // Change the color as desired
        onPress={() => console.log("Share")}
      />
      <IconButton
        icon="comment-outline"
        size={25} // Reduced the size to 20
        iconColor="#663399" // Change the color as desired
        onPress={() => console.log("Comment")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default PostTabBar;
