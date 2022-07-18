import { View, Text, StyleSheet } from 'react-native'
import React, {useState} from 'react'
// import {SearchBar} from "react-native-elements"
const Search = () => {
    const [search, setSearch] = useState("");

  return (
    <View style={styles.cont}>
      {/* <SearchBar
        placeholder="Ara..."
        onChangeText={text => setSearch(text)}
        value={search}
        inputContainerStyle={styles.input}
        lightTheme={true}
        platform="ios"
        cancelButtonTitle="Vazgeç"
      /> */}
      <Text>ARA</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    cont:{
        flex:1,
    },
    input:{
        borderRadius:15,
        height:50,
        backgroundColor:"#eee"
    }
})

export default Search