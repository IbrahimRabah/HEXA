import { RoomStatus } from '../shared/enums/status.enums';

export const ADMISSIONS_MOCK = [
  {
    id: 'adm-001', admissionNumber: 'ADM-2024-001',
    patientId: 'pat-003', patientName: 'Michael Johnson',
    admittingDoctorId: 'doc-005', admittingDoctorName: 'Dr. William Garcia',
    roomId: 'room-01', roomNumber: '101', wardName: 'Surgical Ward',
    admissionDate: new Date(), expectedDischarge: new Date(Date.now() + 3 * 86400000),
    diagnosis: 'Appendicitis', status: 'Active',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys'
  }
];

export const ROOMS_MOCK = [
  { id: 'room-01', roomNumber: '101', wardName: 'Surgical Ward', type: 'Single', floor: '1', status: RoomStatus.Occupied, dailyRate: 500, capacity: 1, currentOccupancy: 1, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'room-02', roomNumber: '102', wardName: 'Surgical Ward', type: 'Single', floor: '1', status: RoomStatus.Available, dailyRate: 500, capacity: 1, currentOccupancy: 0, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'room-03', roomNumber: '201', wardName: 'Medical Ward', type: 'Double', floor: '2', status: RoomStatus.Cleaning, dailyRate: 300, capacity: 2, currentOccupancy: 0, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'room-04', roomNumber: '202', wardName: 'Medical Ward', type: 'Double', floor: '2', status: RoomStatus.Available, dailyRate: 300, capacity: 2, currentOccupancy: 1, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'room-05', roomNumber: '301', wardName: 'ICU', type: 'ICU', floor: '3', status: RoomStatus.Occupied, dailyRate: 2000, capacity: 1, currentOccupancy: 1, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'room-06', roomNumber: '302', wardName: 'ICU', type: 'ICU', floor: '3', status: RoomStatus.Available, dailyRate: 2000, capacity: 1, currentOccupancy: 0, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
];
