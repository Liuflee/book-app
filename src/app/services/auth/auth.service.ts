import { User } from '../../models/user.model';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  browserLocalPersistence,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth, private firestore: Firestore) {
    // Configura la persistencia de sesión
    this.afAuth.setPersistence(browserLocalPersistence).catch((error) => {
      console.error('Error configurando persistencia:', error);
    });
  }

  async register(userData: User, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.afAuth, userData.email, password);
    const uid = userCredential.user.uid;
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, {
      ...userData,
      uid,
    });
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  async logout() {
    return signOut(this.afAuth);
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }
}
