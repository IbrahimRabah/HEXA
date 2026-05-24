import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { RoomFormComponent } from '../room-form/room-form.component';
import { RoomsService } from '../../services/rooms.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RoomStatus } from '../../../../shared/enums/status.enums';

const STATUS_COLOR: Record<string, string> = {
  Available: '#43A047',
  Occupied: '#E53935',
  Cleaning: '#FB8C00',
  Sanitizing: '#8E24AA',
  UnderMaintenance: '#757575',
  OutOfService: '#212121',
};

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, ButtonModule, SelectModule, TagModule, TranslatePipe, PageHeaderComponent, RoomFormComponent],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  selectedWard: string | null = null;
  showRoomForm = false;
  wardOptions: any[] = [];

  legendEntries = Object.values(RoomStatus).map(s => ({ status: s, color: STATUS_COLOR[s] || '#999' }));

  onRoomSaved(room: any) {
    this.all.unshift(room);
    this.applyFilters();
  }

  private roomsService = inject(RoomsService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.roomsService.getRooms().subscribe(data => {
      this.all = data;
      this.filtered = data;
      const wards = [...new Set(data.map((r: any) => r.wardName))];
      this.wardOptions = [{ label: 'All Wards', value: null }, ...wards.map(w => ({ label: w, value: w }))];
    });
  }

  getColor(status: string) { return STATUS_COLOR[status] || '#999'; }
  countByStatus(status: string) { return this.all.filter(r => r.status === status).length; }

  applyFilters() {
    this.filtered = !this.selectedWard ? this.all : this.all.filter(r => r.wardName === this.selectedWard);
  }

  markAvailable(room: any) {
    this.roomsService.updateStatus(room.id, RoomStatus.Available).subscribe(() => {
      room.status = RoomStatus.Available;
      this.toastService.showSuccess('Updated', `Room ${room.roomNumber} is now available.`);
    });
  }

  setStatus(room: any, status: string) {
    this.roomsService.updateStatus(room.id, status as RoomStatus).subscribe(() => {
      room.status = status;
    });
  }
}
