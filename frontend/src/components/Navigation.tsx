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
import CreatePostPage from "../screens/CreatePostPage";
import RecipePage from "../screens/RecipePage";
import ViewPostPage from "../screens/ViewPostPage";
import DietaryPreference from "../screens/DietaryPreference";
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from '@expo/vector-icons/Ionicons';
import EditRecipePage from "../screens/EditRecipePage";
import SettingsPage from "../screens/SettingsPage";

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
    <Tab.Navigator initialRouteName='AccountPageStack' screenOptions={tabBarOptions} sceneContainerStyle={{ backgroundColor: 'transparent' }}/*tabBar={props => <NavBar {...props} />}*/>
      <Tab.Screen
        name='CreatePostOrRecipeStack'
        component={CreatePostOrRecipeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" size={size + 10} color={color} />),
          tabBarActiveTintColor: '#8CC84B',
          tabBarInactiveTintColor: '#a1a1a1',
        }}
      />
      <Tab.Screen
        name='SearchPageStack'
        component={SearchPageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />),
          tabBarActiveTintColor: '#8CC84B',
          tabBarInactiveTintColor: '#a1a1a1',
        }}
      />

      <Tab.Screen
        name='RecommenderPageStack'
        component={RecommenderPageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />),
          tabBarActiveTintColor: '#8CC84B',
          tabBarInactiveTintColor: '#a1a1a1',
        }}
      />

      <Tab.Screen
        name='AccountPageStack'
        component={AccountPageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />),
          tabBarActiveTintColor: '#8CC84B',
          tabBarInactiveTintColor: '#a1a1a1',
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
    <Stack.Screen name='ViewPostPage' component={ViewPostPage} />
    <Stack.Screen name='RecipePage' component={RecipePage} />
    <Stack.Screen name='SettingsPage' component={SettingsPage} />
    <Stack.Screen name='EditRecipePage' component={EditRecipePage} />
    <Stack.Screen name='DietaryPreference' component={DietaryPreference} />
  </Stack.Navigator>
);

const SearchPageStack = () => (
  <Stack.Navigator initialRouteName='SearchPage' screenOptions={stackOptions}>
    <Stack.Screen name='SearchPage' component={SearchPage} />
    <Stack.Screen name='ViewPostPage' component={ViewPostPage} />
    <Stack.Screen name='RecipePage' component={RecipePage} />
    <Stack.Screen name='EditRecipePage' component={EditRecipePage} />
  </Stack.Navigator>
);
const RecommenderPageStack = () => (
  <Stack.Navigator initialRouteName='SearchPage' screenOptions={stackOptions}>
       <Stack.Screen name='RecommenderPage' component={RecommenderPage} />
      <Stack.Screen name='RecipePage' component={RecipePage} />
  </Stack.Navigator>
);
export default Navigation;
