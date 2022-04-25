import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const local = location.hostname === 'localhost'

let config = {
  apiKey: process.env.SHADER_GALLERY_API_KEY,
  authDomain: process.env.SHADER_GALLERY_AUTH_DOMAIN,
  projectId: process.env.SHADER_GALLERY_PROJECTID,
  storageBucket: process.env.SHADER_GALLERY_STORAGE_BUCKET,
  messagingSenderId: process.env.SHADER_GALLERY_MESSAGING_SENDER_ID,
  appId: process.env.SHADER_GALLERY_APP_ID,
}

if (local) {
  // config = {
  //   databaseUrl: 'http://localhost:4001/?ns=shader-gallery-61e7f',
  // }
}

const app = initializeApp(config)
export const db = getFirestore()

if (local) {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export const auth = getAuth(app)
connectAuthEmulator(auth, 'http://localhost:9099')

export default app
