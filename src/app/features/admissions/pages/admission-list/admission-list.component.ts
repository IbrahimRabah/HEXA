import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { AdmissionFormComponent } from '../admission-form/admission-form.component';
import { AdmissionService } from '../../services/admission.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, IconFieldModule, InputIconModule, PageHeaderComponent, StatusTagComponent, AdmissionFormComponent],
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.css'
})
export class AdmissionListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  showAdmForm = false;

  onAdmSaved(a: any) {
    this.all.unshift(a);
    this.applyFilters();
  }

  private admissionService = inject(AdmissionService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.admissionService.getAdmissions().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(a =>
      a.patientName?.toLowerCase().includes(s) || a.roomNumber?.toLowerCase().includes(s) || a.admissionNumber?.toLowerCase().includes(s)
    );
  }
}
