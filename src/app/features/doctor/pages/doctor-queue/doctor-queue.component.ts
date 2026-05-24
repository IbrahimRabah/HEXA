import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { DoctorService } from '../../services/doctor.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Visit } from '../../../../shared/models/visit.model';
import { VisitStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-doctor-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, TooltipModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './doctor-queue.component.html',
  styleUrl: './doctor-queue.component.css'
})
export class DoctorQueueComponent implements OnInit {
  queue: Visit[] = [];
  loading = false;

  get waitingCount() { return this.queue.filter(v => v.status === VisitStatus.ReadyForDoctor).length; }
  get inProgressCount() { return this.queue.filter(v => v.status === VisitStatus.InProgress).length; }
  get completedCount() { return this.queue.filter(v => v.status === VisitStatus.Completed).length; }

  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.doctorService.getDoctorQueue().subscribe(data => {
      this.queue = data;
      this.loading = false;
    });
  }

  openConsultation(v: Visit) {
    this.router.navigate(['/doctor/consultation', v.id]);
  }

  markComplete(v: Visit) {
    this.doctorService.updateStatus(v.id, VisitStatus.Completed).subscribe(() => {
      v.status = VisitStatus.Completed;
      this.toastService.showSuccess('Completed', `Consultation for ${v.patientName} marked as complete.`);
    });
  }
}

