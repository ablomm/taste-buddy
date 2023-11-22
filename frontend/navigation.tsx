import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {View, Text} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import LogInOrSignUpOptionPage from "./pages/LoginOrSignUpOptionPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const Stack = createStackNavigator();

const screenOptions ={
    headerShown: false
}
const LogInOrSignUpStack= () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='LogInOrSignUpOptionPage' screenOptions={screenOptions}>
            <Stack.Screen name = 'LogInOrSignUpOptionPage' component={LogInOrSignUpOptionPage}/>
            <Stack.Screen name = 'LoginPage' component={LoginPage}/>
            <Stack.Screen name = 'SignUpPage' component={SignUpPage}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default LogInOrSignUpStack;