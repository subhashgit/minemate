import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TextInput, StyleSheet,
  Modal,ImageBackground,TouchableOpacity,Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { FontAwesome, MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

import SuperAlert from "react-native-super-alert";
import Header from "./component/header";

var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
var width = Dimensions.get("window").width;
var height = Dimensions.get("screen").height;
export default function AddImage({ navigation }) {
  const [image, setImage] = useState(null);
  const [type, settype] = useState(null);
  const [base, setbase] = useState(null);
  
  const [description, setdescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [postmodalVisible, setpostmodalVisible] = useState(true);
  
  const [Loading, setLoading] = useState(false);

  const [useremai, setuseremai] = useState('');
  const [username, setusername] = useState('');



  const userprofile = async() => {  
    let result = await SecureStore.getItemAsync('token');
  await userprofileinfo.UserProfie(result).then((msg) => {
    setuseremai(msg.email);
    setusername(msg.username);
    
  }).catch((msg) => {
    navigation.navigate('LoginScreen');
  })
  }
  
   userprofile();
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

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
    setLoading(true);
    fetch(BASE_URL+'createpost.php',
    {
      
      
        method: 'POST',
        body: JSON.stringify({ base:base, email: useremai, username:username, image:image,  postmessage:description  }),
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
        navigation.navigate('MyPosts');
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
<Header  navigation={navigation}/>
       <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Uploading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
         <View>
          <SuperAlert customStyle={customStyle}/> 
        </View>

    <View style={{width:'100%',alignItems:'flex-start'}}>
      
    <TouchableOpacity onPress={pickImage} style={styles.buttonStyle}>
      {image ?       <ImageBackground source={{ uri: image }} resizeMode="contain"  style={{height:100,width:'100%'}}/>: 
     
     <View><Ionicons
      size={105}
      style={{textAlign:'center'}}
      color={'#aaa'}
      name='image-outline'/>
      <Text style={{textAlign:'center',color:'#555',paddingBottom:5,fontSize:20}}> Click to Upload Image </Text>
      </View>
      }

       
      </TouchableOpacity>

      <TextInput
        label="Description"
        value={description}
        onChangeText={(text) => setdescription(text)}
        autoCapitalize="none"
        style={styles.textbox}
        multiline={true}
        numberOfLines={5}
        placeholder="Description"
        
      />
    
     
    </View>
    <TouchableOpacity onPress={UploadImage} style={styles.buttonStylepost}>
                <Text style={styles.btntxt}>Post</Text></TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
 

  buttonStyle: {
    width: '100%',
   marginTop:'auto',
    paddingVertical: 0,backgroundColor:'#fff',
  },
  buttonStylepost: {
    width: '100%',
   marginTop:'auto',
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
  textbox:{ borderColor:'#999',borderWidth:1,color:'#000',width:'100%',padding:5, },
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',justifyContent:'center'},
  radioboxStyle:{width:'44%', marginHorizontal:'1%'}, 
  spinnerTextStyle:{color:'#fff'},

})
