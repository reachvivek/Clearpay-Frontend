import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const isLoggedIn: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router service

  let token = localStorage.getItem('token');
  let verifyToken = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode(token);

      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }

      // Check if 45 days have passed since the password was last changed
      const passwordLastChanged = new Date(decodedToken.passwordLastChanged);
      const today = new Date();
      const daysSincePasswordChange = Math.floor(
        (today.getTime() - passwordLastChanged.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysSincePasswordChange > 45) {
        // console.log(daysSincePasswordChange, passwordLastChanged, today);
        localStorage.setItem('employeeToken', token);
        localStorage.removeItem('token');
        router.navigate(['auth/set-password']);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error verifying error: ', err);
      return false;
    }
  };
  return verifyToken(token!);
};
