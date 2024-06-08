import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClassManagement from './classManagement/ClassManagement';
import ClassDetail from './classManagement/ClassDetail';
import { createStackNavigator } from '@react-navigation/stack';
import StudentDetail from './classManagement/StudentDetail';
import ProfileScreen from './ProfileScreen';
import AddFormScreen from './classManagement/AddFormScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Class management') {
            iconName = focused ? 'book' : 'book';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Class management" component={ClassManagementStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
