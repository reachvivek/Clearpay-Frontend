export interface User {
  UserId?: number;
  EmpCode?: string;
  EmpName?: string;
  EmpRoleID?: number;
  Active?: number;
  CreatedOn?: Date;
  CreatedBy?: number;
  ModifiedDate?: Date | null;
  ModifiedBy?: number | null;
  EmpEmail?: string;
  EmpMobNo?: string;
  EmpPassword?: string;
  EmpOldPassword?: string;
  EmpOldPassword_1?: string;
  EmpOldPassword_2?: string;
  LoginAttempt?: number | null;
  LockoutStartDate?: Date | null;
  LastLoginDate?: Date | null;
  SetInactiveDate?: Date | null;
  NewPassCreateDate?: Date | null;
  PassExpireDate?: Date | null;
}
