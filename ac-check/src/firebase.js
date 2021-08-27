import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyC_bsbWi2pZwhoIAA2ECUUHfsalZ07Z0K0",
    authDomain: "ac-check-8a4b4.firebaseapp.com",
    projectId: "ac-check-8a4b4",
    storageBucket: "ac-check-8a4b4.appspot.com",
    messagingSenderId: "932854073685",
    appId: "1:932854073685:web:826d1554735a72de8947dc",
    databaseURL: "https://ac-check-8a4b4-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);

export const RTDB = firebaseApp.database()