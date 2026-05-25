import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { MenuItem } from 'primeng/api';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

const ROLE_COLORS: Record<string, string> = {
  Admin:           '#2563eb',
  Reception:       '#7c3aed',
  Nurse:           '#db2777',
  Doctor:          '#0d9488',
  'Lab Technician':'#d97706',
  Pharmacist:      '#16a34a',
  Accountant:      '#dc2626',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule, PopoverModule, TranslatePipe],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('userMenu') userMenu!: Menu;
  @ViewChild('notifPanel') notifPanel!: Popover;

  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  readonly langService = inject(LanguageService);
  private translate = inject(TranslateService);

  readonly currentUser = this.authService.currentUser;
  readonly isDark = this.themeService.isDark;

  notifications = [
    { icon: 'pi-calendar',             color: '#2563eb', title: 'New appointment scheduled', body: 'Dr. Smith — Room 204',          time: '2 min ago',  read: false },
    { icon: 'pi-flask',                color: '#d97706', title: 'Lab result ready',           body: 'Patient: Ahmed Hassan',         time: '18 min ago', read: false },
    { icon: 'pi-exclamation-triangle', color: '#ef4444', title: 'Critical stock alert',       body: 'Pharmacy: Amoxicillin low',     time: '1 hr ago',   read: false },
    { icon: 'pi-check-circle',         color: '#16a34a', title: 'Surgery completed',          body: 'OR-2 — Patient discharged',     time: '3 hrs ago',  read: true  },
  ];

  get unreadCount() { return this.notifications.filter(n => !n.read).length; }

  toggleNotifPanel(e: Event) { this.notifPanel.toggle(e); }
  markAllRead() { this.notifications.forEach(n => (n.read = true)); }

  get userMenuItems(): MenuItem[] {
    return [
      {
        label: this.translate.instant('USER_MENU.MY_PROFILE'),
        icon: 'pi pi-user',
      },
      {
        label: this.translate.instant('USER_MENU.SETTINGS'),
        icon: 'pi pi-cog',
        routerLink: '/settings',
      },
      { separator: true },
      {
        label: this.translate.instant('USER_MENU.SIGN_OUT'),
        icon: 'pi pi-sign-out',
        styleClass: 'danger-item',
        command: () => this.authService.logout(),
      },
    ];
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.langService.toggle();
  }

  getUserInitials(): string {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getRoleColor(): string {
    return ROLE_COLORS[this.currentUser()?.role ?? ''] ?? '#64748b';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }
}

