import React from 'react';
import {  View,  StyleSheet,TouchableOpacity,Text, Dimensions } from 'react-native';

import {  MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";

var width = Dimensions.get("window").width;
var height = Dimensions.get("screen").height;
export default function CreatePost({ navigation }) {

  return (
    <View style={styles.container}>
   
   
    <View  style={styles.Modalpost}>
          <View style={styles.outerwrapper}>
       
              <TouchableOpacity style={styles.outerwrapperlist}>
              <Ionicons
            size={25}
            color={'#fff'}
            name='videocam-outline'/>
                <Text style={styles.labeltxt}>Video</Text>
              </TouchableOpacity>
           
              <TouchableOpacity  onPress={() => navigation.navigate('AddImage')}  style={styles.outerwrapperlist}>
              <Ionicons
            size={25}
            color={'#fff'}
            name='image-outline'/>
                <Text style={styles.labeltxt}>Image</Text>
              </TouchableOpacity>
          
              <TouchableOpacity  onPress={() => navigation.navigate('AddQuotes')}  style={styles.outerwrapperlist}>
              <Entypo
            size={25}
            color={'#fff'}
            name='quote'/>
                <Text style={styles.labeltxt} >Quotes</Text>
              </TouchableOpacity>
          
              {/*<TouchableOpacity style={styles.outerwrapperlist}>
              <MaterialIcons
            size={25}
            color={'#fff'}
            name='audiotrack'/>
                <Text style={styles.labeltxt}>Audio</Text>
  </TouchableOpacity>*/}
           
           
          </View>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
 
   container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',padding:15,
  },
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
   
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
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
  textbox:{ borderColor:'#000',borderWidth:2,color:'#000',width:'100%',paddingVertical:10,
  marginVertical:5,padding:15, },
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',justifyContent:'center'},
  radioboxStyle:{width:'44%', marginHorizontal:'1%'}, 
  spinnerTextStyle:{color:'#fff'},

  Modalpost:{position:'absolute',flex:1,height:height,backgroundColor:'#666',},
  outerwrapper: {
    backgroundColor: "#000",
    borderRadius: 0,
    width: width,
    alignItems: "center",
    marginTop: 'auto',
    bottom:40,zIndex:9,
    paddingBottom:30,


  },
  labeltxt:{color:'#fff',fontSize:24,marginLeft:15,},
  outerwrapperlist:{flexDirection:'row',alignItems:'center',
  paddingHorizontal:20, paddingVertical:8,borderBottomColor:'#222',borderBottomWidth:1,width:width},
})
