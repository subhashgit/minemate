import React, {useEffect, useState, useContext } from "react";
import * as SecureStore from 'expo-secure-store';
const auth = () => {
    const [username, setusername] = useState('');
async function getValueF(key) {
    
    let result = await SecureStore.getItemAsync(key);
    if (result) {
       setusername(result);
      
    } 
  }
  getValueF('username');
}  
export default auth;