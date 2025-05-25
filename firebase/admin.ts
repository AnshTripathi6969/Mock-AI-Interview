import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// init once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // replace literal \n with real newlines
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    }),
  })
}

export const adminAuth = getAuth()       // server-side auth
export const adminDb   = getFirestore()  // server-side firestore
