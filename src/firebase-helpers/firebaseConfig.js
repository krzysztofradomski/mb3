let firebase = global.firebase;
 var firebaseConfig = {
     base: {
         apiKey: "AIzaSyANmT2lWop_rbnLuXcl2V13Izjg3H3ybaY",
         authDomain: "messageboard1-6c745.firebaseapp.com",
         databaseURL: "https://messageboard1-6c745.firebaseio.com",
         projectId: "messageboard1-6c745",
         storageBucket: "messageboard1-6c745.appspot.com",
         messagingSenderId: "515471374408"
     },
     ui: {
         signInSuccessUrl: "http://localhost:3000/",
         signInOptions: [
             firebase.auth.GoogleAuthProvider.PROVIDER_ID,
             firebase.auth.EmailAuthProvider.PROVIDER_ID
         ]
     }
 };

 export default firebaseConfig;