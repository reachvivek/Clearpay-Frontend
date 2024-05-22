import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const isLoggedIn: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token');
  let verifyToken = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
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
