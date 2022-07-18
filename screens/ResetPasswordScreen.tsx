import React, { useState } from 'react'
import { StyleSheet, TextInput, Text ,View , TouchableOpacity, ImageBackground, Image} from 'react-native';
import { emailValidator } from './helpers/emailValidator'
import SuperAlert from "react-native-super-alert";
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default function ResetPasswordScreen({navigation}) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
 
    }
    else{
 
        fetch(BASE_URL+'forgetpassword.php',
        {
            method: 'POST',
            body: JSON.stringify({ email: email.value }),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
           
        })
          .then((response) => response.json())
          .then((response) => {alert(response.message);})  
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
          
        }
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
    <ImageBackground source={require('./img/background.png')} resizeMode="repeat"  style={styles.image}>
       
    <View style={styles.container}>
    <View>
  <SuperAlert customStyle={customStyle}/> 
</View>
    <Image source={require('./img/logo.png')}
  style={styles.imglogo}
/>
    <Text style={styles.textwelcome}>Forget Password </Text>
    <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
        style={styles.textbox}
        placeholder="Email"
      />
<Text  style={{color:'red'}}>{email.error}</Text>
        <TouchableOpacity  onPress={sendResetPasswordEmail} style={styles.buttonStyle}>
                <Text style={styles.btntxt}>Send Instructions</Text>
      </TouchableOpacity>
      
        
    </View></ImageBackground>
  );
}

const styles = StyleSheet.create({
  
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: '#000',
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
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
    justifyContent: "center"
  },
  imglogo:{width:120,height:120,},
  textwelcome:{fontSize:30,marginTop:50,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:60,},
  textbox:{ borderBottomColor:'#000',borderBottomWidth:2,color:'#000',width:'100%',paddingVertical:10,
  marginVertical:5,},

});
