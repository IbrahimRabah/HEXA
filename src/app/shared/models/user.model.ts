import { BaseEntity } from './base.model';

export interface Permission {
  id: string;
  name: string;
  module: string;
  action: 'Read' | 'Write' | 'Delete' | 'Admin';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}
