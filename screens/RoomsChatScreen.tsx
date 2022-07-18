import React, {useEffect, useState, useContext, useRef, useCallback  } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput,RefreshControl, ImageBackground,Dimensions, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
var width = Dimensions.get('window').width; 
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
import { useFocusEffect } from '@react-navigation/native';

import socketIo from "socket.io-client";
let socket; 
const ENDPOINT = "http://198.251.72.128:3000";
//const ENDPOINT = "http://192.168.1.2:3000";
export default function RoomsChatScreen({ navigation, route }: RootTabScreenProps<'WelcomeScreen'>) {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { groupid, groupname, user } = route.params;
  const [state, setState] = useState(true);
  const [isLoading, setLoading] = useState(true);

const [data, setData] = useState([]);

const [email, setemail] = useState('');
const [username, setusername] = useState('');



  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  
useFocusEffect(
  React.useCallback(() => {
  
    socket = socketIo.connect(ENDPOINT, { transports: ['websocket'],  } );

  
    socket.on('connect', () => {
      //  alert('Connected');
        setid(socket.id);
          })
       //   socket.emit('room', {groupname});
  //  console.log(socket);
    socket.emit('joined', {user},{groupname})
  
    socket.on('welcome', (data) => {
        setMessages([...messages, data]);
       // console.log(data.user, data.message);
    })
  
    socket.on('userJoined', (data) => {
        setMessages([...messages, data]);
       // console.log(data.user, data.message);
    })
  
    socket.on('leave', (data) => {
        setMessages([...messages, data]);
      //  console.log(data.user, data.message)
    })
  
    return () =>  {
      socket.disconnect(true);
      socket.off();

    }

  }, [])
);



useEffect(() => {
  socket.on('sendMessage',(data) => {
      setMessages([...messages, data]);
     // console.log(data.user, data.message, data.id);
  })
  return () => {
  // socket.disconnect();
    socket.off();
  }
}, [messages])



  const [track, setTrack] = useState('');

      const  fetchData = () => {
       
     fetch(BASE_URL+'roomschat.php',
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', 
    }),
        body: JSON.stringify({ groupid: groupid, groupname: groupname })
    })
      .then((response) => response.json())
       .then((json) => setMessages(json.message))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    
  }
  useEffect(() => fetchData(), []);
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => 
      <FontAwesome   name={'repeat'} size={25} color={'#000'} onPress={()=>fetchData()}  />
      ,
    });
  }, [navigation]);


const msgInput = useRef();
const scrollViewRef = useRef();


const onSendPressed = () => {
if( message == '' ){

  return;
}

fetch(BASE_URL+'sendmessage.php',
{
    method: 'POST',
    body: JSON.stringify({ message:message,groupid:groupid,email:email, username:user }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  },
   
})
  .then((response) => response.json())
    .then((response) => { 
      socket.emit('message', { message, id, groupname, user });
      msgInput.current.clear();
     // alert(groupname);
      setMessage('');
  
  })  
  .catch((error) => console.error(error))
  .finally(() => setLoading(false));

}


const [refreshing, setRefreshing] = React.useState(false);

const [offset, setOffset] = useState(1);
const onRefresh = React.useCallback(() => {
   setRefreshing(true);
  wait(2000).then(() => setRefreshing(false));
}, []);

  return (
    
    <View style={styles.image}>
    <View style={styles.container}>
    <ScrollView showsHorizontalScrollIndicator={false}   showsVerticalScrollIndicator={false}  style={{marginTop:0,marginBottom:0 }}
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
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (
              <View  style={styles.listoption}>
              <Text style={styles.usenametex}>{item.user}</Text>
              <Text style={styles.msgdatetime}>{item.msgtimedate}</Text>
              
              <Text style={styles.listtxt}>{item.message}</Text>
              
            </View>
           
           
            )}
                />
              )}
              {/*
          {messages.map((item, i) =>
   <View>  
    <Text>{item.message} </Text>
    
    </View>
    )}  
    */}
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
  listoption:{backgroundColor:'#fff',minWidth:'90%',marginVertical:5,paddingVertical:5,paddingHorizontal:5, borderRadius:8},
  listtxt:{marginLeft:0,},
  usenametex:{width:'100%',color:'#aaa',fontSize:12},
  sendbutton:{paddingVertical:15,paddingHorizontal:20,fontSize:25},
  viewposrtsend:{flexDirection:'row',marginBottom:5,},
  msgdatetime:{position:'absolute', right:5,top:5,fontSize:9,color:'#ccc'},
});
