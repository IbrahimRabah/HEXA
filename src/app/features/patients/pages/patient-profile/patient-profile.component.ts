import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TabsModule, TagModule,
    ButtonModule, BadgeModule, DividerModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | null = null;
  loading = true;

  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatientById(id).subscribe(p => {
      this.patient = p || null;
      this.loading = false;
    });
  }
}
