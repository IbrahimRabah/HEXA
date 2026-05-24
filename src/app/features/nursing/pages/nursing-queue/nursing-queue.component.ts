import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { NursingService } from '../../services/nursing.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NursingAssessment } from '../../../../shared/models/nursing.model';

@Component({
  selector: 'app-nursing-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, TooltipModule, CardModule, PageHeaderComponent, StatusTagComponent, TranslatePipe],
  templateUrl: './nursing-queue.component.html',
  styleUrl: './nursing-queue.component.css'
})
export class NursingQueueComponent implements OnInit {
  assessments: NursingAssessment[] = [];
  loading = false;

  get waitingCount() { return this.assessments.filter(a => a.status === 'Waiting').length; }
  get assessingCount() { return this.assessments.filter(a => a.status === 'UnderAssessment').length; }
  get readyCount() { return this.assessments.filter(a => a.status === 'ReadyForDoctor').length; }

  private nursingService = inject(NursingService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.nursingService.getNursingAssessments().subscribe(data => {
      this.assessments = data;
      this.loading = false;
    });
  }

  recordVitals(a: NursingAssessment) {
    this.router.navigate(['/nursing/vitals', a.visitId]);
  }

  markReady(a: NursingAssessment) {
    this.nursingService.updateStatus(a.id, 'ReadyForDoctor').subscribe(() => {
      a.status = 'ReadyForDoctor';
      this.toastService.showSuccess('Updated', `${a.patientName} is ready for the doctor.`);
    });
  }
}

