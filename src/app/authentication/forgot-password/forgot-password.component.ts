import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private token: string | undefined;
  public passwordType = true;
  public showLoader = false;
  public forgotPasswordForm = {
    email: '',
  };

  isInputFocusedOrTyped: boolean = false;

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

  onSubmit = async () => {
    // console.log(this.loginForm)
    this.showLoader = true;
    if (!this.forgotPasswordForm.email) {
      return;
    }
  };

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
