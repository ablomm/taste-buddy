import React, {useEffect, useState} from "react";
import {FlatList, View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {TouchableRipple} from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import RelevantPostsGrid from "./ReleventPostsGrid";
import {NoResultMessage} from "./NoResultMessage";


interface Recipe {
    id: number,
    authorID: number,
    creationTime: string,
    recipeTitle: string,
    description: string,
    cookTimeHours: number,
    cootTimeMinutes: number,
    calories: number,
    servings: number,
    recipeImage: string,
    averageRating: number,
    ingredients: any[],
    instructions: any[]
}

function SearchResultBody({ searchResults }) {
    const [selectedTab, setSelectedTab] = useState<'recipes' | 'posts'>('recipes');
    const [relevantRecipes, setRelevantRecipes] = React.useState([]);
    const [relevantPosts, setRelevantPosts] = React.useState([]);

    useEffect(() => {
        // Update these states everytime a new search result exists
        setRelevantRecipes(searchResults['recipes']);
        setRelevantPosts(searchResults['posts']);
    }, [searchResults]);

    const Recipe = ({ item }: { item: Recipe }) => (
        <TouchableRipple onPress={()=>console.log('CLICKED RECIPE')}>
            <View style={styles.recipeContainer}>
                <Image style={styles.image} source={{ uri:item.recipeImage}} />
                <View style={styles.textContainer}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{item.recipeTitle}</Text>
                    <StarRating
                        rating={item.averageRating}
                        onChange={()=>{}}
                        maxStars = {5}
                        starSize={24}
                    />
                    <Text>Tags</Text>
                    <Text>{item.calories} Calories</Text>
                    <Text>Cook Time: {item.cookTimeHours}h {item.cootTimeMinutes}m</Text>
                    <Text>{item.servings} {item.servings == 1 ? 'Serving' : 'Servings'}</Text>
                </View>
            </View>
        </TouchableRipple>
    );

    function displayPostsTab() {
        if (relevantPosts.length != 0) {
            return <RelevantPostsGrid posts={relevantPosts} />
        } else {
            return <NoResultMessage message='No relevant posts found.'/>
        }
    }

    function displayRecipesTab() {
        if (relevantRecipes.length != 0) {
            return <FlatList
                data={relevantRecipes}
                renderItem={Recipe}
                keyExtractor={item => item.id.toString()}
            />
        } else {
            return <NoResultMessage message='No relevant recipes found.'/>
        }
    }


    return (
      <View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => setSelectedTab('recipes')}
              >
                  <Text style={selectedTab == 'recipes' ? styles.tabButtonTextActive : styles.tabButtonTextInactive}>Recipes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => setSelectedTab('posts')}
              >
                  <Text style={selectedTab == 'posts' ? styles.tabButtonTextActive : styles.tabButtonTextInactive}>Posts</Text>
              </TouchableOpacity>
          </View>

          {
              selectedTab == 'recipes' ?
                  /* Recipes */
                  displayRecipesTab()
                  :
                  /* Posts */
                  displayPostsTab()
          }
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        borderColor: '#c2c2c2',
        borderWidth: 1,
        borderRadius: 20,
        width: 'auto',
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    image: {
        backgroundColor: 'gray',
        margin: 1,
        padding: 1,
        aspectRatio: 1, // Set aspect ratio to 1:1 (square)
        height: 'auto',
        maxWidth: 'auto',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'white'
    },
    recipeContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 25
    },
    textContainer: {
        marginLeft: 10
    },
    tabButton: {
        backgroundColor: '#ffffff',
        width: 100,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center'
    },
    tabButtonTextInactive: {
        textAlign: 'center',
        color: '#c2c2c2',
        fontWeight: "bold"
    },
    tabButtonTextActive: {
        textAlign: 'center',
        color: '#29a60d',
        fontWeight: "bold"
    },
});
export default SearchResultBody;
