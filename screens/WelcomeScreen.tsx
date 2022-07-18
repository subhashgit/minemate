import React, {useEffect, useState, useContext  } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image, ActivityIndicator   } from 'react-native';
import { mobileValidator } from './helpers/mobileValidator'
import SuperAlert from "react-native-super-alert";
import { styles } from "./css/StyleCss";
import * as SecureStore from 'expo-secure-store';
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
import AuthContext from './helpers/AuthContext'
export default function WelcomeScreen({navigation}) {
  const { signIn } = useContext(AuthContext);
   const [mobile, setmobile] = useState({ value: '', error: '' })
  const [Loading, setLoading] = useState(false);
  const[mobileErrors, setmobileErrors] = useState();
  
    async function gettoken(key) {  
  let result = await SecureStore.getItemAsync(key);


  if (result) {
    setLoading(true);
    fetch(BASE_URL,
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
  
        body: JSON.stringify({ token: result, type:'checklogin'  })
    })
      .then((response) => response.json())
       .then((response) => {
          if(response.status === true) { 
            signIn({token:response.token});  
          }
          else{
            SecureStore.deleteItemAsync('token');
      }
    })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
     

  } 
}
gettoken('token');
  
  const onLoginPressed = () => {

    const mobileError = mobileValidator(mobile.value)
    if (mobileError) {
       setmobile({ ...mobile, error: mobileError })
       setmobileErrors('');
      }
       
else{
  
  setLoading(true)
      fetch(BASE_URL,
      {
          method: 'POST',
          body: JSON.stringify({  mobile:mobile.value,type:'otp' }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        .then((response) => {
          if(response.status === true )
          {
            
          console.log(response.message);
          navigation.navigate('OtpVerification',{
            mnumber: mobile.value
         });
          
          }
          else{
            setmobileErrors(response.message);
          }
        
        })  
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));

      }

  }

  const customStyle = {
    container: {
      backgroundColor: '#ffffff',
    },
    buttonConfirm: {
      backgroundColor: '#000',
    },
    title: {
      color: '#000'
    },

  }

  return (
    <ImageBackground source={require('./img/bg-patt.png')} resizeMode="repeat"  style={styles.image}>
 
    <View style={styles.container}>
             <View>
                <SuperAlert customStyle={customStyle}/> 
            </View>
            <Image source={require('../assets/images/couple-chatting.png')}
  style={styles.imglogo} 
/>
<Text style={styles.mobiletxt}>Enter Your Mobile Number</Text>
      <TextInput
        label="Number"
        returnKeyType="done"
        value={mobile.value}
        keyboardType='numeric'
        onChangeText={(text) => setmobile({ value: text, error: '' })}
        error={!!mobile.error}
        errorText={mobile.error}
        style={styles.textbox}
        placeholder="Number"
      />
      <Text  style={{color:'red'}}>{mobile.error}{mobileErrors}</Text>

      <TouchableOpacity
        onPress={onLoginPressed}
        style={styles.buttonStyle}>
        <Text style={styles.btntxt}>Continue</Text>
        </TouchableOpacity>
    </View>
    {Loading ? 
    <View style={[styles.containeroverlay, styles.horizontaloverlay]}>
        <ActivityIndicator size="large"  />
  </View>
  : null}
    </ImageBackground>
    
  );
}
