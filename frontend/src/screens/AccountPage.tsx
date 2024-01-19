import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {UserContext} from "../providers/UserProvider";
import TBButton from '../components/TBButton';
import Post from '../components/Post';

const Tab = createMaterialTopTabNavigator();

const profilePicture = require("../../assets/profile.jpg");

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
            <Post style={styles.postImage} key={post.id} imageName={post.imageName} />
          </View>
        ))}
      </View>
    </View>
      </ScrollView>
    );
}

interface SavedPostsScreenProps {
  savedPosts: Post[];
}

const SavedPostsScreen: React.FC<SavedPostsScreenProps> = ({ savedPosts }) => (
  <View style={styles.screen}>
    <View style={styles.postsContainer}>
      {savedPosts.map(post => (
        <View key={post.id} style={styles.postContainer}>
          <Image source={profilePicture} style={styles.postImage} />
        </View>
      ))}
    </View>
  </View>
);

const AccountPage = () => {
  const userContext = React.useContext(UserContext) as any;
  const username = userContext.state.username;

  const [posts, setPosts] = useState();
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
    navigation.navigate('DietaryPreference');
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
        console.log(result);
        setPosts(result);
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
          <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NavigationContainer independent={true}>
        <Tab.Navigator>
          <Tab.Screen name="Recent Posts">
            {()=> posts ? (<RecentPostsScreen posts={posts} refreshFunction={onRefresh} refreshing={refreshing} />) : (<Text>Loading ...</Text>)}
          </Tab.Screen>
          <Tab.Screen name="Saved Posts">
            {() => <SavedPostsScreen savedPosts={savedPosts} />}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    width: 85,
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