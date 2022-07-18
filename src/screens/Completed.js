import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Pressable, Image, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Ionicons} from "@expo/vector-icons"
import * as SQLite from 'expo-sqlite';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';


const db = SQLite.openDatabase("YAPP");


const Completed = ({navigation}) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [ImageModal, setImageModal] = useState();
  const [GorevModal, setGorevModal] = useState();


  const [ID, setID] = useState();


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
    // console.log(db)
    // DELETE FROM YAP WHERE ID = ?
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState([]);

    const Delete = (ID) => {
        db.transaction((tx)=>{
            tx.executeSql("DELETE FROM YAP WHERE ID = ?",[ID], null, (tx,result)=>{
            })
        }, ()=>{
            alert("Hata! Lütfen Tekrar Deneyiniz.")
        }  ,setRefresh(!refresh))
    }

    useEffect(()=>{
        // console.log("geldi")
        const data = []
        db.transaction((tx)=>{
            tx.executeSql("SELECT * FROM YAP WHERE done = TRUE", null, (tx, result) =>{
                for(let i = 0; i<result.rows.length; i++){
                    data.push(result.rows.item(i))
                }
                setData(data)
                setRefresh(!refresh)
            })
        })
    }, [refresh])
    
    const EmptyComponent = () =>{
        return(
            <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
                <Text style={{color:"grey", fontSize:20}}>Henüz Tamamlanmış bir görev yok.</Text>
            </View>
        )
    }


    const ListHeaderComponent = () =>{
        return(
       <></>
        )
    }


  return (
      <>
    <View style={styles.cont}>

    {isModalVisible && 
          <View>
              <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  style={{flex:1}}
>
          <Modal 
          onBackdropPress={toggleModal}
          isVisible={isModalVisible}
          backdropOpacity={0.70}
          >
            <View style={{backgroundColor:"white", padding:10, borderRadius:10}}>
              <Text style={{fontSize:28, fontWeight:"bold", alignSelf:"center"}}>
                   Silinsin mi?
              </Text>
              <Text
              style={{fontSize:20, padding:15}}
              >{GorevModal}</Text>

                {ImageModal && 
        <Image source={{uri: `data:image/jpeg;base64,${ImageModal}`}}  style={{height:200, width:150, borderRadius:10, alignSelf:"center"}}/>
                
                }

              <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:10, marginTop:10}}>
                  <TouchableOpacity onPress={()=>{
                      Delete(ID)
                      toggleModal()
                  }}>
                  <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, paddingHorizontal:40}}>
              <Text style={{fontSize:25 }}>Evet</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{
                  toggleModal()
              }}
              >
              <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, paddingHorizontal:40}}>
              <Text style={{fontSize:25,}}>Hayır</Text>
              </View>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
          </KeyboardAvoidingView>
        </View>
        }

    <View style={{marginTop:20, marginLeft:20, marginRight:20, justifyContent:"space-between", flexDirection:"row"}}>
                 <Ionicons name='menu-outline' size={45} style={{alignSelf:"center"}} color="grey" onPress={()=>{
             navigation.openDrawer();
             
           }}/>
                <Text style={{fontSize:45, fontWeight:"bold"}}>Tamalanan</Text>
            </View>

        <FlatList 
        data={data}
        keyExtractor={(data)=>data.ID}
        contentContainerStyle={{flex:1}}
        ListEmptyComponent={EmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={(element)=>(
       

            <View style={styles.PlanBox}>
            <View style={styles.circle}>
                <Ionicons  
                name="checkmark-circle-sharp"
                size={25}
                color="#1FAB89"
                />
            </View>
            <View style={{flexDirection:"row", flex:1, justifyContent:"space-between", }}>
            <View style={{flexDirection:"column"}}>
            <Text style={styles.PlanText}>
                {element.item.gorev}
            </Text>  
            
            {element.item.image && 
        <Image source={{uri: `data:image/jpeg;base64,${element.item.image}`}}  style={{height:60, width:60, borderRadius:10, marginTop:5}}/>
    }
            </View>
            
            <Ionicons  
                name="trash-outline"
                size={25}
                color="red"
                onPress={()=>{
                setID(element.item.ID)
                setGorevModal(element.item.gorev)
                setImageModal(element.item.image)
                toggleModal()
                }}
                />
</View>
      </View>
      


        )}
        />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    cont :{
        flex:1,
    },
    
    PlanBox:{
        backgroundColor:"#A6E3E9",
        padding:15,
        flexDirection:"row",
        borderRadius:10,
        marginHorizontal:10,
        marginTop:10,
        alignItems:"center"
        
    },
    PlanText:{
        fontSize:20,
        textAlignVertical:"center",
        textDecorationLine:"line-through",
        textDecorationStyle: "solid"
    },
    circle:{
        marginRight:10,
        alignItems:"center",
        justifyContent:"center"
    },
    TextInput:{
        // alignItems:"flex-end",
        // backgroundColor:"red",
        // flex:1      
        backgroundColor:"#CAF0F8",
        margin:10,
        borderRadius:10,
        padding:20,
        fontSize:18
    },
    // TextInputBox:{
    //     // flex:1,
    //     // justifyContent:"flex-end",

    // 
    CompletedText:{
        fontSize:15,
    },
    CompletedBox:{
        marginTop:5,
        padding:7,
        marginLeft:10,
        paddingRight:30,
        borderRadius:8,
        backgroundColor:"#90E0EF",
        alignSelf:"baseline",
        justifyContent:"center",
        alignItems:"center"
    }
})

export default Completed