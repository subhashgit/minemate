import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./component/drawer";
import Header from "./component/header";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
export default  function UsersList({ navigation }) {

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const [cemail, setcemail] = useState('');
  const [loading, setLoading] = useState(true);
  const [truev, settruev] = useState('');
  const [user, setuser] = useState('');
  const [emailv, setemailv] = useState('');
  const [tokent, settokent] = useState('');

  useEffect(() => {
    const userprofile = async() => {  
      let result = await SecureStore.getItemAsync('token');
      await userprofileinfo.UserProfie(result).then((msg) => {
      setuser(msg.username);
    
    }).catch((msg) => {
      navigation.navigate('LoginScreen');
    })
    }
    
     userprofile(); 
    
    }, []);
  
  const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);

useEffect(() => getData(), []);

const getData = async ()=> {
  let email = await SecureStore.getItemAsync('email');
  let token = await SecureStore.getItemAsync('token');
setcemail(email);
  fetch(BASE_URL+'userslist.php?page='+ offset,
  {
      method: 'POST',
      body: JSON.stringify({email: email, token:token}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
     
  })
     //Sending the currect offset with get request
     .then((response) => response.json())
     .then((responseJson) => {

       if(responseJson.message === null){setLoading(false); return;}
       setOffset(offset + 1);
       setDataSource([...dataSource, ...responseJson.message]);
       setLoading(false);
     
     })
     .catch((error) => {
       console.error(error);
     }); 


}
  


  const [modalVisible, setModalVisible] = useState(false);

  const ItemView = ({item}) => {
    const email = item.email;

    return (

     
              <View  style={[styles.listoption, email == cemail ? styles.noneconta : null]}>  
         
              <View style={{flexDirection:'row'}}>
              <Text style={styles.icouser}>{item.username.charAt(0)}</Text>         
              <Text style={styles.listtxt}>{item.username}<Text style={{fontSize:12}}>{"\n"}({item.gander})</Text></Text>
              </View>
        <View style={styles.buttoncontainer}>
              <TouchableOpacity style={styles.vsprof} activeOpacity={.8} onPress={()=> navigation.navigate('UserProfileScreen',{
            userid: item.id,
            username: item.username,
            gander: item.gander,
            user:user,
            tokent:tokent,
            emailv:emailv,
            groupname:item.chatid             
          })}><Text style={{color:'#fff',textAlign:"center"}}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.vsprof} activeOpacity={.8} onPress={()=> navigation.navigate('SingleChatScreen',{
            userid: item.id,
            username:item.username,          
          })}><Text  style={{color:'#fff',textAlign:"center"}}>Send Message</Text>
          </TouchableOpacity>
            </View>
           
          </View>
        
            )};
  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
       
          {loading ? (
            <ActivityIndicator
              color="black"
              style={{marginLeft: 8}} />
          ) : null}
       
      </View>
    );
  };
  return (
  
    <View style={styles.image}>
    
    <Header  navigation={navigation}/>
    <View style={styles.tabs}>
      <TouchableOpacity onPress={()=> navigation.navigate('RoomsList')}  style={styles.tab}>
        <Text  style={{textAlign:'center',color:'#fff'}}>Chat Rooms</Text>
      </TouchableOpacity>
    </View>
      
    <View style={styles.container}>
    <ScrollView 
          style={{marginBottom:175}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}  
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              getData();
            }
          }}
          scrollEventThrottle={400}
          
          
    >
    <SafeAreaView style={{marginTop:0,marginBottom:0 }}>   
   
          <View style={styles.screen}>
    {loading ? <ActivityIndicator/> : (
                <FlatList
                data={dataSource}
                keyExtractor={(item, index) => index.toString()}
                enableEmptySections={true}
                renderItem={ItemView}
                ListFooterComponent={renderFooter}
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
  },
  listtxt:{marginLeft:10,fontSize:22,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},
icouser:{backgroundColor:'#000',height:50,width:50,color:'#fff',textAlign:'center',lineHeight:50,
borderRadius:50,marginRight:5,fontSize:22,
},
buttoncontainer:{flexDirection:'row',marginVertical:'5%',},
vsprof:{backgroundColor:'#000',color:'#fff',textAlign:'center',width:'46%',
paddingVertical:8,marginHorizontal:5,},
noneconta:{display:'none'},
tabs:{position:'absolute',bottom:0, alignSelf:'center',width:'100%',borderTopColor:'#fff',borderTopWidth:1,zIndex:999,
borderBottomColor:'#fff',borderBottomWidth:1},
tab:{backgroundColor:'#000',width:'100%',textAlign:"center",paddingHorizontal:20,paddingVertical:15,},
});


