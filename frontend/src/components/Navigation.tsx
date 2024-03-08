import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import LogInOrSignUpOptionPage from "../screens/LoginOrSignUpOptionPage";
import LoginPage from "../screens/LoginPage";
import SignUpPage from "../screens/SignUpPage";
import ExplorePage from "../screens/ExplorePage";
import UserProvider, { UserContext } from "../providers/UserProvider";
import CreateRecipePage from "../screens/CreateRecipePage";
import GalleryPage from "../screens/GalleryPage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountPage from "../screens/AccountPage";
import SearchPage from "../screens/SearchPage";
import RecommenderPage from "../screens/RecommenderPage";
import DietaryPreference from "../screens/DietaryPreference";
import CreatePostPage from "../screens/CreatePostPage";
import RecipePage from "../screens/RecipePage";
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();
const stackOptions = {
  headerShown: false
}
const tabBarOptions = {
  tabBarShowLabel: false,
  headerShown: false
}

const Navigation = () => {
  const userContext = useContext(UserContext) as any;

  return userContext.state.isSignedIn ? <SignedInNavigation /> : <LoggedOutNavigation />;
}

const LoggedOutNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='LogInOrSignUpOptionPage' screenOptions={stackOptions}>
      <Stack.Screen name='LogInOrSignUpOptionPage' component={LogInOrSignUpOptionPage} />
      <Stack.Screen name='LoginPage' component={LoginPage} />
      <Stack.Screen name='SignUpPage' component={SignUpPage} />
    </Stack.Navigator>
  </NavigationContainer>
)

const SignedInNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator initialRouteName='ExplorePage' screenOptions={tabBarOptions} sceneContainerStyle={{ backgroundColor: 'transparent' }}/*tabBar={props => <NavBar {...props} />}*/>
      <Tab.Screen
        name='ExplorePage'
        component={RecipePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="planet-outline" size={size} color={color} />),
        }}
      />

      <Tab.Screen
        name='SearchPage'
        component={SearchPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />),
        }}
      />

      <Tab.Screen
        name='CreatePostOrRecipeStack'
        component={CreatePostOrRecipeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" size={size+20} color={color} />),
        }}
      />

      <Tab.Screen
        name='RecommenderPage'
        component={RecommenderPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />),
        }}
      />

      <Tab.Screen
        name='AccountPageStack'
        component={AccountPageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);
const CreatePostOrRecipeStack = () => (
  <Stack.Navigator initialRouteName='GalleryPage' screenOptions={stackOptions}>
    <Stack.Screen name='GalleryPage' component={GalleryPage} />
    <Stack.Screen name='CreateRecipePage' component={CreateRecipePage} />
    <Stack.Screen name='CreatePostPage' component={CreatePostPage} />
  </Stack.Navigator>
);
const AccountPageStack = () => (
  <Stack.Navigator initialRouteName='AccountPage' screenOptions={stackOptions}>
    <Stack.Screen name='AccountPage' component={AccountPage} />
    <Stack.Screen name='DietaryPreference' component={DietaryPreference} />
  </Stack.Navigator>
);
export default Navigation;