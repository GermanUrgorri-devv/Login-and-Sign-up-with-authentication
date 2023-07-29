import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard {
  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private navigationService: NavigationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const rolesAllowed = route.data['roles'] as string[] || [];
    const redirect = route.data['redirect'] || '';

    return this.canActivateWithRoles(rolesAllowed, redirect);
    // Now this will always return Observable<boolean>, fitting the canActivateChild return type.
  }


  canActivateWithRoles(rolesAllowed: string[], redirectPath: string) {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.getUserRoles().pipe(
            map(userRoles => {
              if (userRoles) {
                const hasRole = userRoles.some((role: string) => rolesAllowed.includes(role));
                if (hasRole) {
                  return true;
                } else {
                  this.navigationService.navigateTo(redirectPath);
                }
              }
              return false;
            }),
          );
        } else {
          console.log('No user is signed in');
          this.navigationService.navigateTo('login');
          return of(false);
        }
      }),
      catchError(error => {
        console.error('Error in canActivateWithRoles():', error);
        this.navigationService.navigateTo('login');
        return of(false);
      })
    );
  }
}