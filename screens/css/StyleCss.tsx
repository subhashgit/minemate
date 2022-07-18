import { StyleSheet, Dimensions } from "react-native";
var width = Dimensions.get("window").width;
var height = Dimensions.get("screen").height;
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',padding:15,
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
        paddingVertical: 15,borderWidth:2,borderColor:'#d62d56',
        backgroundColor:'#d62d56',
      },
      buttonStyletwo: {
        width: '100%',
        marginVertical: 10,
        paddingVertical: 15,borderWidth:2,borderColor:'#ff4773',
        backgroundColor:'#ff4773',
      },
      btntxt: {
        fontWeight: 'bold',
        fontSize: 20    ,
        color:'#fff',
        lineHeight: 22,
        textAlign:'center',
      },
      image: {
        flex: 1,
        justifyContent: "center",height:'100%',backgroundColor:'#fff',
      },
      imglogo:{width:220,height:218,marginBottom:40},
      textwelcome:{fontSize:30,marginTop:50,},
      textdesc:{fontSize:14,marginTop:0,marginBottom:60,},
      spinnerTextStyle:{color:'#fff'},
      textbox:{ borderBottomColor:'#d62d56',borderBottomWidth:2,
      color:'#d62d56',width:'100%',fontSize:22, paddingVertical:20,
    backgroundColor:'#fff',paddingHorizontal:5, letterSpacing:5},
    mobiletxt:{fontSize:35,fontWeight:'900',color:'#d62d56', marginBottom:20,textAlign:'left'},
    selectCountry:{display:'flex',alignItems:'center',backgroundColor:'#fff',width:'100%',textAlign:'left',
  fontSize:22,flexDirection:'row',marginBottom:10,borderBottomColor:'#d62d56',borderBottomWidth:2,paddingVertical:15,},
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

  
});
