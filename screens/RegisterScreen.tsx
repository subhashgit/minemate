import React, { useState,useContext  } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image  } from 'react-native';
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { nameValidator } from './helpers/nameValidator'

import AuthContext from './helpers/AuthContext'
import SuperAlert from "react-native-super-alert";


var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default function RegisterScreen({navigation}) {
  
  const { signIn } = useContext(AuthContext);
  
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [gander, setGander] = useState('')
    const [Loading, setLoading] =  useState(false);
  const data = [
    {label: 'Male'     },     {      label: 'Female'     },     {      label: 'Other'     }
    ];
  const onSignUpPressed = () => {
   
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
   else{
    setLoading(true);
      fetch(BASE_URL+'signup.php',
      {
          method: 'POST',
          body: JSON.stringify({ username: name.value, email: email.value, password:password.value,gander:gander.label }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        .then((response) => {
          
          if(response.status === true){
            signIn({email:email.value});
          navigation.navigate('Root' );
          }
          else  if(response.status === false){
            alert(response.message);
          }
          })  
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
    <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
    <View>
  <SuperAlert customStyle={customStyle}/> 
</View>
    <Image source={require('./img/logo.png')}
  style={styles.imglogo}
/>
    <Text style={styles.textwelcome}>Sign Up</Text>
   <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
        style={styles.textbox}
        placeholder="Name"
      />
      <Text  style={{color:'red'}}>{name.error}</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={styles.textbox}
        placeholder="Email"
      />
      <Text  style={{color:'red'}}>{email.error}</Text>
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        style={styles.textbox}
        placeholder="Password"
      />
<Text style={{color:'red'}}>{password.error}</Text>
<RadioButtonRN
  data={data}
  animationTypes={['zoomIn']}
					initial={1}
     
  selectedBtn={(e) => setGander(e)}
  style={styles.radiostyle}  
  textStyle={styles.radiotextwrapper}  
  boxStyle={styles.radioboxStyle}  
  circleSize={12}
  
  
/>
      <TouchableOpacity
        onPress={onSignUpPressed}
        style={styles.buttonStyle}>
        <Text style={styles.btntxt}>Sign Up</Text>
        </TouchableOpacity>
    
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
     
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }, link: {
    fontWeight: 'bold',
    color: '#000',
  },
   row: {
    display: 'flex',
    flexDirection:'row',
    marginTop: 4,
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
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',},
  radioboxStyle:{width:'32%',borderColor:'#000', marginHorizontal:'1%'}, 
  
  spinnerTextStyle:{color:'#fff'}
});
