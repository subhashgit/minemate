import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, ScrollView, TextInput, StyleSheet,ActivityIndicator,
  Modal,ImageBackground,TouchableOpacity,Text, Dimensions, BackHandler, Alert  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { nameValidator } from './helpers/nameValidator';
import { emailValidator } from './helpers/emailValidator';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import { CountryCode, Country } from './src/types'
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var width = Dimensions.get("window").width;
var height = Dimensions.get("screen").height;
export default function ProfileScreen({ navigation }) {
  useEffect(() => {
    const backAction = () => {
        BackHandler.removeEventListener() 
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

  }, []);

  const [date, setDate] = useState(new Date());

  const onChange = (event, date) => {
    const currentDate = date;
    setDate(currentDate);
  };

  const showMode = (currentMode, maximumDate ) => {
    DateTimePickerAndroid.open({

      value: date,
      maximumDate :new Date(),
      onChange,
      mode: currentMode,
    })
  };

  const showDatepicker = () => {
    showMode('date');
  };

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
  const [image, setImage] = useState(null);
  const [base, setbase] = useState(null);
  const [description, setdescription] = useState('');
  const [selectedGender, setselectedGender] = useState();
  const [faith, setfaith] = useState();
  const [meritalStatus, setmeritalStatus] = useState();
  const [height, seheight] = useState();
  const [Loading, setLoading] = useState(false);
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' })
  const [ErrorMessage, setErrorMessage] = useState();
 
  

  const pickImage = async () => {
    let resultt = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64:true,
      quality: 1,
    });

    if (!resultt.cancelled) {
      setImage(resultt.uri);
      setbase(resultt.base64);
     
    }
  };

  const UploadImage = async () => {
    const emailError = emailValidator(email.value)

    if(image == '' || name.value == '' || email.value == '' || selectedGender == null || faith == null  || meritalStatus == null || country == null   ){
      setErrorMessage('All Fields are required*');
      return false;
    }
    else if(emailError){
      setErrorMessage('Invalid email');

      return false;
    }
    setLoading(true);
    setErrorMessage('');
    const token = await SecureStore.getItemAsync('token');
    fetch(BASE_URL,
    {
      
        method: 'POST',
        body: JSON.stringify({ base:base, name:name.value,  email:email.value,dob:date.toLocaleDateString(),selectedGender:selectedGender,faith:faith,meritalStatus:meritalStatus,country:country.name, type:"saveprofile", token:token  }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
       
    })
      .then((response) => response.json())
      
      .then((response) => {
        setImage('');
        setbase('');
    
        navigation.navigate('Root');
      })  
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }

  return (

<View  style={styles.container}>
<ScrollView showsHorizontalScrollIndicator={false}   showsVerticalScrollIndicator={false}>
        
        <Text style={styles.mobiletxt}>Profile Info</Text>
    <View style={{width:'100%',alignItems:'flex-start'}}>
      
    <TouchableOpacity onPress={pickImage} style={styles.buttonStyleig}>
      {image ?       <ImageBackground source={{ uri: image }} resizeMode="cover"  style={{height:140,width:'100%',padding:0,margin:0}}/>: 
     
     <View><Ionicons
      size={105}
      style={{textAlign:'center'}}
      color={'#fff'}
      name='image-outline'/>
      <Text style={{textAlign:'center',color:'#fff',paddingBottom:5,fontSize:20}}> Click to Upload Image </Text>
      </View>
      }

       
      </TouchableOpacity>
      {ErrorMessage ?
        <Text style={styles.errormsg}>{ErrorMessage}</Text>
      :null}
      </View>
          <TextInput
                label="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
                style={styles.textbox}
                placeholder='Name'
              />

            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                style={styles.textbox}
                placeholder='Email'
              />

    
    <Picker
    style={styles.textbox}
  selectedValue={selectedGender}
  onValueChange={(itemValue, itemIndex) =>
    setselectedGender(itemValue)
  }>
    <Picker.Item label="Choose Gender"  value="" />
    <Picker.Item label="Male" value="male" />
  <Picker.Item label="Female" value="female" />
</Picker>
            
<View>
        <TouchableOpacity onPress={showDatepicker}  style={[styles.textbox,styles.textbodate]}>
        <Text style={{fontSize:12}}>Date of Birth (mm/dd/yyyy)</Text> 
          <Text style={{fontSize:18}}> {date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        
    </View>

    <Picker
    style={styles.textbox}
  selectedValue={meritalStatus}
  onValueChange={(itemValue, itemIndex) =>
    setmeritalStatus(itemValue)
  }>

    <Picker.Item label="Status"  value='' />
    <Picker.Item label="Single" value="single" />
    <Picker.Item label="Married" value="married" />
  <Picker.Item label="Divorced" value="divorced" />
  <Picker.Item label="Widowed" value="widowed" />
</Picker>
            
<Picker
    style={styles.textbox}
  selectedValue={faith}
  onValueChange={(itemValue, itemIndex) =>
    setfaith(itemValue)
  }>
    <Picker.Item label="Your Faith"  value="" />
    <Picker.Item label="Hindu" value="hindu" />
    <Picker.Item label="Sikh" value="sikh" />
  <Picker.Item label="Spiritual" value="spiritual" />
  <Picker.Item label="Muslim" value="muslim" />
  <Picker.Item label="Atheist" value="atheist" />
  <Picker.Item label="Buddhist" value="buddhist" />
  <Picker.Item label="Parsi" value="parsi" />
  <Picker.Item label="jain" value="jain" />
  <Picker.Item label="Other" value="other" />
</Picker>

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
      <Text  style={styles.errormsg}>{CountryError}</Text>
      </View>
    <TouchableOpacity onPress={UploadImage} style={styles.buttonStyle}>
                <Text style={styles.btntxt}>Save</Text></TouchableOpacity>
                </ScrollView>
                {Loading ? 
    <View style={[styles.containeroverlay, styles.horizontaloverlay]}>
        <ActivityIndicator size="large"  />
  </View>
  : null}
    </View>
  );
}


const styles = StyleSheet.create({
 
  container: {padding:15,marginTop:0,paddingTop:50},
    headerBackgroundImage: {paddingTop: 50,    },
    mobiletxt:{fontSize:35,fontWeight:'900',color:'#d62d56', marginBottom:10,textAlign:'left'},
    buttonStyle: {width: '100%',marginVertical: 10,paddingVertical: 15,borderWidth:2,borderColor:'#d62d56',      backgroundColor:'#d62d56',},
    btntxt: {fontWeight: 'bold',fontSize: 20,color:'#fff',lineHeight: 22,textAlign:'center',},
    textbox:{ marginBottom:5,
    color:'#000',width:'100%',fontSize:18, paddingVertical:10,
  backgroundColor:'#fff',paddingHorizontal:5, letterSpacing:3},
  textbodate:{paddingTop:2,},
 buttonStyleig:{backgroundColor:'#000',width:'100%',marginBottom:15,},
 selectCountry:{display:'flex',alignItems:'center',backgroundColor:'#fff',width:'100%',textAlign:'left',
 fontSize:22,flexDirection:'row',marginBottom:10,paddingVertical:15,},
 datatext:{fontSize:22,},
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
 errormsg:{marginBottom:10,padding:0,color:'red',fontSize:16, fontWeight:'600'}

})
