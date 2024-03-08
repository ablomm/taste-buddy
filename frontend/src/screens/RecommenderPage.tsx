import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { window } from "../constants";
import TBButton from "../components/TBButton";
import { TinderCard } from "rn-tinder-card";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../providers/UserProvider";

const RecommenderPage = () => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;
  const PAGE_WIDTH = window.width;
  const PAGE_HEIGHT = window.height;

  const [recipes, setRecipes] = useState<any | null>(null); //recipes to display to user
  const [loading, setLoading] = useState(false); //to display loading signal
  const [displayRecipeNumber, setDisplayRecipeNumber] = useState(0); //for how many recipes have been shown to determine refresh

  const fetchRecipeList = async () => {
    try {
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/recipe/get-all-recipes`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        // setRecipes([...recipes, result]);
        setRecipes(result);
        setDisplayRecipeNumber(result.length - 1);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateRecipeList = async () => {
    try {
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/recipe/get-all-recipes`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      await response.json().then((result) => {
        // setRecipes([...recipes, result]);
        setRecipes(result);
        setDisplayRecipeNumber(result.length - 1);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const rejectRecipe = async (recipeID: number) => {
    setDisplayRecipeNumber(displayRecipeNumber - 1);
    checkRecipeList();
  };

  const saveRecipe = async (recipeID: number, username: any) => {
    try {
      // const;
      setDisplayRecipeNumber(displayRecipeNumber - 1);
      let response = await fetch(
        `${
          process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"
        }/user/save-recipe/${username}}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            recipeID: recipeID,
          }),
        }
      );

      if (response.status !== 200) {
        console.error("save recipe unsuccessful", username);
    } else {
      console.log("save recipe successful");
    }
    } catch (error) {
      console.error(error);
    }
    checkRecipeList();
  };

  const checkRecipeList = async () => {
    if (displayRecipeNumber == 1) {
      console.log("test append");
      updateRecipeList();
    }
  };

  useEffect(() => {
    fetchRecipeList();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, height: PAGE_HEIGHT }}>
        {recipes?.map((item, index) => {
          return (
            (
              <View
                key={index}
                style={styles.cardContainer}
                pointerEvents="box-none"
              >
                <TinderCard
                  cardHeight={0.75 * PAGE_HEIGHT}
                  cardWidth={0.95 * PAGE_WIDTH}
                  cardStyle={styles.card}
                  // disableTopSwipe={true}
                  onSwipedRight={() => {
                    // saveRecipe(item.id, username);
                  }}
                  onSwipedLeft={() => {
                    rejectRecipe(item.id);
                  }}
                  onSwipedBottom={() => {
                    Alert.alert("Swiped Bottom");
                  }}
                  onSwipedTop={() => {
                    Alert.alert("Swiped Top");
                  }}
                >
                  <View>
                    <ImageBackground
                      source={{ uri: item.recipeImage }}
                      style={styles.image}
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
                        </LinearGradient>
                      </View>
                    </ImageBackground>
                  </View>
                </TinderCard>
              </View>
            ) || "test this?"
          );
        })}
      </View>
      {/* <Button title="fetch recipes list" onPress={fetchRecipeList}/> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TBButton style={{ width: "25%" }} title="X" />
        <TBButton
          style={{ width: "30%" }}
          title="Full Recipe"
          onPress={() => fetchRecipeList}
        />
        <TBButton style={{ width: "25%" }} title="Save" onPress={() => saveRecipe(2,username)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeTitleText: {
    // textAlign: "center",
    fontSize: 25,
    color: "white",
    paddingLeft: 15,
  },
  recipeDescription: {
    fontSize: 15,
    color: "white",
    paddingLeft: 15,
    paddingTop: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  card: {
    borderRadius: 25,
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 10,
  },
  wrapper: {
    flex: 1,
  },
});

export default RecommenderPage;
