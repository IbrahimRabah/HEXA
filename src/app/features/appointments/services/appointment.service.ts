import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { APPOINTMENTS_MOCK } from '../../../mock-data/appointments.mock';
import { Appointment } from '../../../shared/models/appointment.model';
import { AppointmentStatus } from '../../../shared/enums/status.enums';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [...APPOINTMENTS_MOCK];

  getAppointments(): Observable<Appointment[]> {
    return of(this.appointments);
  }

  getAppointmentById(id: string): Observable<Appointment | undefined> {
    return of(this.appointments.find(a => a.id === id));
  }

  getTodayAppointments(): Observable<Appointment[]> {
    const todayStr = new Date().toDateString();
    return of(this.appointments.filter(a => new Date(a.appointmentDate).toDateString() === todayStr));
  }

  createAppointment(payload: Partial<Appointment>): Observable<Appointment> {
    const newApt: Appointment = {
      id: 'apt-' + Date.now(),
      patientId: payload.patientId!,
      patientName: payload.patientName!,
      doctorId: payload.doctorId!,
      doctorName: payload.doctorName!,
      specialtyId: payload.specialtyId || '',
      specialtyName: payload.specialtyName || '',
      appointmentDate: payload.appointmentDate!,
      startTime: payload.startTime!,
      endTime: payload.endTime || '',
      status: AppointmentStatus.Pending,
      type: payload.type || 'New',
      reason: payload.reason,
      notes: payload.notes,
      reminderSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      updatedBy: 'current-user'
    };
    this.appointments.unshift(newApt);
    return of(newApt);
  }

  updateAppointment(id: string, payload: Partial<Appointment>): Observable<Appointment> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...payload, updatedAt: new Date() };
    }
    return of(this.appointments[index]);
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<Appointment> {
    return this.updateAppointment(id, { status });
  }

  deleteAppointment(id: string): Observable<void> {
    this.appointments = this.appointments.filter(a => a.id !== id);
    return of(undefined);
  }
}

