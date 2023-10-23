import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppBar from './src/components/AppBar';
import InputScreen from './src/screens/InputScreen';
import OutputScreen from './src/screens/OutputScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppBar />
      <Stack.Navigator
        initialRouteName="Input"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Output" component={OutputScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
