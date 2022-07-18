var BASE_URL = require('./ApiBaseUrl.tsx');
function UserProfie(tokennumber) {
  return new Promise((Resolve, reject) => {
    fetch(BASE_URL+'authnameemail.php',
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
        body: JSON.stringify({ token: tokennumber  })
    })
      .then((response) => response.json())
       .then((response) => {
         if(response.status===true){
        Resolve(response.message); 
        }
        else{
          reject('false');
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  })
}
  
// Exporting check function
module.exports = {
  UserProfie: UserProfie
};

