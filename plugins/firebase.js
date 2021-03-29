import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyB2ndoFzTiJwKQkIZjKx0DEbsnsZfu-T3I",
  authDomain: "engder-globish.firebaseapp.com",
  databaseURL: "https://engder-globish.firebaseio.com",
  projectId: "engder-globish",
  storageBucket: "engder-globish.appspot.com",
  messagingSenderId: "851719561979",
  appId: "1:851719561979:web:64f6e73cadfd848897c65e"
});

// firebase.initializeApp({
//   apiKey: "AIzaSyC09KeIHXvq0FA_e6gNgmpS4tWvGI7qhTg",
//   authDomain: "engder-nuxt.firebaseapp.com",
//   databaseURL: "https://engder-nuxt.firebaseio.com",
//   projectId: "engder-nuxt",
//   storageBucket: "engder-nuxt.appspot.com",
//   messagingSenderId: "236694573569",
//   appId: "1:236694573569:web:0240641ad12c37f4d56600"
// });

Vue.prototype.$firebase = firebase;

Vue.use(firebase);
// export default (context, inject) => {
//   inject("firebase", firebase);
// };
export default firebase;
