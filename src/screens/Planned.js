import { View, Text, Button, FlatList, TextInput, Keyboard, TouchableOpacity, Dimensions, Image, Pressable, KeyboardAvoidingView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import {Ionicons, Feather} from "@expo/vector-icons"
import moment from "moment";
import trLocale from "moment/locale/tr"
import check from "../rec/check.json"
import AnimatedLottieView from "lottie-react-native";
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const db = SQLite.openDatabase("YAPP");
const Planned = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [value, setValue] = useState("");
  const [ID, setID] =useState();
  const [data, setData] = useState([])
  const [ImageModal, setImageModal] = useState(null);
  const [imageWidth, setimageWidth] = useState("");
  const [imageHeight, setimageHeight] = useState("");



useEffect(()=>{
  db.transaction((tx)=>{
    tx.executeSql("CREATE TABLE IF NOT EXISTS YAP (ID INTEGER PRIMARY KEY AUTOINCREMENT, gorev TEXT, image BLOB, imageWidth NUMERIC, imageHeight NUMERIC, date DATETIME DEFAULT CURRENT_TIMESTAMP, done NUMERIC)",[],(tx, result)=>{
    })
  })
}, [])

useEffect(()=>{
  const data = [];
  db.transaction((tx)=>{
    tx.executeSql("SELECT * FROM YAP WHERE done = FALSE ORDER BY ID DESC", [], (tx, result)=>{
      for (let index = 0; index < result.rows.length; index++) {
       data.push(result.rows.item(index))
      }
      setData(data)
    })
  })

}, [refresh])

const insert = () =>{  
    if(value != "" || image != null){
      // console.log(imageHeight)
      // console.log(imageWidth)
      db.transaction((tx)=>{
        tx.executeSql("INSERT INTO YAP (gorev, image, imageWidth, imageHeight, done) VALUES(?,?,?,?,FALSE)", [value, Base64Image, imageWidth, imageHeight], (tx, result) =>{
          setRefresh(!refresh)
          setImage(null)
          setBase64Image(null)
          setValue("")
          
        }, ()=>{
          alert("Hata, Lütfen Tekrar Deneyiniz!")
        })
      })
    }
}

const [isDeletePhoto, setisDeletePhoto] = useState(false);

const DeletePhoto = (ID) =>{
  // console.log("burada")
  // console.log(ID)
  db.transaction((tx)=>{
    tx.executeSql("UPDATE YAP SET image = ? WHERE ID = ?", [null ,ID], (tx, result)  => {
      setImageModal(null);
      setisDeletePhoto(true);
    }, ()=>{
      alert("Hata, Lütfen Tekrar Deneyiniz!")
    })
  })
}

const Done = (ID) =>{
    db.transaction((tx)=>{
        tx.executeSql("UPDATE YAP SET done = TRUE WHERE ID = ?", [ID])
    }, null, ()=>{
        setID(ID)
        setTimeout(()=>{
            setRefresh(!refresh)
        }, 1500)
    })
}

const Delete = (ID) => {
  db.transaction((tx)=>{
      tx.executeSql("DELETE FROM YAP WHERE ID = ?",[ID], null, (tx,result)=>{
          
      })
  }, null ,() => {
    toggleModal(),
    setRefresh(!refresh)
  })
}

const [updateValue, setUpdateValue] = useState("");


const Update = (ID) =>{
  db.transaction((tx)=>{
    tx.executeSql("UPDATE YAP SET gorev = ? WHERE ID = ?", [updateValue, ID], (tx, result) =>{
      
    })
  }, ()=>{
    alert("Hata! Lütfen Tekrar Deneyiniz.")
  }, ()=>{
    toggleModal()
    setRefresh(!refresh)
  })
}

const [image, setImage] = useState(null);
const [Base64Image, setBase64Image] = useState(null);

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    presentationStyle: 0
  });


  if (!result.cancelled) {
    setImage(result.uri);
    try {
    const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
    // console.log("base64:", base64)
    setBase64Image(base64);
    setimageWidth(result.width)
    setimageHeight(result.height)
  } catch(e) {
   alert("Hata, Lütfen Tekrar Deneyiniz!")
  }
    
  }
};



const [defaultValue, setDefaultValue] = useState("");
const [IDModal, setIDModal] = useState("");


const toggleModal = () => {
  setModalVisible(!isModalVisible);
};

const toggleModalImage = () =>{
  setImageModalVisible(!isImageModalVisible);
}



  return (

    <View style={{flex:1}}>
           <View style={{marginTop:20, marginLeft:20, flexDirection:"row", justifyContent:"space-between", marginRight:20}}>
           <Ionicons name='menu-outline' size={45} style={{alignSelf:"center"}} color="grey" onPress={()=>{
             navigation.openDrawer();
           }}/>
          <Text style={{fontSize:45, fontWeight:"bold"}}>Planlanan</Text>
      </View>
<View
style={{alignItems:"center", flexDirection:"row", backgroundColor:"#white", height:75, paddingVertical:10,  marginBottom:5,     borderBottomWidth:1,
borderBottomColor:"#398AB9", marginHorizontal:10}}
>

<Ionicons
name='ellipse-outline'
size={25}
style={{paddingLeft:15}}
color="grey"

/>


<TextInput
style={styles.TextInputStyle}
placeholderTextColor="grey"
placeholder='Plan Ekle'
onChangeText={(text)=> setValue(text)}
value={value}
onSubmitEditing={()=>{
  insert()
}}
/>

{image && 
<View >
<Image source={{ uri: image }} style={{ width: 40, height: 40 }} />
<Pressable 
style={{
  backgroundColor:"red", position: 'absolute', top: -4, left: -4, padding:2, borderRadius:10,
}}
onPress={()=>{
  setImage(null)
  setBase64Image(null)
}}>
<Feather 
name="x"
size={15}
color="white"
/>
</Pressable>
</View>
}


<TouchableOpacity
onPress={()=>{
  insert()
  Keyboard.dismiss()
}}
>
<Ionicons 
style={{color:"#398AB9", marginRight:5}}
name="add-circle"
size={35}
/>
</TouchableOpacity>

<Feather
name='image'
size={35}
style={{paddingLeft:15}}
color="grey"
onPress={()=>{
  pickImage()
}}

/>



</View>

    <FlatList 
    data={data}
    keyExtractor={(data)=>data.ID}
    renderItem={(element)=>
      // console.log(data)
      (

  <View style={styles.PlanBox}>

    
  {isModalVisible && 
          <View>
              <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "height" : "height"}
  style={{flex:1}}
>
          <Modal 
          onBackdropPress={() => {toggleModal(), setRefresh(!refresh) }}
          isVisible={isModalVisible}
          backdropOpacity={0.70}
          >
            <View style={{backgroundColor:"white",}}>
              <View style={{padding:10, flexDirection:"row", justifyContent:"space-between"}}>
              <Text style={{fontSize:25, fontWeight:"800"}}>Düzenleme</Text>
            
              <TouchableOpacity onPress={()=>{
              Update(IDModal)
              if(updateValue == "" && ImageModal == null){
                Delete(IDModal)
              }
            if (isDeletePhoto){
              setisDeletePhoto(false)
              toggleModal();
              setRefresh(!refresh)
            }
      }}>
  
      <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, alignSelf:"baseline", paddingHorizontal:20, }}>
              <Text style={{fontSize:25 }}>Kaydet</Text>
              </View>
              </TouchableOpacity>



              </View>
              <TextInput
              style={{borderBottomWidth:1, borderBottomColor:"blue", fontSize:20, borderRadius:20, padding:15,}}
              defaultValue={defaultValue}
              onChangeText={(text)=> setUpdateValue(text)}
              onSubmitEditing={(()=>{
                Keyboard.dismiss()
              })}
              >
              </TextInput>


              {ImageModal ?  
              <>
        <Image source={{uri: `data:image/jpeg;base64,${ImageModal}`}}  style={{height:200, width:150, borderRadius:10, marginTop:5, alignSelf:"center"}}/>
            
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>{
              DeletePhoto(IDModal)
            }}>
        <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, alignSelf:"center", paddingHorizontal:20, margin:10}}>
              <Text style={{fontSize:25 }}>Fotoğrafı Sil</Text>
              </View>
              </TouchableOpacity>
            
              <TouchableOpacity
              onPress={()=>{
                Delete(IDModal)
              }}
              >
                    <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, alignSelf:"baseline", paddingHorizontal:20, margin:10}}>
                    <Text style={{fontSize:25 }}>Planı Sil</Text>
                    </View>
                    </TouchableOpacity>

              </View>

              </>
              :
              
              <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <TouchableOpacity
              onPress={()=>{
                Delete(IDModal)
              }}
              >
                    <View style={{borderRadius:10, backgroundColor:"#47B5FF", paddingTop:5, paddingBottom:5, alignSelf:"baseline", paddingHorizontal:20, margin:10}}>
                    <Text style={{fontSize:25 }}>Planı Sil</Text>
                    </View>
                    </TouchableOpacity>
            </View>

    }


        </View>
    
          </Modal>
          </KeyboardAvoidingView>
        </View>
        }



    <TouchableOpacity
onPress={()=> Done(element.item.ID)}
>
  {ID == element.item.ID ? 
  <View style={styles.circle}>
                <AnimatedLottieView source={check}  autoPlay={true} speed={1.24} style={{width:30}} />
    </View>
  :
  <View style={styles.circle}>
            <Ionicons  
            name="ellipse-outline"
            size={25}
            color="#072227"
            />
        </View>
}
</TouchableOpacity>


        
             {/* autoPlay={true}  */}
        <View style={{flex:1}}>

<View style={{flexDirection:"row", justifyContent:"space-between", }}>
  <View style={{flex:1, justifyContent:"center"}}>
    <View>
<Text style={styles.PlanText}>
          {element.item.gorev}
        </Text>
        </View>
<TouchableOpacity
onPress={() => {
  toggleModalImage()
  setImageModal(element.item.image)
  setimageHeight(element.item.imageHeight)
  setimageWidth(element.item.imageWidth)
  setIDModal(element.item.ID)
}}
>

{isImageModalVisible && 
      <View>
          <Modal 
          onBackdropPress={toggleModalImage}
          isVisible={isImageModalVisible}
          backdropOpacity={0.70}
          >
            <View style={{justifyContent:"center", alignItems:"center", borderRadius:10, padding:10}}>
              <Text style={{fontSize:25, fontWeight:"800"}}></Text>
        <Image source={{uri: `data:image/jpeg;base64,${ImageModal}`}}  style={{height:300, width:300}}/>
            </View>
          </Modal>
        </View>
        }

{element.item.image && 
  <View style={{}}>
        <Image source={{uri: `data:image/jpeg;base64,${element.item.image}`}}  style={{height:60, width:60, borderRadius:10, marginTop:5}}/>
        </View>
    }

    </TouchableOpacity>
    </View>
    
    
  <View style={{justifyContent:"space-between",}}>
  <TouchableOpacity
onPress={()=>{toggleModal(), setDefaultValue(element.item.gorev), setIDModal(element.item.ID), setImageModal(element.item.image)}}
>
    <View style={{alignItems:"flex-end",}}>
        <Feather name="edit" size={25} />
        </View>
        </TouchableOpacity>
        
        <Text style={{color:"white", fontSize:18, }}>
  {moment(element.item.date).locale("tr", trLocale).format('ll')}
  </Text>



  </View>

  </View>

        </View>

   



  </View>
  

    )
    }
    />

    </View>
  )
}

const styles= StyleSheet.create({
  TextInputStyle:{
    padding:10,
    fontSize:20,
    flex:1,

    // paddingTop:25
  },
  PlanBox:{
    //DFF5F2
    flex:1,
    backgroundColor:"#ACE6F6",
    // opacity:2,
    padding:15,
    flexDirection:"row",
    borderRadius:10,
    marginHorizontal:10,
    marginTop:10,
    alignItems:"center",
    justifyContent:"space-between"
    
    
},
PlanText:{
    color:"#113F67",
    fontSize:20,
//    backgroundColor:"red",
    flex:1,
  
    // alignSelf:"center"
        
},
circle:{
    marginRight:10,
    alignItems:"center",
    
},
})

export default Planned