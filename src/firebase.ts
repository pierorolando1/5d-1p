import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const firebaseConfig = {

    apiKey: "AIzaSyBX6cJ2UMdWLbjDn_4ZxqHKuk1A5koYkcQ",
  
    authDomain: "d-poll.firebaseapp.com",
  
    projectId: "d-poll",
  
    storageBucket: "d-poll.appspot.com",
  
    messagingSenderId: "440433411974",
  
    appId: "1:440433411974:web:77930cb3ee202d71620e07"
  
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


// Get a list of cities from your database
export async function checkNumber(number: string): Promise<boolean> {
    const docRef = doc(db, "dudes", number);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() && !docSnap.data().voted;
}
