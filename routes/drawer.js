import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/home';
import Export from '../screens/export';

import Header from '../shared/header';

const Drawer = createDrawerNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          header: ({ scene }) => {
            const { options } = scene.descriptor;
            const title = options.headerTitle !== undefined
                            ? options.headerTitle
                            : options.title !== undefined
                            ? options.title
                            : scene.route.name
            return (
              <Header navigation={scene.descriptor.navigation} title={title} />
            )
          },
          headerShown: true
        }}
        initialRouteName="Bullet Journal"
      >
        <Drawer.Screen name="Bullet Journal"component={HomeScreen} />
        <Drawer.Screen name="Export Bullets"component={Export} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
