import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA2ONiryPBLOwoZfY3koRzoqZaUWcttJgM",
    authDomain: "impulse-4dc71.firebaseapp.com",
    databaseURL: "https://impulse-4dc71-default-rtdb.firebaseio.com",
    projectId: "impulse-4dc71",
    storageBucket: "impulse-4dc71.appspot.com",
    messagingSenderId: "613835137575",
    appId: "1:613835137575:web:eee0594bee20084faaa402",
    measurementId: "G-JN0NM39L12"
}
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

