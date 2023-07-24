import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth) { }

  public login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public register(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
}
