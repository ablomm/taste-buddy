import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
        component={ExplorePage}
      />

      <Tab.Screen
        name='SearchPage'
        component={SearchPage}
      />

      <Tab.Screen
        name='GalleryPage'
        component={GalleryPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require("../../assets/NavBar/plus_btn.png")} style={{ width: size + 16, height: size + 16 }} />),
        }}
      />

      <Tab.Screen
        name='RecommenderPage'
        component={RecommenderPage}
      />

      <Tab.Screen
        name='AccountPage'
        component={AccountPage}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default Navigation;