import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";


export const userAlredyVoted = async (phoneNumber: string) => {
    const docRef = doc(db, "dudes", phoneNumber);
    const docSnap = await getDoc(docRef);

    return (docSnap.data()!.voted && docSnap.data()!.voted == true) ? true : false;
}