import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ADMIN_ROLE, ROLE_NAV_ACCESS } from '../../../shared/constants/role-nav-access';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const ALL_NAV_SECTIONS: NavSection[] = [
  {
    label: 'NAV.SECTIONS.CORE',
    items: [
      { label: 'NAV.DASHBOARD',    icon: 'pi pi-home',         route: '/dashboard'       },
    ],
  },
  {
    label: 'NAV.SECTIONS.PATIENT_CARE',
    items: [
      { label: 'NAV.PATIENTS',     icon: 'pi pi-users',        route: '/patients'        },
      { label: 'NAV.APPOINTMENTS', icon: 'pi pi-calendar',     route: '/appointments'    },
    ],
  },
  {
    label: 'NAV.SECTIONS.CLINICAL',
    items: [
      { label: 'NAV.RECEPTION',    icon: 'pi pi-desktop',      route: '/reception'       },
      { label: 'NAV.NURSING',      icon: 'pi pi-heart',        route: '/nursing'         },
      { label: 'NAV.DOCTOR',       icon: 'pi pi-user',         route: '/doctor'          },
      { label: 'NAV.LABORATORY',   icon: 'pi pi-filter',       route: '/laboratory'      },
      { label: 'NAV.RADIOLOGY',    icon: 'pi pi-camera',       route: '/radiology'       },
      { label: 'NAV.PHARMACY',     icon: 'pi pi-shop',         route: '/pharmacy'        },
      { label: 'NAV.BILLING',      icon: 'pi pi-dollar',       route: '/billing'         },
    ],
  },
  {
    label: 'NAV.SECTIONS.HOSPITAL',
    items: [
      { label: 'NAV.OPERATIONS',   icon: 'pi pi-cog',          route: '/operations'      },
      { label: 'NAV.ADMISSIONS',   icon: 'pi pi-id-card',      route: '/admissions'      },
      { label: 'NAV.ROOMS',        icon: 'pi pi-box',          route: '/rooms'           },
      { label: 'NAV.HOUSEKEEPING', icon: 'pi pi-wrench',       route: '/housekeeping'    },
    ],
  },
  {
    label: 'NAV.SECTIONS.SPECIALTIES',
    items: [
      { label: 'NAV.OPHTHALMOLOGY',icon: 'pi pi-eye',          route: '/ophthalmology'   },
      { label: 'NAV.DENTAL',       icon: 'pi pi-star',         route: '/dental'          },
    ],
  },
  {
    label: 'NAV.SECTIONS.ADMINISTRATION',
    items: [
      { label: 'NAV.AUDIT',        icon: 'pi pi-shield',       route: '/audit'           },
      { label: 'NAV.REPORTS',      icon: 'pi pi-chart-bar',    route: '/reports'         },
      { label: 'NAV.SETTINGS',     icon: 'pi pi-sliders-h',    route: '/settings'        },
      { label: 'NAV.USERS',        icon: 'pi pi-users',        route: '/user-management' },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  private authService = inject(AuthService);

  /** Sections filtered by the current user's role. Admin always sees all. */
  readonly visibleSections = computed<NavSection[]>(() => {
    const role = this.authService.currentUser()?.role;
    if (!role) return [];
    if (role === ADMIN_ROLE) return ALL_NAV_SECTIONS;

    return ALL_NAV_SECTIONS
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          const allowed = ROLE_NAV_ACCESS[item.route];
          // allowed === undefined → not listed → hidden from non-admin
          // allowed === [] → visible to all authenticated users
          if (!allowed) return false;
          if (allowed.length === 0) return true;
          return allowed.includes(role);
        }),
      }))
      .filter(section => section.items.length > 0);
  });
}
