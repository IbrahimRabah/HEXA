import { BaseEntity } from './base.model';
import { MaintenanceTicketStatus, Priority } from '../enums/status.enums';

export interface HousekeepingTask extends BaseEntity {
  roomId: string;
  roomNumber: string;
  taskType: 'Cleaning' | 'Sanitizing' | 'DeepCleaning';
  assignedTo?: string;
  assignedToName?: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Verified';
  priority: Priority;
  scheduledDate: Date;
  completedAt?: Date;
  notes?: string;
}

export interface MaintenanceTicket extends BaseEntity {
  roomId?: string;
  roomNumber?: string;
  location: string;
  description: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Equipment' | 'Other';
  assignedTo?: string;
  assignedToName?: string;
  status: MaintenanceTicketStatus;
  priority: Priority;
  reportedBy: string;
  slaDeadline?: Date;
  resolvedAt?: Date;
  resolutionNotes?: string;
}
