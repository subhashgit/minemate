import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button,RefreshControl,Share, View,Dimensions,Linking,Alert,PermissionsAndroid, Text,TextInput, ImageBackground,Clipboard, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView, Image } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./component/drawer";
import Header from "./component/header";
import SuperAlert from "react-native-super-alert";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default  function Likes({ navigation }) {
  

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  var width = Dimensions.get('window').width; 

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const [state, setState] = useState();

const [loading, setLoading] = useState(true);
const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);
const [data, setData] = useState([]);
const [useremail, setuseremail] = useState('');

const [textto, settextto] = useState('');



useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    getData()
  
  });
  
  // Return the function to unsubscribe from the event so it gets removed on unmount
  return unsubscribe;
  }, [navigation]);

const getData = async ()=> {
  let useremail = await SecureStore.getItemAsync('email');
  let token = await SecureStore.getItemAsync('token');
  setuseremail(useremail);
  setLoading(true);
  fetch(BASE_URL+'myposts.php?page='+ offset,
  
  {
    method: 'POST',
    body: JSON.stringify({ email: useremail, token:token }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  },
   
  })
  
    //Sending the currect offset with get request
    .then((response) => response.json())
    .then((responseJson) => {
      //Successful response
      if(responseJson.poststatus === false){setLoading(false); settextto(responseJson.message); return;}
      else if(responseJson.Status === false){setLoading(false); settextto(''); return;}
      setOffset(offset + 1);
      settextto(''); 
      //Increasing the offset for the next API call
      setDataSource([...dataSource, ...responseJson.message]);
      setLoading(false);
    
    })
    .catch((error) => {
      console.error(error);
    }); 
};
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


const deletepost = async (key) => {
 
  Alert.alert(
    "You realy want to delete post",
    "Confirm",
    [
      {
        text: "Cancel",
        onPress: () => {return},
        style: "cancel"
      },
      { text: "Yes", style: "Yes", onPress: () =>   deletepostconfirm(key) 
    }
    ]
  );
}
const deletepostconfirm = async (key) => {
  let useremail = await SecureStore.getItemAsync('email');
  setLoading(true);
  fetch(BASE_URL+'deletepost.php',
  {
    method: 'POST',
    body: JSON.stringify({ email: useremail, postid:key }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  },
   
  })
  
    //Sending the currect offset with get request
    .then((response) => response.json())
    .then((responseJson) => {
      //Successful response
    
      if(responseJson.message === true){
       alert('deleted');
       getData();

      }
      else{alert(responseJson.message)}
    
      setDataSource([...dataSource, ...responseJson.message]);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
    }); 
};


 const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

     setRefreshing(true);
     setOffset(1);
     getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const sharetext = '';
  const onShare = async (sharetext) => {
      const result = await Share.share({
        message: sharetext,
      });
  };
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
 const ItemView = ({item}) => {
    return (
       <View  style={styles.postlist}>
          <View style={styles.namedes}>
          <Text style={styles.icouser}>{item.username.charAt(0)}</Text>
            <Text  style={{color:'#000'}}>{item.username}</Text>
          </View>
          {item.url ?  <View style={styles.itemv+item.id}>
            <Image source={{  uri: item.url,}}  width={width}  /> 
            <View style={styles.underpostfooter}>
            {item.postmessage ? <Text style={{ fontSize: 15, fontWeight:'900' }}>{item.postmessage}</Text>: null}
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  
                   
                     <TouchableOpacity    activeOpacity={0.1}  
                      onPress={() => deletepost(item.id)}>
                                    <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                      name="trash-o"
                                    />
                    </TouchableOpacity>
                </View>
                </View>
          </View> : 
             <View style={[styles.viewsinglepost,  styles.itemv+item.id]}>
                        <Text style={styles.postmessagesingle}>{item.postmessage}</Text>
                        <View style={styles.underpostfooter}>
                              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                  
                              <TouchableOpacity activeOpacity={0.7}       onPress={() => {onShare(item.postmessage)}}>
                              <FontAwesome
                                    style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                    name="send-o"
                                  />
                                    </TouchableOpacity>
                                    <TouchableOpacity    activeOpacity={0.1}  
                      onPress={() => Clipboard.setString(item.postmessage) }>
                                    <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                      name="copy"
                                    />
                                    </TouchableOpacity>
                                    <TouchableOpacity    activeOpacity={0.1}  
                      onPress={() => deletepost(item.id)}>
                                    <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                      name="trash-o"
                                    />
                                    </TouchableOpacity>
                                </View>
                            </View>
              
              <View>
                   
                  </View>

                </View>
                 }
                
              </View>
     
    );
  };

  return (
 
    <View>
   <SuperAlert customStyle={customStyle}/>
<View style={styles.outer}>
        
<Header  navigation={navigation}/>
   
</View>
      <View style={styles.screen}>
            <View  style={styles.categorieslisting}>     
          <ScrollView 
          style={{marginBottom:270,}}
           refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
           showsHorizontalScrollIndicator={false} onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        getData();
      }
    }}
    scrollEventThrottle={400}
    
    >
          <SafeAreaView>
                <FlatList
                 data={dataSource}
          keyExtractor={(item, index) => index.toString()}
         
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}

             
                />

               {textto ? <View><Text style={{textAlign:'center'}}>{textto}</Text>
                <TouchableOpacity    activeOpacity={0.1}  
                onPress={() => getData()}>
                              <Text style={{textAlign:'center',color:'blue'}}>Refresh</Text>
                              </TouchableOpacity></View>
               :null}
            
            
            </SafeAreaView>
          </ScrollView>
          
        </View>


          
  
      </View>
      <View></View>

    </View>

    

  );



}

const styles = StyleSheet.create({
  container: {
   padding:0,
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
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5, },
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},
postlist:{
  backgroundColor: 'white',
  borderRadius: 8,
  paddingVertical: 5,
  width: '100%',
  marginVertical: 5,
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
icouser:{backgroundColor:'#000',height:20,width:20,color:'#fff',textAlign:'center',lineHeight:20,
borderRadius:20,marginRight:5,
},
namedes:{flexDirection:'row',alignItems:'center',justifyContent:"flex-start",marginBottom:5,paddingHorizontal:5,},
viewsinglepost:{paddingHorizontal:15,},
postmessagesingle:{fontSize:28,},
underpostfooter:{paddingHorizontal:15,}
});
