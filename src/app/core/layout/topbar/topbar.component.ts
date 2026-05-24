import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
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
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule, TranslatePipe],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('userMenu') userMenu!: Menu;

  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  readonly langService = inject(LanguageService);
  private translate = inject(TranslateService);

  readonly currentUser = this.authService.currentUser;
  readonly isDark = this.themeService.isDark;

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

