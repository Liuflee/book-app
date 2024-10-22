import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth) {}

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.afAuth, email, password);
  }

  async logout() {
    return signOut(this.afAuth);
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }
}
