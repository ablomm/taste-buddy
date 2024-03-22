import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert, ActivityIndicator } from "react-native";
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

interface InstructionStep {
  step: number;
  instruction: string;
}

interface FormattedInstructions {
  list: InstructionStep[];
}

let isLoadingNextBatch = false;

const fetchRecommendedRecipes = async (userID: number) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
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

  const [recipes, setRecipes] = useState<any[]>([]); //recipes to display to user
  const [batchNum, setBatchNum] = useState(0); // how many batches of recipes have you gone through (each batch is an http call)
  const [recipesLeft, setRecipesLeft] = useState(0); //for how many recipes have been shown to determine refresh



  // call this whenever you need to add more recipes to the end of the list
  const loadNextBatch = async () => {
    console.log("loading next batch")
    let recommendedRecipes = (await fetchRecommendedRecipes(
      userID
    )) as Recipe[];
    setRecipes([...recipes, ...recommendedRecipes]);
    setBatchNum(batchNum + 1);
    setRecipesLeft(currentRecipesLeft => currentRecipesLeft + recommendedRecipes.length - 1);
    isLoadingNextBatch = false;
  };

  const rejectRecipe = async (recipeID: number) => {
    // console.log("rejecting: ", recipeID);
    // filter out recipe in recipe list so that list length can be tracked
    addUserRejectedRecipe(recipeID, userID);
    setRecipesLeft(currentRecipesLeft => currentRecipesLeft - 1);
    checkRecipeList();
  };

  const saveRecipe = async (recipeID: number) => {
    // console.log("saving: ", recipeID);
    // filter out recipe in recipe list so that list length can be tracked
    setRecipesLeft(currentRecipesLeft => currentRecipesLeft - 1);
    addRecipeToUserSaved(recipeID, username);
    checkRecipeList();
  };

  const showFullRecipe = async (recipe: Recipe) => {
    navigation.navigate("RecipePage", {
      recipe: recipe,
    });
  };

  const formatInstructions = (recipeInstructions: string[]): FormattedInstructions => {
    let formattedInstructions: FormattedInstructions = {
      list: []
    };

    recipeInstructions.forEach((item, index) => {
      formattedInstructions.list.push({
        step: index + 1,
        instruction: item
      });
    });

    return formattedInstructions;
  }

  const checkRecipeList = async () => {
    console.log(recipesLeft)
    if (!isLoadingNextBatch && recipesLeft <= 20) {
      isLoadingNextBatch = true;
      loadNextBatch();
    }
  };

  useEffect(() => {
    checkRecipeList();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, height: PAGE_HEIGHT }}>
        {recipesLeft > 0 ? (
          recipes.map((item, index) => {
            return (
              <View
                key={index}
                style={[styles.cardContainer, {zIndex: -index}]}
                pointerEvents="box-none"
              >
                <TinderCard
                  cardHeight={0.80 * PAGE_HEIGHT}
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
                              height: 0.62 * PAGE_HEIGHT,
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
                <ActivityIndicator color={"#000"} />
              </View>
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
