export interface User {
  id?: number;
  email: string;
  password?: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  firstName: string;
  lastName: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}
