import { BaseEntity } from './base.model';
import { OperationStatus } from '../enums/status.enums';

export interface Operation extends BaseEntity {
  patientId: string;
  patientName: string;
  visitId?: string;
  diagnosisDescription: string;
  procedureName: string;
  surgeonId: string;
  surgeonName: string;
  anesthesiologistId?: string;
  anesthesiologistName?: string;
  assistants: string[];
  anesthesiaType?: string;
  scheduledDate: Date;
  scheduledTime: string;
  estimatedDuration: number;
  operationRoomId: string;
  operationRoomName: string;
  equipmentRequired: string[];
  status: OperationStatus;
  preOpNotes?: string;
  intraOpNotes?: string;
  postOpNotes?: string;
  complications?: string;
  outcome?: string;
}
