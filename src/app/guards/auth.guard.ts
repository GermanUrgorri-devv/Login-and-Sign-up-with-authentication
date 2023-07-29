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

  // Determines if a route can be activated
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const rolesAllowed = route.data['roles'] as string[] || [];
    const redirect = route.data['redirect'] || '';

    // Calls canActivateWithRoles with the allowed roles and redirect path
    return this.canActivateWithRoles(rolesAllowed, redirect);
  }

  // Checks if the authenticated user has one of the allowed roles
  canActivateWithRoles(rolesAllowed: string[], redirectPath: string) {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          // If a user is authenticated, get their roles
          return this.userService.getUserRoles().pipe(
            map(userRoles => {
              if (userRoles) {
                // Check if the user has an allowed role
                const hasRole = userRoles.some((role: string) => rolesAllowed.includes(role));
                if (hasRole) {
                  // If the user has an allowed role, allow the route to be activated
                  return true;
                } else {
                  // If the user doesn't have an allowed role, navigate to the redirect path
                  this.navigationService.navigateTo(redirectPath);
                }
              }
              // If the user doesn't have any roles, prevent the route from being activated
              return false;
            }),
          );
        } else {
          // If no user is authenticated, navigate to the login page
          console.log('No user is signed in');
          this.navigationService.navigateTo('login');
          return of(false);
        }
      }),
      catchError(error => {
        // If there's an error, log it and navigate to the login page
        console.error('Error in canActivateWithRoles():', error);
        this.navigationService.navigateTo('login');
        return of(false);
      })
    );
  }
}