import React, {useEffect, useState, useContext  } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image, ActivityIndicator  } from 'react-native';
import { mobileValidator } from './helpers/mobileValidator'
import SuperAlert from "react-native-super-alert";
   import { styles } from "./css/StyleCss";

var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
import AuthContext from './helpers/AuthContext'

export default function OtpVerification({navigation, route}) {
    const { mnumber  } = route.params;
  const { signIn } = useContext(AuthContext);
   const [mobile, setmobile] = useState({ value: '', error: '' })
  const [Loading, setLoading] = useState(false);

  const onLoginPressed = () => {
    const mobileError = mobileValidator(mobile.value)
   if (mobileError) {
       setmobile({ ...mobile, error: mobileError })
      }
       
else{
  
  setLoading(true)
      fetch(BASE_URL,
      {
          method: 'POST',
          body: JSON.stringify({ mobile:mnumber, otp:mobile.value,type:'otpverification' }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        
        .then((response) => {
          if(response.status === true )
          {
           // console.log(response.message);
          signIn({token:response.token});

              //navigation.navigate('Root');
          
          }
          else{
            alert(response.message);
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


  <Text style={styles.mobiletxt}>Enter Otp</Text>

      <TextInput
        label="Otp"
        returnKeyType="done"
        value={mobile.value}
        keyboardType='numeric'
        onChangeText={(text) => setmobile({ value: text, error: '' })}
        error={!!mobile.error}
        errorText={mobile.error}
        style={styles.textbox}
        placeholder="Otp"
      />
      <Text  style={{color:'red'}}>{mobile.error}</Text>

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
