import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private token: string | undefined;
  public passwordType = true;
  public showLoader = false;
  public loginForm = {
    email: '',
    password: '',
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
    if (!this.loginForm.email || !this.loginForm.password) {
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
