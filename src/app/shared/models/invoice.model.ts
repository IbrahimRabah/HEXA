import { BaseEntity } from './base.model';
import { InvoiceStatus } from '../enums/status.enums';

export interface InvoiceItem {
  description: string;
  category: 'Consultation' | 'Lab' | 'Radiology' | 'Medication' | 'Operation' | 'Admission' | 'Other';
  quantity: number;
  unitPrice: number;
  total: number;
  referenceId?: string;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  visitId?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: Date;
  notes?: string;
}

export interface Payment extends BaseEntity {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  method: 'Cash' | 'Card' | 'Online' | 'Insurance';
  referenceNumber?: string;
  paymentDate: Date;
  notes?: string;
}
