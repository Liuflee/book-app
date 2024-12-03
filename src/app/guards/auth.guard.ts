import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return from(Promise.resolve(this.auth.currentUser)).pipe(
      take(1),
      map((user) => {
        if (user) {
          // Si el usuario está autenticado, permitir acceso.
          return true;
        } else {
          // Si no está autenticado, redirigir al login.
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
