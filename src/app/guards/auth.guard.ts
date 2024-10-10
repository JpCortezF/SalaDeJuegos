import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const negate = route.data && route.data['negate'] === true;

  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (negate) {
          // Si está intentando ir al log-in pero ya está logueado
          router.navigate(['/home']);
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        if (negate) {
          resolve(true);  // Usuario no logueado puede acceder a log-in
        } else {
          // Usuario no logueado intenta acceder a una ruta protegida, redirige a log-in
          router.navigate(['/log-in']);
          resolve(false);
        }
      }
    });
  });
};
