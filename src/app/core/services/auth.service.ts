import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, UserCredential, OAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence, User, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDoc, Timestamp } from 'firebase/firestore';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ToastService } from './toast';
import { LoadingService } from './loading.service';

export interface AppUser {
  uid: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  photoURL?: string;
  provider?: string;
  createdAt?: string;
  lastLogin?: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastService);

  registerUser(userData: { firstName: string; lastName: string; email: string; password: string }) {
    const { email, password, firstName, lastName } = userData;

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCred: UserCredential) => {
        const user = userCred.user;
        if (!user) return throwError(() => new Error('User not created.'));

        // Update Firebase display name
        return from(updateProfile(user, { displayName: `${firstName} ${lastName}` })).pipe(
          switchMap(() => {
            // Save additional user details in Firestore
            const userRef = doc(this.firestore, `users/${user.uid}`);
            const userDoc = {
              uid: user.uid,
              firstName,
              lastName,
              email,
              createdAt: new Date().toISOString(),
            };
            return from(setDoc(userRef, userDoc)).pipe(
              switchMap(() => of(userDoc))
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  // ---------------------------
  // Email login
  // ---------------------------
async login(email: string, password: string, rememberMe: boolean) {
  try {
    const persistenceType = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(this.auth, persistenceType);

    // Return the result so the component can react
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return { success: true, data: userCredential };

  } catch (error: any) {
    const message = this.getErrorMessage(error?.code);
    return { success: false, error: message };
  }
}



  // ---------------------------
  // Google login (popup)
  // ---------------------------
async loginWithGoogle(rememberMe: boolean) {
  try {

    const provider = new GoogleAuthProvider();
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(this.auth, persistenceType);
    const userCredential = await signInWithPopup(this.auth, provider);
    return { success: true, data: userCredential };

  } catch (error: any) {
    const message = this.getErrorMessage(error?.code);
    return { success: false, error: message };
  }  
}

  // ---------------------------
  // Microsoft login (popup)
  // ---------------------------

async loginWithMicrosoft(rememberMe: boolean) {
  try {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('email');

    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(this.auth, persistenceType);

    const result = await signInWithPopup(this.auth, provider);
    return result.user;

  } catch (error: any) {
    console.error('Microsoft login failed:', error);
    throw new Error(this.getOAuthErrorMessage(error.code));
  }
}

  logout() {
    this.loadingService.show();
    this.auth.signOut()
    .then( () => {
      this.toast.show('User logout successfully!', 'success')
      this.router.navigate(['/auth/login']);
      this.loadingService.hide();
    })
    .catch(error => {
      this.toast.show('Unable to logout! Please try again. ' + error, 'error');
      this.loadingService.hide();
    });
  }

    async forgotPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error?.code)
      };
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Invalid user id or password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'Login failed. Please try again.';
    }
  }

  getOAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'The popup was closed before the login process completed.';
    case 'auth/cancelled-popup-request':
      return 'Another popup login request is already in progress.';
    case 'auth/popup-blocked':
      return 'Popup window was blocked by the browser.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with a different sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'Login failed. Please try again.';
  }
}

}