import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { window } from "../constants";
import TBButton from "../components/TBButton";
import { TinderCard } from "rn-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../providers/UserProvider";
import { Recipe } from "../interfaces/RecipeInterface";
<<<<<<< HEAD
import {
  addRecipeToUserSaved,
  addUserRejectedRecipe,
} from "../functions/HTTPRequests";
import { LoadingContext } from "../providers/LoadingProvider";
// import { RecipeTab}
=======
import { addRecipeToUserSaved, addUserRejectedRecipe } from "../functions/HTTPRequests";

>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d

const fetchRecipeBatch = async (num: number) => {
  try {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
      }/recipe/batch/${num}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

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
<<<<<<< HEAD
          userID: userID,
=======
          userID: userID
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const RecommenderPage = () => {
<<<<<<< HEAD
  const loadingContext = React.useContext(LoadingContext) as any;
=======
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;
  const userID = userContext.state.userId;
  const PAGE_WIDTH = window.width;
  const PAGE_HEIGHT = window.height;

  const [recipes, setRecipes] = useState<Recipe[]>([]); //recipes to display to user
  const [batchNum, setBatchNum] = useState(0); // how many batches of recipes have you gone through (each batch is an http call)
  const [loading, setLoading] = useState(false); //to display loading signal
  const [recipesLeft, setRecipesLeft] = useState(0); //for how many recipes have been shown to determine refresh
<<<<<<< HEAD

  // call this whenever you need to add more recipes to the end of the list
  const loadNextBatch = async () => {
    // loadingContext.enable();
    console.log(`loading next batch, num = ${batchNum}`);
    console.log("rec length", recipes.length);
    // console.log("rec", recipes);
    // let newRecipes = (await fetchRecipeBatch(batchNum)) as Recipe[];
    let recommendedRecipes = (await fetchRecommendedRecipes(userID)) as Recipe[];
    // let recommendedRecipes = [];
    setRecipes([...recipes, ...recommendedRecipes]);
    setBatchNum(batchNum + 1);
    setRecipesLeft(recipesLeft + recommendedRecipes.length - 1);
    // loadingContext.disable();
  };

  const rejectRecipe = async (recipeID: number) => {
    addUserRejectedRecipe(recipeID, userID);
    setRecipesLeft(recipesLeft - 1);
    checkRecipeList(recipeID);
=======
 
  // call this whenever you need to add more recipes to the end of the list
  const loadNextBatch = async () => {
    console.log(`loading next batch, num = ${batchNum}`);
    let newRecipes = (await fetchRecipeBatch(batchNum)) as Recipe[];
    let recommend = (await fetchRecommendedRecipes(userID))
    setRecipes([...recipes, ...recommend]);
    setBatchNum(batchNum + 1);
    setRecipesLeft(recipesLeft + newRecipes.length - 1);
  };

  const rejectRecipe = async (recipeID: number) => {
    console.log(userID);
    addUserRejectedRecipe(recipeID, userID);
    setRecipesLeft(recipesLeft - 1);
    checkRecipeList();
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  };

  const saveRecipe = async (recipeID: number) => {
    setRecipesLeft(recipesLeft - 1);
    addRecipeToUserSaved(recipeID, username);
<<<<<<< HEAD
    checkRecipeList(recipeID);
  };

  const showFullRecipe = async (recipe: Recipe) => {
    //   navigation.navigate('RecipePage', {
    //     recipe: item
    // })
    console.log("button press ", recipe.recipeTitle);
  };

  const checkRecipeList = async (recipeID: number) => {
    console.log(`recipes left: ${recipesLeft}`);
    // filter out recipe in recipe list so that list length can be tracked
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeID))
    console.log("how do i know rec length", recipes.length);
=======
    checkRecipeList();
  };

  const checkRecipeList = async () => {
    console.log(`recipes left: ${recipesLeft}`);

>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
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
<<<<<<< HEAD
        {recipes && recipes.length > 0 ? (
          recipes.map((item, index) => {
            return (
=======
        {recipes.map((item, index) => {
          return (
            (
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
              <View
                key={index}
                style={[styles.cardContainer, { zIndex: -index }]} // need zindex because by default the last item in the list was displaying first
                pointerEvents="box-none"
              >
                <TinderCard
<<<<<<< HEAD
                  cardHeight={0.82 * PAGE_HEIGHT}
                  cardWidth={0.95 * PAGE_WIDTH}
                  cardStyle={styles.card}
                  disableTopSwipe={true}
                  disableBottomSwipe={true}
=======
                  cardHeight={0.75 * PAGE_HEIGHT}
                  cardWidth={0.95 * PAGE_WIDTH}
                  cardStyle={styles.card}
                  // disableTopSwipe={true}
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
                  onSwipedRight={() => {
                    saveRecipe(item.id);
                  }}
                  onSwipedLeft={() => {
                    rejectRecipe(item.id);
                  }}
<<<<<<< HEAD

                  onSwipedTop={() => {
                    showFullRecipe(item);
=======
                  onSwipedBottom={() => {
                    Alert.alert("Swiped Bottom");
                  }}
                  onSwipedTop={() => {
                    Alert.alert("Swiped Top");
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
                  }}
                >
                  <View>
                    <ImageBackground
                      source={{ uri: item.recipeImage }}
                      style={styles.image}
<<<<<<< HEAD
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
                              height: 0.65 * PAGE_HEIGHT,
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
                              onPress={() => {
                                showFullRecipe(item);
                              }}
                              style={styles.fullRecipeButton}
                              textColor={{ color: "white" }}
                            ></TBButton>
                          </View>
=======
                      imageStyle={{ borderRadius: 25 }}
                    >
                      <View style={{ height: 0.6 * PAGE_HEIGHT }}></View>
                      <View style={{ flex: 1 }}>
                        <LinearGradient
                          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.49)"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={{ flex: 1, borderRadius: 25 }}
                        >
                          <Text style={styles.recipeTitleText}>
                            {item.recipeTitle}
                          </Text>
                          <Text style={styles.recipeDescription}>
                            {item.description}
                          </Text>
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
                        </LinearGradient>
                      </View>
                    </ImageBackground>
                  </View>
                </TinderCard>
              </View>
<<<<<<< HEAD
            );
          })
        ) : (
          <View style={[styles.cardContainer]} // need zindex because by default the last item in the list was displaying first
          pointerEvents="box-none">
            <TinderCard
              cardHeight={0.82 * PAGE_HEIGHT}
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
                  One moment! We're finding you some new recommendations...
                </Text>
              </View>
            </TinderCard>
          </View>
        )}
=======
            ) || "test this?"
          );
        })}
      </View>
      {/* <Button title="fetch recipes list" onPress={fetchRecipeList}/> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TBButton
          style={{ width: "25%" }}
          title="X"
          onPress={() => loadNextBatch()}
        />
        <TBButton
          style={{ width: "30%" }}
          title="Full Recipe"
          onPress={() => loadNextBatch()}
        />
        <TBButton
          style={{ width: "25%" }}
          title="Save"
          onPress={() => saveRecipe(2)}
        />
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  fullRecipeButton: {
    width: "40%",
    height: 30,
    borderColor: "white",
    margin: 5,
    marginLeft: "auto",
    marginRight: 0,
    marginTop:0,
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
=======
  recipeTitleText: {
    // textAlign: "center",
    fontSize: 25,
    color: "white",
    paddingLeft: 15,
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  },
  recipeDescription: {
    fontSize: 15,
    color: "white",
<<<<<<< HEAD
    paddingHorizontal: "4.5%",
    paddingTop: 2,
    textAlign: "justify",
=======
    paddingLeft: 15,
    paddingTop: 5,
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  },
  image: {
    width: "100%",
    height: "100%",
<<<<<<< HEAD
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
=======
    borderRadius: 25,
  },
  card: {
    borderRadius: 25,
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
<<<<<<< HEAD
  },
  wrapper: {
    flex: 1,
    overflow: "hidden",
=======
    // paddingBottom: 10,
  },
  wrapper: {
    flex: 1,
>>>>>>> 2c1eed98713fa99c48b56ccd5064dc4c8e958f5d
  },
});

export default RecommenderPage;
