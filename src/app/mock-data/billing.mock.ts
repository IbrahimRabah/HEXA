import { InvoiceStatus } from '../shared/enums/status.enums';

export const BILLING_MOCK = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2023-001',
    patientId: 'pat-001',
    patientName: 'John Doe',
    subtotal: 150,
    discount: 0,
    tax: 15,
    total: 165,
    paidAmount: 165,
    balanceDue: 0,
    status: InvoiceStatus.Paid,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys',
    items: []
  }
];
