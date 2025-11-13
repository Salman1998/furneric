import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, UserCredential, OAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDoc, Timestamp } from 'firebase/firestore';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';

export interface AppUser {
  uid: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
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
  login(email: string, password: string, rememberMe = false): Observable<AppUser> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    return from(setPersistence(this.auth, persistence)).pipe(
      switchMap(() => from(signInWithEmailAndPassword(this.auth, email, password))),
      switchMap((cred) => {
        const user = cred.user;
        if (!user) return throwError(() => new Error('Login failed.'));
        return this.syncUserDoc(user, 'password');
      }),
      catchError((err) => {
        console.error('loginWithEmail error', err);
        return throwError(() => err);
      })
    );
  }

  // ---------------------------
  // Google login (popup)
  // ---------------------------
  async loginWithGoogle(rememberMe: boolean) {
    try{
      const provider = new GoogleAuthProvider();

      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(this.auth, persistenceType);

      const result = await signInWithPopup(this.auth, provider);

      console.log('Google login successful: ', result.user, 'RememberMe', rememberMe);

      return result.user

    } catch (error) {
      console.log('Google login failed: ', error);
      throw error;
    }
  }

  // ---------------------------
  // Microsoft login (popup)
  // ---------------------------
  loginWithMicrosoft(rememberMe = false): Observable<AppUser> {
    // Firebase supports OAuthProvider with providerId 'microsoft.com'
    const provider = new OAuthProvider('microsoft.com');
    // request basic profile + email
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });

    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    return from(setPersistence(this.auth, persistence)).pipe(
      switchMap(() => from(signInWithPopup(this.auth, provider))),
      switchMap((res) => {
        const user = res.user;
        if (!user) return throwError(() => new Error('Microsoft sign-in failed.'));
        return this.syncUserDoc(user, 'microsoft.com');
      }),
      catchError((err) => {
        console.error('loginWithMicrosoft error', err);
        return throwError(() => err);
      })
    );
  }


  logout() {
    // return from(this.auth.signOut()).pipe(
    //   switchMap(() => {
    //     this.router.navigate(['/auth/login']);
    //     return of(true);
    //   })
    // );
    this.auth.signOut().then( () => {
      console.log('User logout successfully!')
      this.router.navigate(['/auth/login']);
    }).catch(error => {
      console.log(error)
    })
  }
  // ---------------------------
  // Helper: write/merge user doc to Firestore
  // ---------------------------
  private syncUserDoc(user: User, providerId: string): Observable<AppUser> {
    const userRef = doc(this.firestore, `users/${user.uid}`);

    // Build user payload
    const displayName = user.displayName ?? undefined;
    const [firstName, ...rest] = (displayName ?? '').split(' ').filter(Boolean);
    const lastName = rest.join(' ') || undefined;

    const payload: AppUser = {
      uid: user.uid,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      displayName: displayName,
      email: user.email ?? undefined,
      photoURL: user.photoURL ?? undefined,
      provider: providerId,
      lastLogin: new Date().toISOString(),
      createdAt: undefined, // we'll set createdAt only if doc not exists
    };

    // If doc exists, merge; if not, create with createdAt
    return from(getDoc(userRef)).pipe(
      switchMap((snap) => {
        if (snap.exists()) {
          // merge existing
          return from(setDoc(userRef, { ...payload }, { merge: true })).pipe(
            map(() => {
              const data = snap.data() as AppUser | undefined;
              const createdAt = data?.createdAt ?? new Date().toISOString();
              return { ...payload, createdAt } as AppUser;
            })
          );
        } else {
          // create new
          const docPayload = { ...payload, createdAt: new Date().toISOString() };
          return from(setDoc(userRef, docPayload)).pipe(map(() => docPayload as AppUser));
        }
      }),
      catchError((err) => {
        console.error('syncUserDoc error', err);
        return throwError(() => err);
      })
    );
  }
}