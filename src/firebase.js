import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth'
import { doc, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDVofNGHmuzqyA6rVPjYJa0ed1ailMis8k",
  authDomain: "valentina-20bd7.firebaseapp.com",
  projectId: "valentina-20bd7",
  storageBucket: "valentina-20bd7.firebasestorage.app",
  messagingSenderId: "562454267340",
  appId: "1:562454267340:web:d99e58f99d8f6bf42d0969"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const propertiesDocRef = doc(db, 'site', 'properties')
export const storage = getStorage(app)

if (typeof window !== 'undefined') {
  getAnalytics(app)
}

export const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence)