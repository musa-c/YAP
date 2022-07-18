import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView,  Animated } from 'react-native'
import React, {useState, useRef} from 'react'
import {Ionicons} from "@expo/vector-icons"
// screens
import Settings from './screens/Settings'
import Planned from './screens/Planned'
import Search from './screens/Search'
import Notifications from './screens/Notifications'
import Completed from './screens/Completed'

const Drawer = () => {

    const [currentTab, setCurrentTab] = useState("Planlanan");
    const [showMenu, setShowMenu] = useState(false);

    const offsetValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const closeButtonOffset = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>

        <View style={{justifyContent:"flex-start", padding:15}}>
            <Text
            style={styles.logoText}
            >
                YAP
            </Text>

            <View style={{flexGrow:1, marginTop:50}}>
                {
                    // Tab bar buttons...
                }

              {TabButton(currentTab, setCurrentTab, "Planlanan", "list-outline")}      
              {TabButton(currentTab, setCurrentTab, "Tamamlanan", "checkmark-done-outline")}      
              {TabButton(currentTab, setCurrentTab, "Arama", "search-outline")}      
              {TabButton(currentTab, setCurrentTab, "Bildirimler", "notifications-outline")}      
              {TabButton(currentTab, setCurrentTab, "Ayarlar", "cog-outline")}      


            </View>

           
            </View>  

        { 
        // Bindirme Görünümü..
        }

        <Animated.View style={{
            flexGrow:1,
            backgroundColor:"white",
            position:"absolute",
            top:0,
            bottom:0,
            left:0,
            right:0,
            paddingHorizontal:0,
            
            paddingVertical:0,
            borderRadius: showMenu ? 15 : 0,
            // Görünümü Dönüştürme...
            transform:[
                {scale: scaleValue},
                {translateX: offsetValue}
            ]
         }}>

             {
                 // Menu Button..
             }

             <Animated.View style={{
                 transform: [{
                     translateY:closeButtonOffset
                 }]
             }}>

             <TouchableOpacity 
             style={{alignSelf:"baseline"}}
             onPress={()=>{
                 // Görünümü ölçekleme...
                 Animated.timing(scaleValue, {
                     toValue: showMenu ? 1 : 0.88,
                    // toValue: 0.99,
                     duration: 300,
                     useNativeDriver: true
                 })
                 .start()

                 Animated.timing(offsetValue, {
                     
                    toValue: showMenu ? 0 : 230,
                    duration: 300,
                    useNativeDriver: true
                
                })
                .start()

                Animated.timing(closeButtonOffset, {
                    
                   toValue: !showMenu ? -30 : 0,
                   duration: 300,
                   useNativeDriver: true
               })
               .start()


                 setShowMenu(!showMenu)
             }}
             >
                 <View
                 style={{
                    //  marginTop:40
                    marginTop: showMenu ? 40 : 20,
                    paddingHorizontal:15,
                    alignSelf:"baseline",
                 }}
                 >

                     {/* {console.log(showMenu)} */}
                 <Ionicons
                 name={showMenu ? "close-outline" : "menu-outline"}
                 size={40} 
                 color="black"
                 
                 />
                 </View>
                 </TouchableOpacity>

             
                
                 

                 <Text
                 style={{
                     fontSize:45,
                     fontWeight:"bold",
                     color:"black",
                     paddingTop:5,
                     paddingHorizontal:15
                 }}
                 >
                     {currentTab}
                 </Text>

             </Animated.View>


                 
             {(currentTab == "Planlanan") &&
                 <View style={{flex:1}}>
                 <Planned  />
                 </View>
                 }
         

                {(currentTab == "Tamamlanan") &&
                 <View style={{flex:1, flexGrow:1}}>
                 <Completed  />
                 </View>
                 }

                 
                {(currentTab == "Arama") &&
                 <View style={{flex:1, flexGrow:1}}>
                 <Search  />
                 </View>
                 }

                {(currentTab == "Bildirimler") &&
                 <View style={{flex:1, flexGrow:1}}>
                 <Notifications  />
                 </View>
                 }

{(currentTab == "Ayarlar") &&
                 <View style={{flex:1, flexGrow:1}}>
                 <Settings  />
                 </View>
                 }

         </Animated.View>

         

    </SafeAreaView>
  )
}

// ÇOKLU BUTON

const TabButton = (currentTab, setCurrentTab, title, IconName) => {
    return(
        
        <TouchableOpacity
        onPress={() => {
            setCurrentTab(title)
        }}
        >
        <View style={{
            flexDirection:"row",
            alignItems:"center",
            paddingVertical:8,
            backgroundColor: currentTab == title ? "white" : "transparent",
            borderRadius: 8,
            paddingLeft:13,
            paddingRight:35,
            marginTop:15
            
            }}>
            <Ionicons 
            name={IconName}
            size={25}
            color={currentTab == title ? "#3D6CB9" : "white"}
            />
            <Text
            style={{
                fontSize:20,
                fontWeight:"bold",
                paddingLeft:15,
                color: currentTab == title ? "#3D6CB9" : "white",

            }}
            >
                {title}
            </Text>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#3D6CB9",
        alignItems:"flex-start",
        justifyContent:"flex-start"
    },
    logoText:{
        fontSize: 110,
        fontWeight:"bold",
        color:"white",
        // fontFamily:"Verdana"
    }
})

export default Drawer