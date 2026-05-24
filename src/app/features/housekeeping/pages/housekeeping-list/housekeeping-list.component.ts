import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { HousekeepingService } from '../../services/housekeeping.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-housekeeping-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, TagModule, PageHeaderComponent, StatusTagComponent, TaskFormComponent],
  templateUrl: './housekeeping-list.component.html',
  styleUrl: './housekeeping-list.component.css'
})
export class HousekeepingListComponent implements OnInit {
  tasks: any[] = [];
  loading = false;
  showTaskForm = false;

  onTaskSaved(t: any) {
    this.tasks.unshift(t);
  }

  private hkService = inject(HousekeepingService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.hkService.getTasks().subscribe(data => {
      this.tasks = data;
      this.loading = false;
    });
  }

  complete(t: any) {
    this.hkService.complete(t.id).subscribe(() => {
      t.status = 'Completed';
      this.toastService.showSuccess('Done', `Task for room ${t.roomNumber} completed.`);
    });
  }
}
