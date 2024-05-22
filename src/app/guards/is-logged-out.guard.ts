import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const isLoggedOutGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token');
  let verifyToken = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error verifying token: ', err);
      return true;
    }
  };
  if (!token) {
    return true;
  } else {
    return verifyToken(token!);
  }
};
