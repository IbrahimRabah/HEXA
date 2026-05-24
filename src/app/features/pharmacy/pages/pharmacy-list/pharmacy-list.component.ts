import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MedicationFormComponent } from '../medication-form/medication-form.component';
import { PharmacyService } from '../../services/pharmacy.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-pharmacy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, MedicationFormComponent],
  templateUrl: './pharmacy-list.component.html',
  styleUrl: './pharmacy-list.component.css'
})
export class PharmacyListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  showMedForm = false;

  private pharmacyService = inject(PharmacyService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.pharmacyService.getMedications().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  onMedSaved(med: any) {
    this.all.unshift(med);
    this.applyFilters();
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(m =>
      m.name?.toLowerCase().includes(s) || m.genericName?.toLowerCase().includes(s) || m.category?.toLowerCase().includes(s)
    );
  }
}
