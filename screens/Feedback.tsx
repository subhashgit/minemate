import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TextInput, StyleSheet, ImageBackground,TouchableOpacity,Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

import SuperAlert from "react-native-super-alert";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
var width = Dimensions.get("window").width;
var height = Dimensions.get("screen").height;
export default function Feedback({ navigation }) {
  
  const [description, setdescription] = useState('');
  
  const [Loading, setLoading] = useState(false);

  const [useremai, setuseremai] = useState('');
  const [username, setusername] = useState('');
  const [token, settoken] = useState('');


  const userprofile = async() => {  
    let result = await SecureStore.getItemAsync('token');
    settoken(result);
  await userprofileinfo.UserProfie(result).then((msg) => {
    setuseremai(msg.email);
    setusername(msg.username);
    
  }).catch((msg) => {
    navigation.navigate('LoginScreen');
  })
  }
  
   userprofile();
 

const UploadImage = async () => {
    setLoading(true);
    fetch(BASE_URL+'feedback.php',
    {
      
        method: 'POST',
        body: JSON.stringify({  email: useremai, message:description, username:username, token:token  }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
       
    })
      .then((response) => response.json())
      
      .then((response) => {
        setdescription('');
        setImage('');
        setbase('');
        alert(response.message);
      })  
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }

  const customStyle = {
   
    buttonConfirm: {
      backgroundColor: '#000',
    },
    title: {
      color: '#000'
    },

  }
  return (
    <View  style={styles.container}>
       <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Sending...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
         <View>
          <SuperAlert customStyle={customStyle}/> 
        </View>

    <View style={{width:'100%',alignItems:'flex-start'}}>


      <TextInput
        label="Description"
        value={description}
        onChangeText={(text) => setdescription(text)}
        autoCapitalize="none"
        style={styles.textbox}
        multiline={true}
        numberOfLines={10}
        placeholder="Description"
        
      />
    
     
    </View>
    <TouchableOpacity onPress={UploadImage} style={styles.buttonStylepost}>
                <Text style={styles.btntxt}>Post</Text></TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
 
   container: {
    flex: 1,
    alignItems: 'flex-start',
    width:'100%',
  },
  buttonStyle: {
    width: '100%',
   marginTop:'auto',
    paddingVertical: 15,backgroundColor:'#fff',
  },
  buttonStylepost: {
    width: '100%',
   marginTop:'auto',position:'absolute',bottom:0,
    paddingVertical: 15,backgroundColor:'#000',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    width:'100%',
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  textbox:{ borderColor:'#999',borderWidth:1,color:'#000',width:'100%',padding:15, },
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',justifyContent:'center'},
  radioboxStyle:{width:'44%', marginHorizontal:'1%'}, 
  spinnerTextStyle:{color:'#fff'},

})
