import React, {useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, RefreshControl,Share,Platform,  View,Dimensions,Linking,Alert,PermissionsAndroid, Text,TextInput, ImageBackground,Clipboard, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from "@expo/vector-icons";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');

export default  function Notification6({ navigation }) {
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      };


const [loading, setLoading] = useState(true);
const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);
const [emptxt, setemptxt] = useState('');

useEffect(() => getData(), []);
const getData = async() => {
let email = await SecureStore.getItemAsync('email');
let token = await SecureStore.getItemAsync('token');
fetch(BASE_URL+'notifications.php?page='+offset,
{
    method: 'POST',
    headers: new Headers({
         'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
}),
    body: JSON.stringify({ token:token, email:email   })
})
  .then((response) => response.json())
  .then((responseJson) => {  
//console.log(responseJson);
    if(responseJson.status === false){
      setemptxt(responseJson.message);
      setLoading(false); return;}
      setOffset(offset + 1);
      setDataSource([...dataSource, ...responseJson.message]);
    setLoading(false);
  })
  .catch((error) => {
    console.error(error);
  });
};

 const [profiledata, setprofiledata] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

     setRefreshing(true);
   //  setOffset(1);
     getData();
     setRefreshing(false);
  
  }, []);


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
   const status = item.status;
    return (
       <View  style={[styles.postlist, status=='unread' ? styles.undread : null]}>
         <Text style={{position:"absolute",top:0,fontSize:12,color:'#aaa',left:13}}>{item.date}</Text>
          <FontAwesome
                      style={{ fontSize: 22, paddingRight: 5, flexDirection: "row" }}
                      name="envelope"
                    />
            <Text  style={{color:'#000',fontSize:16}}>  {item.username} send you a {item.type}</Text>
         
    </View>
     
    );
  };

  return (

      <View style={styles.container}>
          
        
          <ScrollView 
          style={{marginBottom:0}}
           refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
            showsVerticalScrollIndicator={false} 
           showsHorizontalScrollIndicator={false} onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        getData();
      }
    }}
    scrollEventThrottle={400}
    >

          <SafeAreaView>
            <View>
                <FlatList
                 data={dataSource}
          keyExtractor={(item, index) => index.toString()}
         
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}

             
                />
                </View>
            </SafeAreaView>
            {emptxt ? <Text style={{textAlign:"center"}}> {emptxt}</Text> : null}          
          </ScrollView>
         
       
    </View>

    

  );

}

const styles = StyleSheet.create({
  container: {
   padding:15,marginTop:0,paddingTop:0,paddingBottom:0,
  },
  undread:{borderBottomColor:'#000',borderBottomWidth:1,},
  postlist:{backgroundColor:'#fff',marginVertical:2,flexDirection:'row',paddingTop:20,paddingVertical:8,paddingHorizontal:12,}
});
