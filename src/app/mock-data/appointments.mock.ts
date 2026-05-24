import { Appointment } from '../shared/models/appointment.model';
import { AppointmentStatus } from '../shared/enums/status.enums';

const today = new Date();

export const APPOINTMENTS_MOCK: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'John Doe',
    doctorId: 'doc-001',
    doctorName: 'Dr. Sarah Wilson',
    specialtyId: 'sp-001',
    specialtyName: 'Cardiology',
    appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    startTime: '09:00',
    endTime: '09:30',
    status: AppointmentStatus.Confirmed,
    type: 'FollowUp',
    reason: 'Routine checkup',
    reminderSent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  },
  {
    id: 'apt-002',
    patientId: 'pat-002',
    patientName: 'Alice Smith',
    doctorId: 'doc-003',
    doctorName: 'Dr. Emily Davis',
    specialtyId: 'sp-003',
    specialtyName: 'Pediatrics',
    appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    startTime: '10:00',
    endTime: '10:30',
    status: AppointmentStatus.CheckedIn,
    type: 'New',
    reason: 'Fever and cough',
    reminderSent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  },
  {
    id: 'apt-003',
    patientId: 'pat-003',
    patientName: 'Michael Johnson',
    doctorId: 'doc-002',
    doctorName: 'Dr. James Brown',
    specialtyId: 'sp-002',
    specialtyName: 'Neurology',
    appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
    startTime: '14:00',
    endTime: '14:45',
    status: AppointmentStatus.Pending,
    type: 'FollowUp',
    reason: 'Migraine follow up',
    reminderSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  }
];
