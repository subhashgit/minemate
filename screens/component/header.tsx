import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from '../helpers/AuthContext'
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
var BASE_URL = require('../helpers/ApiBaseUrl.tsx');
import Drawer from './drawer';

import {
  PublisherBanner,
} from 'expo-ads-admob';
import LoginScreen from "../LoginScreen";
export default  function Header({ navigation }) {

const [userinfo, setuserinfo] = useState([]);
const [firstnamelaller, setfirstnamelaller] = useState([]);



 const accountpage = () => {
  navigation.navigate("ProfileScreen");
};

const [modalVisible, setModalVisible] = useState(false);
  return (
      <View style={styles.containerwrapper}>
<View  style={styles.containerwrapperinr}>
      <View style={styles.headicons}>
          <TouchableOpacity  onPress={() => {
                setModalVisible(!modalVisible);
              }}> 
          <MaterialCommunityIcons  size={25}
            color={'#fff'}
            name='menu'/>
          </TouchableOpacity>
      </View>
      
        <View style={styles.headiconsflend}>    
        <TouchableOpacity  onPress={() => navigation.navigate('Notification')}>
          <Text style={styles.iconsheader}>
            <MaterialIcons
            size={25}
            color={'#fff'}
            name='notifications-none'/>
            </Text> 
          </TouchableOpacity>
      
         
        </View>

 </View>
 <PublisherBanner
 style={{left:0,position:'relative',width:'100%'}}
  bannerSize="fullBanner"
  adUnitID="ca-app-pub-3185366657620430/1873326666" // Test ID, Replace with your-admob-unit-id
  servePersonalizedAds // true or false
   />   
  {
 <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
   }
      </View>
 
  
  );
}

const styles = StyleSheet.create({
  container: {
   padding:15,
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

  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  image: { flex: 1,
  },
  imglogo:{width:120,height:21,},
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5,paddingVertical:10,paddingHorizontal:20, flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'flex-start'},
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:0,backgroundColor:'#d62d56',paddingHorizontal:0,},
  headicons:{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',},
  headiconsflend:{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',},
  containerwrapperinr:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10,paddingHorizontal:15,paddingTop:5},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},


});
