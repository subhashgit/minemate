import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./component/drawer";
import Header from "./component/header";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');

export default  function ChatList({ navigation }) {
  const [user, setuser] = useState('');
  const [tokent, settokent] = useState('');
  const [uemail, setuemail] = useState('');
  
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

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {  
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const [cemail, setcemail] = useState('');
  const [loading, setLoading] = useState(true);
  const [truev, settruev] = useState('');
  const [nomessage, setnomessage] = useState('');
  
  
  const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);

useEffect(() => {
const unsubscribe = navigation.addListener('focus', () => {
  getData()

});

// Return the function to unsubscribe from the event so it gets removed on unmount
return unsubscribe;
}, [navigation]);


const getData = async ()=> {
  let email = await SecureStore.getItemAsync('email');
  let token = await SecureStore.getItemAsync('token');
  setcemail(email);
  settokent(token);

  fetch(BASE_URL+'chatlist.php?page=',
  {
      method: 'POST',
      body: JSON.stringify({email:email, token:token}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
     
  })
     //Sending the currect offset with get request
     .then((response) => response.json())
     .then((responseJson) => {
     //  console.log(responseJson.message);
       if(responseJson.message === null){setLoading(false);  return;}
       if(responseJson.status === null){ setnomessage(responseJson.message); return;}
     //  setOffset(offset + 1);
     setnomessage('')
       setDataSource(responseJson.message);
       setLoading(false);
     
     })
     .catch((error) => {
       console.error(error);
     }); 


}
  


  const [modalVisible, setModalVisible] = useState(false);

  const ItemView = ({item}) => {
    const emailpo = item.useremail;
    const status = item.status;
    const msgemail = item.msgemail;
    return (
<View style={{width:'100%'}}>
      <TouchableOpacity   activeOpacity={.8} onPress={()=> navigation.navigate('SingleChatScreen',{
        userid: item.userid,
        username:item.username,
        groupname:item.chatid,
        user:user        
      })}>
        <View style={[styles.listoption, emailpo == cemail ? styles.noneconta : null,  status == 'unread' && msgemail != cemail ? styles.unreadmsg : null]}>    
        {status == 'unread' && msgemail != cemail ?   
        <Text style={{position:"absolute",right:5,top:5,fontSize:10,color:'green'}}>New Message</Text> : status == 'unread' && msgemail == cemail ?   
        <Text    style={{position:"absolute",right:5,top:5,fontSize:10,}}>Unseen</Text> : 
        <Text    style={{position:"absolute",right:5,top:5,fontSize:10,}}>Seen</Text>
        }   
              <View style={{flexDirection:'row'}}>
              <Text style={styles.icouser}>{item.username.charAt(0)}</Text>    
              <Text style={[styles.listtxt, status == 'unread' && msgemail != cemail ? styles.unreadmsgnm : null]}>{item.username}<Text style={{fontSize:12}}>{"\n"}{item.message}</Text></Text>
              </View>
          </View>
          </TouchableOpacity>

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
    {nomessage ? <Text style={{textAlign:'center',marginTop:5,}}>{nomessage}</Text> : null}
    <View style={styles.tabs}>
      <TouchableOpacity onPress={()=> navigation.navigate('RoomsList')}  style={styles.tab}>
        <Text  style={{textAlign:'center',color:'#fff'}}>Chat Rooms</Text>
      </TouchableOpacity>
    </View>
      
    <View style={styles.container}>
    <ScrollView 
          style={{marginBottom:165}}
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
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
  listtxt:{marginLeft:10,fontSize:22,marginTop:0,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},
icouser:{backgroundColor:'#000',height:35,width:35,color:'#fff',textAlign:'center',lineHeight:32,
borderRadius:50,marginRight:5,fontSize:22,
},
buttoncontainer:{flexDirection:'row',marginVertical:'5%',},
vsprof:{backgroundColor:'#000',color:'#fff',textAlign:'center',width:'46%',
paddingVertical:8,marginHorizontal:5,},
noneconta:{display:'none'},
tabs:{position:'absolute',bottom:0, alignSelf:'center',width:'100%',borderTopColor:'#fff',borderTopWidth:1,zIndex:999,
borderBottomColor:'#fff',borderBottomWidth:1},
tab:{backgroundColor:'#000',width:'100%',textAlign:"center",paddingHorizontal:20,paddingVertical:15,},
unreadmsg:{backgroundColor:'#fefefe',borderBottomWidth:2,borderBottomColor:'green'},
unreadmsgnm:{fontWeight:'bold'}
});


