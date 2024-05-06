import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../Services/authservice.service';
import { map, take } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authServ = inject(AuthserviceService);
  const router = inject(Router);
  return (authServ.userSubject.pipe(take(1), map((user) => {
    const loggedIn = user ? true : false;
    if (loggedIn) {
      return true;
    }
    else {
      return router.createUrlTree(['/Login']) ;
    }
  })))
};
