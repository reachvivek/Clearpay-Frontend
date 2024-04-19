import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss',
})
export class SetPasswordComponent {
  public showLoader = false;

  isInputFocusedOrTyped: boolean = false;
  private token: string | undefined;
  public newPassword: string = '';
  public confirmPassword: string = '';
  public newPasswordType = true;
  public confirmPasswordType = true;
  public showConfirmPasswordError = false;

  public isPasswordFocused = false;
  public hasUppercase = false;
  public hasLowercase = false;
  public hasSpecialCharacter = false;
  public hasMinLength = false;

  constructor(
    // private authService: AuthService,
    private router: Router // private _matSnackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/user']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  showPasswordRules() {
    this.isPasswordFocused = true;
    this.isInputFocusedOrTyped = true;
  }

  hidePasswordRules() {
    this.isPasswordFocused = false;
    this.onInputBlur();
  }

  updatePasswordRules() {
    this.hasUppercase = /[A-Z]/.test(this.newPassword!);
    this.hasLowercase = /[a-z]/.test(this.newPassword!);
    this.hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      this.newPassword!
    );
    this.hasMinLength = this.newPassword!.length >= 8;
  }

  onSubmit = async () => {
    // console.log(this.loginForm)
    this.showLoader = true;
    if (!this.newPassword || !this.confirmPassword) {
      return;
    }
  };

  checkForm() {
    if (
      this.newPassword !== this.confirmPassword ||
      this.newPassword.length < 8 ||
      this.confirmPassword.length < 8
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
