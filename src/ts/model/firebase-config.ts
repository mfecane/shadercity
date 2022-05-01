import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const local = location.hostname === 'localhost'

const config = {
  apiKey: process.env.SHADERCITY_API_KEY,
  authDomain: process.env.SHADERCITY_AUTH_DOMAIN,
  projectId: process.env.SHADERCITY_PROJECTID,
  storageBucket: process.env.SHADERCITY_STORAGE_BUCKET,
  messagingSenderId: process.env.SHADERCITY_MESSAGING_SENDER_ID,
  appId: process.env.SHADERCITY_APP_ID,
  measurementId: process.env.SHADERCITY_MEASUREMENT_ID,
}

const app = initializeApp(config)
export const db = getFirestore()

if (local) {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export const auth = getAuth(app)

if (local) {
  connectAuthEmulator(auth, 'http://localhost:9099')
}

export default app
