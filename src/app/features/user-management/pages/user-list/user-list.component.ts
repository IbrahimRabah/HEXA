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
import { AvatarModule } from 'primeng/avatar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, AvatarModule, PageHeaderComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';

  private userService = inject(UserService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.userService.getUsers().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(u =>
      u.fullName?.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
    );
  }

  toggleActive(u: any) {
    this.userService.toggleActive(u.id).subscribe(() => {
      u.isActive = !u.isActive;
      this.toastService.showInfo('Updated', `${u.fullName} is now ${u.isActive ? 'active' : 'inactive'}.`);
    });
  }
}
