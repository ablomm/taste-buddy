import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity  } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const profilePicture = require("../../assets/profile.jpg");

interface Post {
  id: number;
  content: string;
}

interface RecentPostsScreenProps {
  posts: Post[];
}

const RecentPostsScreen: React.FC<RecentPostsScreenProps> = ({ posts }) => (
    <View style={styles.screen}>
      <View style={styles.postsContainer}>
        {posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Image source={profilePicture} style={styles.postImage} />
          </View>
        ))}
      </View>
    </View>
  );

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
  const username = 'example_user';
  const recentPosts = [
    { id: 1, content: '' },
    { id: 2, content: '' },
    { id: 3, content: '' },
    { id: 4, content: '' },
  ];
  const savedPosts = [
    { id: 5, content: '' },
    { id: 6, content: '' },
  ];

  const navigation = useNavigation();

  const navigateToSettings = () => {
    // Navigate to the settings page
    navigation.navigate('DietaryPreference');
  };

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
            {() => <RecentPostsScreen posts={recentPosts} />}
          </Tab.Screen>
          <Tab.Screen name="Saved Posts">
            {() => <SavedPostsScreen savedPosts={savedPosts} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  postContent: {
    flex: 1,
    fontSize: 16,
  },
});

export default AccountPage;