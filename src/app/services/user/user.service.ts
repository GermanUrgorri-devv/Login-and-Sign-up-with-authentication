import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserInterface } from 'src/app/models/user';
import { Observable, Subject, from, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userDetailsUpdated = new Subject<void>();

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private navigationService: NavigationService) { }

  // Logs in a user with email and password, then navigates to home
  async login(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.navigationService.navigateTo('home');
    } catch (error) {
      console.error(error);
    }
  }

  // Logs in a user with Google, updates user details, then navigates to home
  async loginWithGoogle() {
    try {
      await this.auth.signInWithPopup(new GoogleAuthProvider());
      this.updateUserDetails('',[]);
      this.navigationService.navigateTo('home');
    } catch (error) {
      console.error(error);
    }
  }

  // Registers a user with email and password, updates user details, then navigates to user-profile
  async register(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      this.updateUserDetails('',[]);
      this.navigationService.navigateTo('user-profile');
    } catch (error) {
      console.error(error);
    }
  }

  // Logs out a user and reloads the page
  async logOut() {
    try {
      await this.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // Checks if a user is authenticated
  isAuth() {
    return this.auth.authState.pipe(map(auth => auth));
  }

  // Updates user details and navigates to home
  async updateUserDetails(name: string, roles: any) {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        const userRefernce: AngularFirestoreDocument<any> = this.firestore.doc(`user/${user.uid}`);
        const data: UserInterface = {
          id: user.uid,
          email:user.email,
          roles: roles
        }
        userRefernce.set(data, {merge: true});
        await user.updateProfile({
          displayName: name
        });
        this.userDetailsUpdated.next();
        this.navigationService.navigateTo('home');
      } else {
        throw new Error('No user logged');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Gets a user from Firestore
  private getUser(userID: string): Observable<any> {
    try {
      return this.firestore.collection('user').doc(userID).valueChanges().pipe(take(1));
    } catch (e) {
      console.error("Error obteniendo el usuario: ", e);
      return throwError(e);
    }
  }

  // Gets user data from Firestore
  private getUserData<T>(mapFn: (user: any) => T): Observable<T | null> {
    return from(this.auth.currentUser).pipe(
      switchMap((user) => {
        if (user) {
          return this.getUser(user.uid).pipe(
            map(mapFn),
            catchError((error) => {
              console.error('Error getting user data:', error);
              return of(null);
            })
          );
        } else {
          console.log('No user logged in');
          return of(null);
        }
      })
    );
  }

  // Gets user roles from Firestore
  public getUserRoles(): Observable<any> {
    return this.getUserData((user) => user ? user.roles : null);
  }

  // Gets user name from Firebase Auth
  public async getUserName(): Promise<any> {
    const user = await this.auth.currentUser;
    if (user) {
      return user || []; 
    } else {
      console.log('No user logged in');
      this.navigationService.navigateTo('login');
      return '';
    }
  }
}