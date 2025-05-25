'use server'

import { adminAuth , adminDb } from '@/firebase/admin'   // ✅ admin SDK
import { Auth, getAuth } from 'firebase-admin/auth'
import { cookies } from 'next/headers'

const ONE_WEEK = 60 * 60 * 24 * 7   // seconds

/* ---------- SIGN-UP ---------- */
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params

  try {
    const userRef     = adminDb.collection('users').doc(uid)
    const userSnap    = await userRef.get()

    if (userSnap.exists) {
      return { success: false, message: 'User already exists. Please sign in instead.' }
    }

    await userRef.set({ name, email })

    return { success: true }
  } catch (e: any) {
    console.error('Error creating user:', e)

    if (e.code === 'auth/email-already-exists') {
      return { success: false, message: 'This email is already in use.' }
    }

    return { success: false, message: 'Failed to create an account.' }
  }
}

/* ---------- SIGN-IN ---------- */
export async function signIn(params: SignInParams) {
  const { email, idToken } = params

  try {
    const userRecord = await adminAuth.getUserByEmail(email)

    if (!userRecord) {
      return { success: false, message: 'User does not exist. Create an account instead.' }
    }

    await setSessionCookie(idToken)
    return { success: true }
  } catch (e) {
    console.error('Sign-in error:', e)
    return { success: false, message: 'Failed to log into an account.' }
  }
}

/* ---------- SESSION COOKIE ---------- */
async function setSessionCookie(idToken: string) {
  const cookieStore  = cookies()                // no await
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,                 // ms
  })

  ;(await cookieStore).set('session', sessionCookie, {
    maxAge:   ONE_WEEK,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    path:     '/',
    sameSite: 'lax',
  })
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get('session')?.value;

  if(!sessionCookie) return null;

  try{
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie , true);

    const userRecord = await adminDb.collection('users')
    .doc(decodedClaims.uid)
    .get();

    if(!userRecord.exists) return null;
    return {
      ... userRecord.data(),
      id: userRecord.id,
    } as User;
  }catch(e){
    console.log(e)

    return null;
  }
}

export async function isAuthenticated(){
  const user = await getCurrentUser();

  return !!user;
}