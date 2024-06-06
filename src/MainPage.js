import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClassManagement from './classManagement/ClassManagement';
import ClassDetail from './classManagement/ClassDetail';
import { createStackNavigator } from '@react-navigation/stack';
import StudentDetail from './classManagement/StudentDetail';
import ProfileScreen from './ProfileScreen';
import AddFormScreen from './classManagement/AddFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => {
  return <View><Text>Home Screen</Text></View>;
};


const ClassManagementStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClassManagement" component={ClassManagement} options={{ headerShown: false }}/>
      <Stack.Screen name="ClassDetail" component={ClassDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="AddFormScreen" component={AddFormScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default function MainPage() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Class management" component={ClassManagementStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}