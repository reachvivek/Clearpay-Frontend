import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  private token: string | undefined;
  public showLoader = false;
  public otpForm = {
    otp: '',
  };
  public otpLength: number = 6;

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
    if (!this.otpForm.otp) {
      return;
    }
  };

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }

  submitCode() {
    console.log(this.otpForm.otp);
    this.router.navigate(['/dashboard']);
  }
}
