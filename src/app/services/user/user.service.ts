import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AngularFireAuth, private navigationService: NavigationService) { }

  public login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo('home');
      });
  }

  public register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo('home');
      });
  }


  public logOut() {
    return this.auth.signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(error => console.log(error));
  }
}