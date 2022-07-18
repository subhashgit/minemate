import React, {useEffect, useState, useContext } from "react";
import {  Text } from 'react-native';

import * as SecureStore from 'expo-secure-store';
export default  function username({ navigation }) {

  var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
const [getfirstnamel, setgetfirstnamel] = useState('');
async function gettoken() {
let result = await SecureStore.getItemAsync('token');
  if (result) {
    fetch(BASE_URL+'getauthname.php',
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
        body: JSON.stringify({ token: result  })
    })
      .then((response) => response.json())
       .then((response) => {
                         setgetfirstnamel(response.message);
                 })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
       } 
}
gettoken();
  return (
     
     <Text style={styles.userfletter}>{getfirstnamel}</Text>
  
  );
}
