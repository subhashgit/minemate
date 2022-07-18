import React, {useEffect, useState, useContext, useRef } from "react";
import Constants from 'expo-constants';
import { StyleSheet, Button,RefreshControl,Share,Platform,  View,Dimensions,Linking,Alert,PermissionsAndroid, Text,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView, Image } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

import Header from "./component/header";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var width = Dimensions.get('window').width; 
var height = Dimensions.get('screen').height; 
export default  function DashboardScreen({ navigation }) {
const [loading, setLoading] = useState(false);
const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);
const [location, setLocation] = useState(null);
const [Token, setToken] = useState(null);
const [UserData, SetUserData] = useState([]);

  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let token = await SecureStore.getItemAsync('token');
      setToken(token);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    fetch(BASE_URL,
      {
          method: 'POST',
          body: JSON.stringify({ token:Token,location:text,type:'nearbylocation' }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
      //Sending the currect offset with get request
      .then((response) => response.json())
      .then((response) => {
        if(response.status === true)
        {
         // console.log(response.message);
           setLoading(false); return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }




  useEffect(() => getsumuser(), []);
  const getsumuser = async() =>{
      let tokenn = await SecureStore.getItemAsync('token');
          fetch(BASE_URL,
          {
              method: 'POST',
              body: JSON.stringify({ token:tokenn, type:'homecards' }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
             
          })
             //Sending the currect offset with get request
             .then((response) => response.json())
             .then((responseJson) => { 
               if(responseJson.status !== false )
               {
                SetUserData(responseJson.message);
            //console.log(responseJson.message);
               }
               
            })      
          }

/*** */



    return (
    <View  style={styles.container}>
    <Header  navigation={navigation} setprofiledata={true}/>
    <ScrollView showsHorizontalScrollIndicator={false}   showsVerticalScrollIndicator={false}>
    <View style={styles.screen}>
    <Text style={styles.name}>{UserData.name} <Text style={styles.myage}>({UserData.age})</Text></Text>
    <Image source={{uri: UserData.img}}
   style={styles.profilepic} 
/>
    



    </View>
  </ScrollView>
  
  {loading ? 
    <View style={[styles.containeroverlay, styles.horizontaloverlay]}>
        <ActivityIndicator size="large"  />
  </View>
  : null}
  
    </View>    

  );
    }


const styles = StyleSheet.create({
  container: {
   padding:0,
  },
  screen:{width:'100%',marginTop:0,padding:20},
  containeroverlay: {
    flex: 1,
    justifyContent: "center",    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: width,height:height,zIndex:9999,
  },
  horizontaloverlay: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  buttonStyle: {width: '100%',marginVertical: 10,paddingVertical: 15,borderWidth:2,borderColor:'#d62d56',      backgroundColor:'#d62d56',},
    btntxt: {fontWeight: 'bold',fontSize: 20,color:'#fff',lineHeight: 22,textAlign:'center',},
    profilepic:{width:'100%',height:450,resizeMode:'contain',borderRadius:20},
    name:{fontSize:32,color:'#333',fontWeight:'500',marginBottom:10},
    myage:{fontSize:20}
});
