import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBj7mwWWOWzI5nCAX5db7ay_qD-BbVy1CA",
  authDomain: "skill-co.firebaseapp.com",
  projectId: "skill-co",
  storageBucket: "skill-co.firebasestorage.app",
  messagingSenderId: "323678864042",
  appId: "1:323678864042:web:5db4bc1f324283111706d3"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)