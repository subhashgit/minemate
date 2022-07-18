import React, {useEffect, useState, useContext  } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image, AsyncStorage  } from 'react-native';
import { mobileValidator } from './helpers/mobileValidator'
import SuperAlert from "react-native-super-alert";
   import { styles } from "./css/StyleCss";
   import * as SecureStore from 'expo-secure-store';

var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
import AuthContext from './helpers/AuthContext'
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import { CountryCode, Country } from './src/types'
export default function WelcomeScreen({navigation}) {
  let mobileid = await SecureStore.getItemAsync('mobile');
  let token = await SecureStore.getItemAsync('token');
  alert(token);
  const { signIn } = useContext(AuthContext);
   const [mobile, setmobile] = useState({ value: '', error: '' })
  const [Loading, setLoading] = useState(false);
  const [CountryError, setCountryError] = useState();
  
  /** country code start */

  const [countryCode, setCountryCode] = useState<CountryCode>(null)
  const [country, setCountry] = useState<Country>(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(
    false,
  )
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(true)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
    setCountryError('')
  }

/**Country code end */
  const onLoginPressed = () => {

    const mobileError = mobileValidator(mobile.value)
    if(country === null){
      setCountryError('Please select Country');
    }
   else if (mobileError) {
       setmobile({ ...mobile, error: mobileError })
      }
       
else{
  
  setLoading(true)
      fetch(BASE_URL,
      {
          method: 'POST',
          body: JSON.stringify({  mobile:mobile.value,cdcode:country.callingCode[0],cname:country.name,type:'otp' }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        .then((response) => {
          if(response.status == true )
          {
          console.log(response.message);
          navigation.navigate('otpVerification',{
            mnumber: mobile.value,
         });
          
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
 <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
    <View style={styles.container}>
             <View>
                <SuperAlert customStyle={customStyle}/> 
            </View>
            <Image source={require('../assets/images/couple-chatting.png')}
  style={styles.imglogo} 
/>


  <Text style={styles.mobiletxt}>Enter Your Mobile Number</Text>
  <View style={styles.selectCountry}>
  <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
        
      />
        {country !== null && (  <View style={{flexDirection:'row'}}>     
       <Text style={styles.datatext}>+{country.callingCode} </Text>        
        <Text style={styles.datatext}>{country.name}</Text>

        </View>
      )}
      <Text  style={{color:'red'}}>{CountryError}</Text>
      </View>
      <TextInput
        label="Mobile"
        returnKeyType="done"
        value={mobile.value}
        keyboardType='numeric'
        onChangeText={(text) => setmobile({ value: text, error: '' })}
        error={!!mobile.error}
        errorText={mobile.error}
        style={styles.textbox}
        placeholder="Moblie"
      />
      <Text  style={{color:'red'}}>{mobile.error}</Text>

      <TouchableOpacity
        onPress={onLoginPressed}
        style={styles.buttonStyle}>
        <Text style={styles.btntxt}>Continue</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}
