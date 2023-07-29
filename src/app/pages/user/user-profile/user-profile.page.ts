import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserInterface } from 'src/app/models/user'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {


  public editForm = this.formBuilder.group({ // Login form with its validation rules
    name: ['', Validators.required],
    rol: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public navigationService: NavigationService
  ) { }

  public user : UserInterface = {
    name: ''
  }

  async ngOnInit() {
    this.userService.isAuth()
    .subscribe((authState) => {
      if (authState) {

        this.user = {
          name: authState.displayName
        };

        this.editForm.patchValue({
          name: this.user.name
        })
      } else {
        this.userService.logOut()
      }
    });
  }
  
  public resetForm() {
    this.editForm.reset({
      name: this.user.name
    });
  }

  public updateUser(){

    let finalRol;
    if (this.editForm.value.rol! == 'both') {
      finalRol = ['cats', 'dogs'];
    } else {
      finalRol = [this.editForm.value.rol!];
    }

    const name = this.editForm.value.name;
    if (this.editForm.valid && name) {
      this.userService.updateUserDetails(name, finalRol)
      .catch((err) => {
        console.log(err);
      });
    }
  }
}
