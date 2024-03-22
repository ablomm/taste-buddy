import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image
} from "react-native";
import {IconButton} from "react-native-paper";
import Header from "../components/header/Header";
import PosterHeader from "../components/RecipesAndPosts/PosterHeader";
import { LinearGradient } from "expo-linear-gradient";
import CheckboxRecipe from "../components/RecipesAndPosts/CheckboxRecipe";
import RecipeContentInteractionBar from "../components/RecipesAndPosts/RecipeContentInteractionBar";
import RecipeReviews from "../components/RecipesAndPosts/RecipeReviews";
import { Recipe } from "../interfaces/RecipeInterface";
import { UserContext } from "../providers/UserProvider";
import {truncateText} from "../functions/Utility";

const HEADER_EXPANDED_HEIGHT = 130;
const HEADER_COLLAPSED_HEIGHT = 50;
const { width: SCREEN_WIDTH } = Dimensions.get("screen");


const RecipePage = ({ route, navigation }: any) => {
  const [recipe, setRecipe] = useState<Recipe>();
  const [userId, setUserId] = React.useState<number>(-1);
  const [username, setUsername] = React.useState<string>("");
  const [recipeID, setRecipeID] = React.useState<number>(-1);
  const [currentRating, setCurrentRating] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);

  const userContext = useContext(UserContext) as any;

  useEffect(() => {
    if (route.params) {
      const { recipe } = route.params;
      let userID = userContext.state.userId;

      setRecipeID(recipe.id);
      setUserId(userID);
      setUsername(userContext.state.username);

      setRecipe(recipe);
      setCurrentRating(recipe.averageRating);
    }
  }, [route.params]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const heroTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  function reformatTime(creationTime: string) {
    // Convert the string to a Date object
    const postDate = new Date(creationTime);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = currentDate.getTime() - postDate.getTime();

    // Convert the difference to seconds
    const differenceInSeconds = Math.floor(difference / 1000);

    // Calculate the time ago
    let timeAgo: string;

    if (differenceInSeconds < 60) {
      timeAgo = `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return timeAgo;
  }

  function editButton() {
    return(<IconButton icon="pencil"
    size={16}
    onPress={()=>navigation.navigate("EditRecipePage", {recipe: recipe})} />)
  }

  function updateRating(rating: number) {
    setCurrentRating(rating);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={{ width: '100%', aspectRatio: 1 }}>
            <Image source={{ uri: recipe?.recipeImage }} style={{ flex: 1 }} />
          </View>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Header title = "View Recipe" />
      <PosterHeader userId = {recipe?.authorID} personalComponent={editButton} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: HEADER_EXPANDED_HEIGHT,
          paddingBottom: 16,
          zIndex: 2,
        }}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y);
        }}
      >
        <Animated.View
  style={{
    height: headerHeight,
    width: SCREEN_WIDTH,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  }}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={
          recipe?.recipeImage
            ? { uri: recipe.recipeImage }
            : require("../../assets/temp/tempfood.jpg")
        }
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.49)", "rgba(0,0,0,0.49)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={{ top: 8, left: 8 }}>
            <Animated.Text style={styles.recipeTitle}>
              {recipe?.recipeTitle}
            </Animated.Text>

            {recipe?.tags ? (
              <Animated.Text
                style={[
                  styles.subSectionOfRecipeTitle,
                  { opacity: heroTitleOpacity },
                ]}
              >
                {truncateText(recipe.tags.map(tag => (tag.name?tag.name:tag.value)).join(", "), 19)}
              </Animated.Text>
            ) : null}
            <Animated.Text
              style={[
                styles.subSectionOfRecipeTitle,
                { opacity: heroTitleOpacity },
              ]}
            >
              {recipe?.cookTimeHours} h {recipe?.cootTimeMinutes} m
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subSectionOfRecipeTitle,
                { opacity: heroTitleOpacity },
              ]}
            >
              {recipe?.calories} calories
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subSectionOfRecipeTitle,
                { opacity: heroTitleOpacity },
              ]}
            >
              {recipe?.servings}{" "}
              {recipe?.servings !== undefined && recipe?.servings > 1
                ? "servings"
                : "serving"}
            </Animated.Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  </TouchableWithoutFeedback>
</Animated.View>


        <View style={styles.scrollContainer}>
          <RecipeContentInteractionBar
            stars={currentRating}
            recipeID={recipeID}
          />
          <Text style={styles.recipeDescription}>{recipe?.description}</Text>
          <Text style={styles.subTitle}>Ingredients</Text>
          {recipe?.ingredients.map((ingredient, index) => (
              <CheckboxRecipe key={index}
                              checkboxText={`${ingredient.amount} ${ingredient.measurementType} ${ingredient.ingredient}`}/>
          ))}
          <Text style={styles.subTitle}>Instructions</Text>
          {recipe?.instructions.map((instruction) => (
            <CheckboxRecipe
              key={instruction.step}
              checkboxText={instruction.instruction}
            />
          ))}
          <Text style={styles.postTime}>
            {recipe?.creationTime ? reformatTime(recipe.creationTime) : null}
          </Text>
          <View style={styles.separator}></View>
          <RecipeReviews
            recipeID={recipeID}
            username={username}
            userID={userId}
            updateRating={updateRating}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avoidingView: {
    flexDirection: "column",
    justifyContent: "center",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  recipeTitle: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 28,
  },
  subSectionOfRecipeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  recipeDescription: {
    color: "#6E6E6E",
    fontSize: 14,
    fontWeight: "400",
    paddingBottom: 20,
  },
  postTime: {
    color: "#6E6E6E",
    fontSize: 14,
    fontWeight: "400",
    padding: 5,
  },
  separator: {
    borderBottomColor: "#6E6E6E",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 200,
    right: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});
export default RecipePage;
