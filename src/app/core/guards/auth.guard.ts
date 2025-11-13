import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      take(1), // 👈 ensures we only take the first emitted user value
      map((user) => {
        // 👇 if logged in, allow route
        if (user) return true;

        // 👇 otherwise redirect without race condition
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}