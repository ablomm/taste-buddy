import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating-widget";
import ContentInteractionBar from "./ContentInteractionBar";

const RecipeContentInteractionBar = ({ stars, recipeID }) => {
  return (
    <View style={styles.container}>
      <StarRating
        rating={stars} //placeholder avrg rating
        onChange={() => {}}
        maxStars={5}
        starSize={27}
      />
      <ContentInteractionBar recipeID={recipeID} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default RecipeContentInteractionBar;
