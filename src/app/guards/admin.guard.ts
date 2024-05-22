import { CanActivateFn } from '@angular/router';
import { UserSyncService } from '../services/user-sync.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const userSyncService = inject(UserSyncService);
  userSyncService.checkUserPrivileges();
  const isAdmin = userSyncService.isAdmin$;

  return isAdmin;
};
