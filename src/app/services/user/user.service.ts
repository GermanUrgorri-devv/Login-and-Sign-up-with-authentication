import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserInterface } from 'src/app/models/user';



@Injectable({
  providedIn: 'root'
})
export class UserService {

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
}