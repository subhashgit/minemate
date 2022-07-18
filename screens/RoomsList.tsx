import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
var userprofileinfo = require('./helpers/Authtoken.tsx');
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default  function RoomsList({ navigation }) {

  const [isLoading, setLoading] = useState(true);
const [data, setData] = useState([]);
const [user, setuser] = useState('');
useEffect(()=>{
  const userprofile = async() => {  
  let result = await SecureStore.getItemAsync('token');
  await userprofileinfo.UserProfie(result).then((msg) => {
    setuser(msg.username);
  }).catch((msg) => {
    navigation.navigate('LoginScreen');
  })
  }
  userprofile();
  },[]);

useEffect(() => {
  fetch(BASE_URL+'groups.php')
    .then((response) => response.json())
    //.then((response) => {console.log(response.message)})
    .then((json) => setData(json.message))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
}, []);

  const [modalVisible, setModalVisible] = useState(false);

  return (
  
    <View style={styles.image}>
    
   
   
      
    <View style={styles.container}>
    <ScrollView 
          style={{marginBottom:0}}
          
    >
    <SafeAreaView style={{marginTop:0,marginBottom:0 }}>   
   
          <View style={styles.screen}>
    {isLoading ? <ActivityIndicator/> : (
                <FlatList
                  data={data}
                  
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (

           
               <TouchableOpacity activeOpacity={.8} onPress={()=> navigation.navigate('RoomsChatScreen',{
            groupid: item.id,
            groupname: item.groupname,
            user:user
          })}>
               
              <View  style={styles.listoption}>
              <FontAwesome
            style={[styles.listimg, {fontSize: 30, paddingTop: 10 }]}
            name={item.icon}
          />
              
              <Text style={styles.listtxt}>{item.groupname}</Text>
              
            </View>
            </TouchableOpacity>
           
            )}
                />
              )}


</View>
         
         </SafeAreaView>
         </ScrollView>
     </View>
     
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
   padding:15,paddingTop:0,
  },
  screen:{width:'100%',marginTop:0},
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  image: { flex: 1,
  },
  imglogo:{width:120,height:120,},
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5,paddingVertical:10,paddingHorizontal:20, flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'flex-start'},
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},

});


