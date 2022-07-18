import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Planned from './screens/Planned';
import Completed from './screens/Completed';
import 'react-native-gesture-handler';
import {Ionicons, Feather} from "@expo/vector-icons"


const Drawer = createDrawerNavigator(); 
const Drawer0 = () => {
  return (
   <Drawer.Navigator
   drawerStyle={{
     width:280,
    //  backgroundColor:"transparent"
   }}
   edgeWidth={100}
   drawerContentOptions={{
     labelStyle : {fontSize: 20, fontWeight:"bold"},

   }}
   >
       <Drawer.Screen name="Planned" component={Planned} options={{title:"Planlanan"  }}/>
       <Drawer.Screen name="Completed" component={Completed} options={{title:"Tamamlanan"}}/>
   </Drawer.Navigator>
  )
}

export default Drawer0