import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./src/LoginPage";
import MainPage from "./src/MainPage";

const Stack = createStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialScreen="Login">
          <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
          <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}