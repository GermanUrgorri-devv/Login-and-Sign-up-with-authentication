import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigateTo(path: string) {
    this.router.navigate(['/' + path])
    .catch(error => console.log(error));
  }
}