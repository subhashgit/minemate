import React, {useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput,RefreshControl, ImageBackground,Dimensions, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
var width = Dimensions.get('window').width; 
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
import socketIo from "socket.io-client";

let socket;
const ENDPOINT = "http://198.251.72.128:3000";
//const ENDPOINT = "http://192.168.1.2:3000";
export default function SingleChatScreen({ navigation, route }: RootTabScreenProps<'WelcomeScreen'>) {
  
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const { userid, username, groupname,user  } = route.params;
  const [state, setState] = useState();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

const [email, setemail] = useState('');
//const [user, setuser] = useState('');
const [token, settoken] = useState('');

useEffect(() => {
const userprofile = async() => {  
  let result = await SecureStore.getItemAsync('token');
await userprofileinfo.UserProfie(result).then((msg) => {
  setemail(msg.email);
  //setuser(msg.username);
  settoken(result);

}).catch((msg) => {
  navigation.navigate('LoginScreen');
})
}

 userprofile(); 

}, []);



const getData =  async() => {
    let tokent = await SecureStore.getItemAsync('token');
    let emailv = await SecureStore.getItemAsync('email');
 fetch(BASE_URL+'singlechat.php',
{
  
    method: 'POST',
    headers: new Headers({
         'Content-Type': 'application/x-www-form-urlencoded', 
}),
    body: JSON.stringify({userid:userid,senderemail:emailv, token:tokent, msgtoken:groupname })
})
  .then((response) => response.json())
  .then((response)=>{
 
    if(response.startedchat === false){  return;}
    if(response.status === false){return;}
   
   setMessages(response.message);    
  })
   
  .catch((error) => console.error(error))
  .finally(() => setLoading(false));
 
}

useEffect(() => getData(), []);



  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


  const [track, setTrack] = useState('');


  useFocusEffect(
    React.useCallback(() => {
     
      socket = socketIo.connect(ENDPOINT, { transports: ['websocket'], 'reconnection': true,  } );
      socket.on('connect', () => {
        //  alert('Connected');
          setid(socket.id);
    //      socket.emit('room', {groupname});
   
      })
    
    //  console.log(socket);
      socket.emit('joined', {user},{groupname},{userid})
    
      socket.on('welcome', (data) => {
          setMessages([...messages, data]);
         // console.log(data.user, data.message);
      })
    
      socket.on('userJoined', (data) => {
          setMessages([...messages, data]);
        //  console.log(data.user, data.message);
      })
    
      socket.on('leave', (data) => {
          setMessages([...messages, data]);
         // console.log(data.user, data.message)
      })
    
      return () =>  {
        socket.disconnect(true);
        socket.off();
  
      }
  
    }, [])
  );
  
    
  useEffect(() => {
    
    socket.on('sendprivateMessage',(data) => {
        setMessages([...messages, data]);
       // console.log(data.user, data.message, data.id,   );
    })
    return () => {
        socket.off();
    }
  }, [messages])



     const msgInput = useRef();
     const scrollViewRef = useRef();

     
const onSendPressed = async() => {
if( message == '' ){

  return;
}
fetch(BASE_URL+'sendmessagesingle.php',
{
    method: 'POST',
    body: JSON.stringify({ message:message,userid:userid,senderemail:email, senderusername:user, token:token }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  },   
})
  .then((response) => response.json())
    .then((response) => {

        
    socket.emit('privatemessage', { message, id, groupname, user, userid });
    msgInput.current.clear();setMessage(''); 
      let extojk = response.expotoken;
 sendPushNotification(extojk,user,message);
// console.log(extojk);
  })  
  .catch((error) => console.error(error))
  .finally(() => setLoading(false));

}
async function sendPushNotification(expotoken, name, messageres) {
  const semessage = {
    to: expotoken,
    sound: 'default',
    title: name+' sent you a message',
    body: 'Click to view',
    data: { someData: '' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(semessage),
  });
}


const [refreshing, setRefreshing] = React.useState(false);

const [offset, setOffset] = useState(1);
const onRefresh = React.useCallback(() => {
   setRefreshing(true);
   
  wait(2000).then(() => setRefreshing(false));
}, []);

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => 
    <AntDesign   name={'user'} size={25} color={'#000'}  onPress={()=> navigation.navigate('UserProfileScreen',{
      userid: userid,
      username:username 

    })
  }  />
    ,
  });
}, [navigation]);


const ItemView = ({item}) => {

const messageemail =  item.messageemail;
const messageid =  item.userid;
 return (

<View  style={styles.msgcommmsg}>
<View  style={[styles.listoption, messageemail == email || messageid == userid ? styles.mymsg :  styles.othermsg]}>
    <Text style={[styles.usenametex, messageemail == email || messageid == userid ? styles.mymsgname :  styles.othermsgname]} >
        {messageemail == email || messageid == userid ? <Text style={styles.namecla}>you</Text> : 
        <Text style={styles.namecla}>{item.user}</Text>}
      </Text>
    <Text style={styles.msgdatetime}>{item.msgtimedate}</Text>
    <Text style={[styles.listtxt, messageemail == email || messageid == userid ? styles.mymsgtxt :  styles.othermsgtxt]} >{item.message}</Text>
  </View>
</View>
  )};

  return (
    
    <View style={styles.image}>
    <View style={styles.container}>
    
    <ScrollView showsHorizontalScrollIndicator={false} 
     showsVerticalScrollIndicator={false} 
    style={{marginTop:0,marginBottom:0 }}
     ref={scrollViewRef}
     onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
     refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />}
    >   
    
          <View style={styles.screen}>
  
          {isLoading ? <ActivityIndicator/> : (
                <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                enableEmptySections={true}
                renderItem={ItemView}
          />
              )}
</View>
 
         </ScrollView>
         <View style={styles.viewposrtsend}>
         <TextInput
      style={{width:width-80,  borderColor: 'gray', padding:5, borderWidth: 1 }}
   onChangeText={message => setMessage(message)}
   ref={msgInput}
      placeholder={'Type Message ...'} 
    />
     <TouchableOpacity style={{textAlign:'center', color:'#fff', backgroundColor:'#000'}} activeOpacity={.8} 
        onPress={onSendPressed}  >
             <FontAwesome
            style={styles.sendbutton}
            name={'send'} color={'#fff'}
          />
                  </TouchableOpacity>
                  </View>
     </View>

    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    

  },

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
  image: {
    flex: 1,
    
  },
  imglogo:{width:120,height:120,},
  textwelcome:{fontSize:30,marginTop:50,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:10,},

  listtxt:{marginLeft:0,},
  usenametex:{width:'100%',},
  namecla:{fontSize:12},
  sendbutton:{paddingVertical:15,paddingHorizontal:20,fontSize:25},
  viewposrtsend:{flexDirection:'row',marginBottom:5,},
  msgdatetime:{position:'absolute', right:5,top:5,fontSize:9,color:'#ccc'},

  msgcommmsg:{minWidth:'90%',},
  listoption:{backgroundColor:'#fff',minWidth:'80%',maxWidth:'80%',marginVertical:1,paddingVertical:8,
  paddingHorizontal:10, borderRadius:8,paddingTop:3,},
  
  mymsg:{backgroundColor:'#000',alignSelf:'flex-end'},

  othermsg:{alignSelf:'flex-start'},
  mymsgtxt:{color:'#fff'},
  mymsgname:{color:'#fff'},
  othermsgname:{color:'#000'},
  screen:{paddingTop:2,}
});
