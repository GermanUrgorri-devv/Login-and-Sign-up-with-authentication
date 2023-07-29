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

  public login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo('home');
      });
  }

  public loginWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.navigationService.navigateTo('user-profile');
      });
  }

  public register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo('user-profile');
      });
  }


  public logOut() {
    return this.auth.signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(error => console.log(error));
  }


  public isAuth() {
    return this.auth.authState.pipe(map(auth => auth));
  }

  public updateUserDetails(name: string, roles: any) {
    return this.auth.currentUser.then((user) => {
      if (user) {

        const userRefernce: AngularFirestoreDocument<any> = this.firestore.doc(`user/${user.uid}`);
        const data: UserInterface = {

          id: user.uid,
          email:user.email,
          roles: roles

        }
        userRefernce.set(data, {merge: true});

        return user.updateProfile({
          displayName: name
        }).then(() => {
          this.userDetailsUpdated.next();
          this.navigationService.navigateTo('home');
        })
          .catch((err) => {
            console.log(err);
          });
      } {
        return Promise.reject('No user logged');
      }
    });
  } 
  
  private getUser(userID: string): Observable<any> {
    try {
      return this.firestore.collection('user').doc(userID).valueChanges().pipe(take(1));
    } catch (e) {
      console.error("Error obteniendo el usuario: ", e);
      return throwError(e);
    }
  }
  
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

  public getUserRoles(): Observable<any> {
    return this.getUserData((user) => user ? user.roles : null);
  }

  public async getUserName(): Promise<any> {
    const user = await this.auth.currentUser;
    if (user) {
      return user|| []; 
    } else {
      console.log('No user logged in');
      this.navigationService.navigateTo('login');
      return '';
    }
  }
  
  
}