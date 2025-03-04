import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private http: HttpClient,
    private router: Router
  ) {}

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      // Send Firebase Token to Backend for Verification
      const idToken = await user.getIdToken();
      this.http.post<{ token: string }>('http://localhost:3000/auth/firebase-login', { idToken })
        .subscribe(response => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        });

    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      // Send Firebase Token to Backend for Verification
      const idToken = await user.getIdToken();
      this.http.post<{ token: string }>('http://localhost:3000/auth/firebase-login', { idToken })
        .subscribe(response => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        });

    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }

  logout() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}
