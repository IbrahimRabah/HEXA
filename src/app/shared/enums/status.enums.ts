export enum AppointmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  CheckedIn = 'CheckedIn',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export enum VisitStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  ReadyForDoctor = 'ReadyForDoctor',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Closed = 'Closed',
  Referred = 'Referred'
}

export enum LabRequestStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  ResultReady = 'ResultReady',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum RadiologyRequestStatus {
  Pending = 'Pending',
  Scheduled = 'Scheduled',
  Imaging = 'Imaging',
  ResultReady = 'ResultReady',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Issued = 'Issued',
  PartiallyPaid = 'PartiallyPaid',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum RoomStatus {
  Available = 'Available',
  Occupied = 'Occupied',
  Cleaning = 'Cleaning',
  Sanitizing = 'Sanitizing',
  UnderMaintenance = 'UnderMaintenance',
  OutOfService = 'OutOfService'
}

export enum MaintenanceTicketStatus {
  Open = 'Open',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Fixed = 'Fixed',
  Closed = 'Closed',
  Reopened = 'Reopened'
}

export enum OperationStatus {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  PostOp = 'PostOp'
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}
