import { BaseEntity } from './base.model';

export interface AuditLog extends BaseEntity {
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  description: string;
}
