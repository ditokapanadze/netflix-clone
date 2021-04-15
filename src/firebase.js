import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAc4XQYThtKnhgquQMiH8oGVNUsueSWDAI",
  authDomain: "netflix-89701.firebaseapp.com",
  projectId: "netflix-89701",
  storageBucket: "netflix-89701.appspot.com",
  messagingSenderId: "174042985265",
  appId: "1:174042985265:web:3a5d8e7cdac17542f0b610",
  measurementId: "G-B6R2XB8MTX",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
