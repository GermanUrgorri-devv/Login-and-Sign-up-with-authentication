import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }


  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  public registerForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ],
      ],
      repeatPassword: ['', Validators.required],
    },

    { validator: this.passwordMatchValidator('password', 'repeatPassword') }
  );

  private passwordMatchValidator(
    controlName: string,
    matchingControlName: string
  ): Validators {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const password = formGroup.controls[controlName];
      const repeatPassword = formGroup.controls[matchingControlName];

      if (!repeatPassword) {
        return null;
      }

      if (repeatPassword.errors && !repeatPassword.errors['passwordMismatch']) {
        return null;
      }

      if (password.value !== repeatPassword.value) {
        repeatPassword.setErrors({ passwordMismatch: true });
      } else {
        repeatPassword.setErrors(null);
      }
      return null;
    };
  }
  //Boton para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.showPassword = true;
    } else {
      passwordInput.type = 'password';
      this.showPassword = false;
    }
  }

  ngOnInit() {
  }


  public login() {
    
    
    this.userService.login(this.loginForm.value['email']!, this.loginForm.value['password']!)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  public register() {
    
    this.userService.register(this.registerForm.value['email'], this.registerForm.value['password'])
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  


}
