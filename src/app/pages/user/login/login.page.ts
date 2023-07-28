import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public showPassword = false; // Controls visibility of password fields

  public errorVisibility = {   // Controls visibility of login error messages
    email: false,
    password: false
  };
  public emailError = '';      // Stores login email error message
  public passwordError = '';   // Stores login password error message
  
  public registerErrorVisibility = {  // Controls visibility of registration error messages
    email: false,
    password: false,
    repeatPassword: false
  };
  public registerEmailError = 'Invalid email.';       // Default error message for register email
  public registerPasswordError = '';  // Error message for register password
  public repeatPasswordError = '';    // Error message for repeat password

  public showLoginOrRegister = true; // Controls visibility of login and register forms


  public loginForm = this.formBuilder.group({ // Login form with its validation rules
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  public registerForm = this.formBuilder.group( // Register form with its validation rules
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ],
      ],
      repeatPassword: ['', Validators.required],
    },

    { validator: this.passwordMatchValidator('password', 'repeatPassword') }
  );

  
  constructor( // Injecting services into the component
    private formBuilder: FormBuilder,
    private userService: UserService,
    public navigationService: NavigationService
  ) { }

  toggleForm() {
    this.showLoginOrRegister = !this.showLoginOrRegister;
  }



  private passwordMatchValidator( // Custom validator to check if password and repeatPassword match
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

  togglePasswordVisibility() { // Toggle password field between plain text and password type
    const passwordInputs = document.querySelectorAll('.password-field');

    passwordInputs.forEach((element) => {
      let passwordInput = element as HTMLInputElement;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
    this.showPassword = !this.showPassword;
  }


  public toggleLoginErrorVisibility(errorType: 'email' | 'password') {
    this.errorVisibility[errorType] = !this.errorVisibility[errorType]; // Toggles the visibility of specific login error message
  }
  public toggleRegisterErrorVisibility(errorType: 'email' | 'password' | 'repeatPassword') {
    this.registerErrorVisibility[errorType] = !this.registerErrorVisibility[errorType]; // Toggles the visibility of specific register error message
  }

  ngOnInit() {
  }


  public login() { // Function to handle login form submission
    this.emailError = '';
    this.passwordError = '';
    this.errorVisibility = {
      email: false,
      password: false
    };

    this.userService.login(this.loginForm.value['email']!, this.loginForm.value['password']!)
      .catch((error: any) => {
        switch (error.code) {
          case 'auth/invalid-email':
            console.log('auth/invalid-email');
            this.emailError = 'Invalid email';
            this.errorVisibility.email = true;
            break;
          case 'auth/user-not-found':
            this.emailError = 'User not found';
            this.errorVisibility.email = true;
            break;
          case 'auth/wrong-password':
            this.passwordError = 'Invalid password';
            this.errorVisibility.password = true;
            break;
          default:
            console.log('Un ocurrió error durante el inicio de sesión', error);
            break;
        }
      });
  }


  public register() { // Function to handle register form submission
    this.registerEmailError = '';
    this.repeatPasswordError = '';
    this.registerErrorVisibility = {
      email: false,
      password: false,
      repeatPassword: false
    };


    this.userService.register(this.registerForm.value['email']!, this.registerForm.value['password']!)
      .catch((error: any) => {
        switch (error.code) {
          case 'auth/invalid-email':
            this.registerEmailError = 'Invalid email.';
            this.registerErrorVisibility.email = true;
            break;
          case 'auth/email-already-in-use':
            this.registerEmailError = 'This email is already used.';
            this.registerErrorVisibility.email = true;
            break;
          case 'auth/weak-password':
            this.registerPasswordError = 'Weak password, the password must have at least 6 characters.';
            this.registerErrorVisibility.password = true;
            break;
          case 'auth/missing-password':
            this.registerPasswordError = 'Missing password.';
            this.registerErrorVisibility.password = true;
            break;
          default:
            console.log('Ocurrió un error durante el registro', error);
            break;
        }
      });
  }

  public loginWithGoogle(){
    this.userService.loginWithGoogle()
    .catch((error: any) => {
      console.log(error)
    })
  }
}