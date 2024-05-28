export * from './admin.service';
import { AdminService } from './admin.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './databaseManagement.service';
import { DatabaseManagementService } from './databaseManagement.service';
export * from './invoice.service';
import { InvoiceService } from './invoice.service';
export * from './lho.service';
import { LhoService } from './lho.service';
export const APIS = [AdminService, AuthService, DatabaseManagementService, InvoiceService, LhoService];
