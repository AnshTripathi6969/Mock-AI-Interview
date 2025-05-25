import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth }       from "firebase/auth"
import { getFirestore }  from "firebase/firestore"

const firebaseConfig = {
  apiKey:            "AIzaSyBkxFtoe-VoVJCuxWsEqI7WQ3eYG134sCY",
  authDomain:        "skillscreen-e91bd.firebaseapp.com",
  projectId:         "skillscreen-e91bd",
  storageBucket:     "skillscreen-e91bd.appspot.com", // fixed typo
  messagingSenderId: "360624831967",
  appId:             "1:360624831967:web:8bbebda153c68de958586a",
  measurementId:     "G-3M2B9P7Z3T",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const adminAuth = getAuth(app)         // browser auth
export const adminDb  = getFirestore(app)    // browser firestore
