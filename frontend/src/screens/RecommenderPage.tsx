import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { window } from "../constants";
import TBButton from "../components/TBButton";
import { TinderCard } from "rn-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../providers/UserProvider";
import LogoHeader from "../components/header/LogoHeader";
import { Recipe } from "../interfaces/RecipeInterface";
import {
  addRecipeToUserSaved,
  addUserRejectedRecipe,
} from "../functions/HTTPRequests";

const fetchRecommendedRecipes = async (userID: number) => {
  try {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/api/recommendations`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userID: userID,
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const RecommenderPage = ({ navigation }) => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;
  const userID = userContext.state.userId;
  const PAGE_WIDTH = window.width;
  const PAGE_HEIGHT = window.height;

  const [recipes, setRecipes] = useState<Recipe[]>([]); //recipes to display to user
  const [batchNum, setBatchNum] = useState(0); // how many batches of recipes have you gone through (each batch is an http call)
  const [recipesLeft, setRecipesLeft] = useState(0); //for how many recipes have been shown to determine refresh

  // call this whenever you need to add more recipes to the end of the list
  const loadNextBatch = async () => {
  let recommendedRecipes = (await fetchRecommendedRecipes(
      userID
    )) as Recipe[];
    setRecipes([...recipes, ...recommendedRecipes]);
    setBatchNum(batchNum + 1);
    setRecipesLeft(recipesLeft + recommendedRecipes.length - 1);
  };

  const rejectRecipe = async (recipeID: number) => {
    console.log("rejecting: ", recipeID);
    // filter out recipe in recipe list so that list length can be tracked
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeID));
    addUserRejectedRecipe(recipeID, userID);
    setRecipesLeft(recipesLeft - 1);
    checkRecipeList(recipeID);
  };

  const saveRecipe = async (recipeID: number) => {
    console.log("saving: ", recipeID);
    // filter out recipe in recipe list so that list length can be tracked
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeID));
    setRecipesLeft(recipesLeft - 1);
    addRecipeToUserSaved(recipeID, username);
    checkRecipeList(recipeID);
  };

  const showFullRecipe = async (recipe: Recipe) => {
    navigation.navigate("RecipePage", {
      recipe: recipe,
    });
  };

  const checkRecipeList = async (recipeID: number) => {
    console.log(`check recipes left: ${recipesLeft}`);

    console.log(
      "how do i know rec list",
      recipes.map((r) => r.id)
    );

    if (recipesLeft == 1) {
      loadNextBatch();
    }
  };

  useEffect(() => {
    loadNextBatch();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, height: PAGE_HEIGHT }}>
        {recipes && recipes.length > 0 ? (
          recipes.map((item, index) => {
            return (
              <View
                key={index}
                style={[styles.cardContainer]} // need zindex because by default the last item in the list was displaying first
                pointerEvents="box-none"
              >
                <TinderCard
                  cardHeight={0.75 * PAGE_HEIGHT}
                  cardWidth={0.95 * PAGE_WIDTH}
                  cardStyle={styles.card}
                  disableTopSwipe={true}
                  disableBottomSwipe={true}
                  onSwipedRight={() => {
                    saveRecipe(item.id);
                  }}
                  onSwipedLeft={() => {
                    rejectRecipe(item.id);
                  }}
                  onSwipedTop={() => {
                    showFullRecipe(item);
                  }}
                >
                  <View>
                    <ImageBackground
                      source={{ uri: item.recipeImage }}
                      style={styles.image}
                      imageStyle={{ borderRadius: 20 }}
                    >
                      <View style={{ flex: 1 }}>
                        <LinearGradient
                          colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 2 }}
                          style={{ flex: 1, borderRadius: 20 }}
                        >
                          <View
                            style={{
                              height: 0.58 * PAGE_HEIGHT,
                              flexDirection: "column-reverse",
                            }}
                          >
                            <Text
                              numberOfLines={3}
                              style={styles.recipeTitleText}
                            >
                              {item.recipeTitle}
                            </Text>
                          </View>
                          <View style={{ height: 0.11 * PAGE_HEIGHT }}>
                            <Text
                              numberOfLines={5}
                              style={styles.recipeDescription}
                            >
                              {item.description}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 0.06 * PAGE_HEIGHT,
                              paddingHorizontal: "3.5%",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <TBButton
                              title="See Full Recipe"
                              // onPress={() => {
                              //   showFullRecipe(item);
                              // }}
                              onPress={() => showFullRecipe(item)}
                              style={styles.fullRecipeButton}
                              textColor={{ color: "white" }}
                            ></TBButton>
                          </View>
                        </LinearGradient>
                      </View>
                    </ImageBackground>
                  </View>
                </TinderCard>
              </View>
            );
          })
        ) : (
          <View
            style={[styles.cardContainer]} // need zindex because by default the last item in the list was displaying first
            pointerEvents="box-none"
          >
            <TinderCard
              cardHeight={0.75 * PAGE_HEIGHT}
              cardWidth={0.95 * PAGE_WIDTH}
              cardStyle={styles.defaultCard}
              disableBottomSwipe={true}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              disableTopSwipe={true}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.defaultText}>
                  One moment! We're finding you some recommendations...
                </Text>
                <TBButton
                  title="Temp load next batch"
                  onPress={() => {
                    loadNextBatch();
                  }}
                ></TBButton>
              </View>
            </TinderCard>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullRecipeButton: {
    width: "40%",
    height: 30,
    borderColor: "white",
    margin: 5,
    marginLeft: "auto",
    marginRight: 0,
    marginTop: 0,
  },
  recipeTitleText: {
    fontSize: 25,
    color: "white",
    paddingHorizontal: "4.5%",
    textAlign: "justify",
  },
  defaultText: {
    fontSize: 25,
    color: "black",
    fontWeight: "500",
    textAlign: "center",
  },
  recipeDescription: {
    fontSize: 15,
    color: "white",
    paddingHorizontal: "4.5%",
    paddingTop: 2,
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  defaultCard: {
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    overflow: "hidden",
  },
});

export default RecommenderPage;
