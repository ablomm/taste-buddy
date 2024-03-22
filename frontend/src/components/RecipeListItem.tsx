import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import { TouchableRipple } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import { truncateText } from "../functions/Utility";

const RecipeListItem = ({ item, navigation }) => {
  return (
    <TouchableRipple
      onPress={() =>
        navigation.push("RecipePage", {
          recipe: item,
        })
      }
    >
      <View style={styles.recipeContainer}>
        <Image style={styles.image} source={{ uri: item.recipeImage }} />
        <View style={styles.textContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {truncateText(item.recipeTitle, 19)}
          </Text>
          <StarRating
            rating={item.averageRating}
            onChange={() => {}}
            maxStars={5}
            starSize={24}
          />
          <Text>{item.calories} Calories</Text>
          <Text>
            Cook Time: {item.cookTimeHours}h {item.cootTimeMinutes}m
          </Text>
          <Text>
            {item.servings} {item.servings == 1 ? "Serving" : "Servings"}
          </Text>
          <Text>
            {item.tags != undefined
                ? truncateText(item.tags.map(tag=>(tag.name?tag.name:tag.value)).join(', '), 15)
              : ""}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "gray",
    aspectRatio: 1, // Set aspect ratio to 1:1 (square)
    height: "auto",
    maxWidth: "auto",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "white",
  },
  recipeContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
});

export default RecipeListItem;
