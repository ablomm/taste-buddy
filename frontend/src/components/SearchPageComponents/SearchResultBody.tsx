import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FilterBar } from "./FilterBar";
import { RecipeTab } from "./RecipeTab";
import { Recipe } from "../../interfaces/RecipeInterface";
import { PostTab } from "./PostTab";

function SearchResultBody({ navigation, searchResults, search }) {
  const [selectedTab, setSelectedTab] = useState<"recipes" | "posts">(
    "recipes"
  );
  const [relevantRecipes, setRelevantRecipes] = React.useState([]);
  const [relevantPosts, setRelevantPosts] = React.useState([]);
  const [selectedOption, setSelectedOption] = useState("Relevancy");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortedRecipes, setSortedRecipes] = useState<Recipe[]>([]);
  const [allUniqueTags, setAllUniqueTags] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);

  useEffect(() => {
    // Update these states everytime a new search result exists
    collectTags(searchResults["recipes"]);
    setRelevantRecipes(searchResults["recipes"]);
    setRelevantPosts(searchResults["posts"]);
  }, [searchResults]);

  function collectTags(recipes: Recipe[]) {
    const uniqueTagsSet = new Set<string>();
    if (recipes != undefined) {
      recipes.forEach((recipe) => {
        if (recipe.tags != undefined) {
          recipe.tags.forEach((tag) => {
            uniqueTagsSet.add((tag.name?tag.name:tag.value));
          });
        }
      });
      setAllUniqueTags(Array.from(uniqueTagsSet));
    }
  }

  function applyRecipeSortingAndFiltering() {
    if (relevantRecipes != null && relevantRecipes.length != 0) {
      let processedArray: Recipe[] = [...relevantRecipes];

      if (selectedOption != "Relevancy") {
        sortRecipes(processedArray, selectedOption);
      }

      if (selectedTags.length != 0) {
        processedArray = filterRecipes(processedArray, selectedTags);
      }

      setSortedRecipes(processedArray);
    }
  }

  function filterRecipes(recipes: Recipe[], selectedTags: string[]) {
    return recipes.filter((recipe: Recipe) => {
      let tagsName = recipe.tags.map(item => item.name)
      /*console.log(selectedTags.some(
        (tag) => recipe.tags && tagsName.includes(tag)
      ))*/
      return selectedTags.some(
        (tag) => recipe.tags && tagsName.includes(tag)
      );
    });
  }

  function sortRecipes(recipes: Recipe[], sortingOption: string) {
    switch (sortingOption) {
      case "Calories":
        recipes.sort((a, b) => a.calories - b.calories);
        break;
      case "Cook Time":
        recipes.sort(
          (a, b) =>
            a.cookTimeHours * 60 +
            a.cootTimeMinutes -
            (b.cookTimeHours * 60 + b.cootTimeMinutes)
        );
        break;
      case "Servings":
        recipes.sort((a, b) => a.servings - b.servings);
        break;
      case "Rating":
        recipes.sort((a, b) => b.averageRating - a.averageRating); // Assuming higher ratings should come first
        break;
      default:
        console.log("Invalid sorting option");
    }
  }

  function applyFilteringAndSorting() {
    if (selectedTags.length == 0 && selectedOption == "Relevancy") {
      setFilterStatus(false);
    } else {
      setFilterStatus(true);
      applyRecipeSortingAndFiltering();
    }
  }

  function selectSortedOption(option: string) {
    setSelectedOption(option);
  }

  function selectedFilter(filters: string[]) {
    setSelectedTags(filters);
  }

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setSelectedTab("recipes")}
        >
          <Text
            style={
              selectedTab == "recipes"
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive
            }
          >
            Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setSelectedTab("posts")}
        >
          <Text
            style={
              selectedTab == "posts"
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive
            }
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        {selectedTab === "recipes" && (
          <FilterBar
            onSelectFilter={selectedFilter}
            onSelectOption={selectSortedOption}
            tags={allUniqueTags}
            onChange={applyFilteringAndSorting}
          />
        )}
        {selectedTab === "recipes" ? (
          <RecipeTab
            navigation={navigation}
            search={search}
            recipes={filterStatus ? sortedRecipes : relevantRecipes}
          />
        ) : (
          <PostTab relevantPosts={relevantPosts} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#c2c2c2",
    borderWidth: 1,
    borderRadius: 20,
    width: "auto",
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  image: {
    backgroundColor: "gray",
    margin: 1,
    padding: 1,
    aspectRatio: 1, // Set aspect ratio to 1:1 (square)
    height: "auto",
    maxWidth: "auto",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "white",
  },
  recipeContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  tabButton: {
    backgroundColor: "#ffffff",
    width: 100,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
  },
  tabButtonTextInactive: {
    textAlign: "center",
    color: "#c2c2c2",
    fontWeight: "bold",
  },
  tabButtonTextActive: {
    textAlign: "center",
    color: "#8CC84B",
    fontWeight: "bold",
  },
});
export default SearchResultBody;
