import { View, Text } from 'react-native'
import React from 'react'
import Drawer from './src/Drawer'
import { NavigationContainer } from '@react-navigation/native'
import Drawer0 from './src/Drawer0'
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';


const App = () => {
  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      <NavigationContainer>
        <Drawer0 />
      </NavigationContainer>
    </View>
  )
}

export default App