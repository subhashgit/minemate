import React, {useEffect, useState, useContext } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
} from 'react-native'
import { FontAwesome,  MaterialCommunityIcons, MaterialIcons
  } from "@expo/vector-icons";
  import * as SecureStore from 'expo-secure-store';
  import SuperAlert from "react-native-super-alert";
  var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
  var userprofileinfo = require('./helpers/Authtoken.tsx');
export default function UserProfileScreen({ navigation,route }) {
  const { userid, username, useremail } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const [usernamef, setusername] = useState('');
  const [useridf, setuserid] = useState('');
  const [gander, setgander] = useState('');
  const [user, setuser] = useState('');
  const [tokent, settokent] = useState('');
  const [uemail, setuemail] = useState('');
  const [selectedValue, setSelectedValue] = useState("java");
  useEffect(() => {
    const userprofile = async() => {  
      let result = await SecureStore.getItemAsync('token');
      await userprofileinfo.UserProfie(result).then((msg) => {
      setuser(msg.username);
      setuemail(msg.email);
      
    }).catch((msg) => {
      navigation.navigate('LoginScreen');
    })
    }

     userprofile(); 
    
    }, []);

    useEffect(() => getsumuser(), []);
const getsumuser = async() =>{
    let email = await SecureStore.getItemAsync('email');
    let token = await SecureStore.getItemAsync('token');
        fetch(BASE_URL+'getuserprofile.php',
        {
            method: 'POST',
            body: JSON.stringify({email:email, token:token, uid:userid, useremail:useremail }),
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
              setgander(responseJson.message.gander);
              setusername(responseJson.message.username);
              setuserid(responseJson.message.id);

          //  console.log(responseJson.message);
             }
          })      
        }

const onChange = async(selectedValu) =>{
  if(selectedValu == ''){return;}

  let email = await SecureStore.getItemAsync('email');
  let token = await SecureStore.getItemAsync('token');
      fetch(BASE_URL+'userreport.php',
      {
          method: 'POST',
          body: JSON.stringify({email:email, token:token, reporteduid:useridf,reportreson:selectedValu   }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
         //Sending the currect offset with get request
         .then((response) => response.json())
         .then((responseJson) => { 
           if(responseJson.status!== false )
           {
         alert(responseJson.message);
           }
        
        })
    
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
      <View style={styles.container}>
        <SuperAlert customStyle={customStyle}/>
        <View style={styles.cardContainer}>
        <Text style={styles.icouser}>{usernamef.charAt(0)}</Text>
       
    
         <Text style={styles.userNameText}>{usernamef}</Text>
            <Text style={styles.userCityText}>
               ({gander})
                </Text>
        </View>

        {uemail != useremail ? 
        <TouchableOpacity onPress={()=> navigation.navigate('SingleChatScreen',{
            userid: useridf,
            username:usernamef,
            groupname:useridf, 
            user:user,
                         
          })} style={styles.logoutbtn}>
        <Text style={styles.btntxt}>Send Message</Text>
                  <MaterialCommunityIcons
                    style={styles.navicon}
                    name="chat-outline"
                    size={30}
                  />
                
                </TouchableOpacity> : null }
                {uemail != useremail ? 
            <View style={{backgroundColor:'#000',width:'90%',alignSelf:'center',alignItems:'center',paddingHorizontal:10,flexDirection:'row'}}>
           <MaterialIcons name="report" color={'#fff'} size={20}/>
                <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: '100%',color:'#fff' }}
        onValueChange={(itemValue, itemIndex) =>{ setSelectedValue(itemValue)
          onChange(itemValue);        
        }
        }
      >
        <Picker.Item label="Report user" value="" />
        <Picker.Item label="Nudity or Sexual activity" value="Nudity or Sexual activity" />
        <Picker.Item label="Hate Speech or Violence" value="Hate Speech or Violence" />
        <Picker.Item label="Scam or Fraud" value="Scam or Fraud" />
        <Picker.Item label="Sale of illegal goods" value="Sale of illegal goods" />
        <Picker.Item label="Spam" value="Spam" />
        <Picker.Item label="Hate this person" value="Hate this person" />
      </Picker>
      </View>
    : null }
      </View>
    )
  
}
const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#000',
      zIndex:99,
      paddingHorizontal:20,
      paddingVertical:50,
    },

    userCityText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userNameText: {
      color: '#fff',
      fontSize: 25,
      marginVertical:5,
      fontWeight: '600',
      textAlign: 'center',
    },
    icouser:{backgroundColor:'#000',height:200,width:200,color:'#fff',textAlign:'center',lineHeight:200,
borderRadius:220,borderWidth:5,borderColor:'#fff',fontSize:85,marginBottom:30,flexDirection:'row',alignItems:"center",alignSelf:'center'
},  navicon:{
  color: '#fff',},
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
  },
  logoutbtn:{ width: '90%',
  marginVertical: 10,
  paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
flexDirection:'row',justifyContent:'center', alignSelf:'center'
},
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight:8,
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  
  })