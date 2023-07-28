import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard  {
  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private navigationService: NavigationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canActivate() called');
    const rolesAllowed = route.data['roles'] as string[] || [];
    const redirect = route.data['redirect'] || '';
    console.log(redirect, rolesAllowed)
    return this.canActivateWithRoles(rolesAllowed, redirect);
    // Now this will always return Observable<boolean>, fitting the canActivateChild return type.
  }


  canActivateWithRoles(rolesAllowed: string[], redirectPath: string) {
    console.log('Allowed roles:', rolesAllowed);
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          // User is signed in
          console.log('User is signed in with UID:', user.uid); // Add this line
          return this.userService.getUserRoles(user.uid).pipe(
            tap((userRoles: any) => console.log(userRoles)), // imprime roles del usuario
            map(userRoles => { 
              // Ensure userRoles is not undefined
              if(userRoles) {
                // Check if user has any allowed role
                const hasRole = userRoles.some((role: string) => rolesAllowed.includes(role));
                if (hasRole) {
                  // If user has allowed role, allow navigation
                  return true;
                } else {
                  // If user does not have required roles, redirect to specified path
                  this.navigationService.navigateTo(redirectPath);
                }
              }
              // If we get here, it means userRoles is undefined or user does not have the required role
              // We'll return false to indicate navigation is not allowed
              return false;
            }),
          );
        } else {
          // No user is signed in, redirect to login
          console.log('No user is signed in'); // Add this line
          this.navigationService.navigateTo('login');
          return of(false);
        }
      }),
      catchError(error => {
        // In case of error (like network error), redirect to login
        console.error('Error in canActivateWithRoles():', error);
        this.navigationService.navigateTo('login');
        return of(false);
      })
    );
  } 
  
}