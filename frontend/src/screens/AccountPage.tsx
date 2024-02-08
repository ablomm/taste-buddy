import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {UserContext} from "../providers/UserProvider";
import TBButton from '../components/TBButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/header/Header';

const Tab = createMaterialTopTabNavigator();

const profilePicture = require("../../assets/temp/tempfood.jpg");

interface Post {
  id: number;
  content: string;
}
const RecentPostsScreen: ({posts}: {
  posts: any
}, refreshFunction, refreshing) => React.JSX.Element = ({ posts, refreshFunction, refreshing }) => {
    return (
    <ScrollView
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshFunction}
          />
        }
    >
    <View style={styles.screen}>
      <View style={styles.postsContainer}>
        {posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Image source={{uri: post.image}} style={styles.postImage} />
          </View>
        ))}
      </View>
    </View>
      </ScrollView>
    );
}

interface SavedPostsScreenProps {
  id: number;
  content: string;
}

const SavedPostsScreen: ({savedPosts1}: {
  savedPosts1: any
}, refreshFunction, refreshing) => React.JSX.Element = ({ savedPosts1, refreshFunction, refreshing }) => {
    return (
    <ScrollView
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshFunction}
          />
        }
    >
    <View style={styles.screen}>
      <View style={styles.postsContainer}>
        {savedPosts1
          .filter(post => post.isShowing === true) // Filter only posts with isShowing set to true
          .map(post => (
            <View key={`${post.recipe.userID}-${post.recipe.recipeID}`} style={styles.postContainer}>
              <Image source={{uri: post.recipe.recipeImage}} style={styles.postImage} />
            </View>
        ))}
      </View>
    </View>
      </ScrollView>
    );
}

const AccountPage = () => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

  const [posts, setPosts] = useState();
  const [savedPosts1, setSavedPosts] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const savedPosts = [
    { id: 5, content: '' },
    { id: 6, content: '' },
  ];

  const navigation = useNavigation();

  const navigateToSettings = () => {
    // Navigate to the settings page
    navigation.navigate('SettingsPage');
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/post/get-posts/${username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      await response.json().then(result => {
        setPosts(result);
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/get-saved-recipes/${username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });  

      await response.json().then(result => {
        let test = JSON.stringify(result);
        let test1 = JSON.parse(test).savedRecipes;

        setSavedPosts(test1);
        console.log("log" + JSON.stringify(test1));
      });
    } catch (error) {
      console.error(error); 
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchUserData()
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={profilePicture} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
        </View>

        <TouchableOpacity>
          <Icon name="share-square" style={styles.icon}></Icon>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="gear" style={styles.icon} onPress={navigateToSettings}/>
        </TouchableOpacity>
      </View>

      <NavigationContainer independent={true}>
        <Tab.Navigator>
          <Tab.Screen name="Recent Posts">
            {()=> posts ? (<RecentPostsScreen posts={posts} refreshFunction={onRefresh} refreshing={refreshing} />) : (<Text>Loading ...</Text>)}
          </Tab.Screen>
          <Tab.Screen name="Saved Posts">
            {() => savedPosts1 ? (<SavedPostsScreen savedPosts1={savedPosts1} refreshFunction={onRefresh} refreshing={refreshing} />) : (<Text>Loading ...</Text>)}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <TBButton onPress={userContext.logout} title="Logout"/>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // scrollView: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  icon:{
    width: 30,
    height: 30,
    fontSize:27,
    marginLeft:8,
    color:"#00D387"
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingsButton: {
    backgroundColor: '#8CC84B', // Light green color
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 110,
    borderWidth:0
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postContainer: {
    width: '48%',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  postContent: {
    flex: 1,
    fontSize: 16,
  },
});

export default AccountPage;