import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    label: 'Core',
    items: [
      { label: 'Dashboard',    icon: 'pi pi-home',         route: '/dashboard'       },
    ],
  },
  {
    label: 'Patient Care',
    items: [
      { label: 'Patients',     icon: 'pi pi-users',        route: '/patients'        },
      { label: 'Appointments', icon: 'pi pi-calendar',     route: '/appointments'    },
    ],
  },
  {
    label: 'Clinical',
    items: [
      { label: 'Reception',    icon: 'pi pi-desktop',      route: '/reception'       },
      { label: 'Nursing',      icon: 'pi pi-heart',        route: '/nursing'         },
      { label: 'Doctor',       icon: 'pi pi-user',         route: '/doctor'          },
      { label: 'Laboratory',   icon: 'pi pi-filter',       route: '/laboratory'      },
      { label: 'Radiology',    icon: 'pi pi-camera',       route: '/radiology'       },
      { label: 'Pharmacy',     icon: 'pi pi-shop',         route: '/pharmacy'        },
      { label: 'Billing',      icon: 'pi pi-dollar',       route: '/billing'         },
    ],
  },
  {
    label: 'Hospital',
    items: [
      { label: 'Operations',   icon: 'pi pi-cog',          route: '/operations'      },
      { label: 'Admissions',   icon: 'pi pi-id-card',      route: '/admissions'      },
      { label: 'Rooms',        icon: 'pi pi-box',          route: '/rooms'           },
      { label: 'Housekeeping', icon: 'pi pi-wrench',       route: '/housekeeping'    },
    ],
  },
  {
    label: 'Specialties',
    items: [
      { label: 'Ophthalmology',icon: 'pi pi-eye',          route: '/ophthalmology'   },
      { label: 'Dental',       icon: 'pi pi-star',         route: '/dental'          },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Audit',        icon: 'pi pi-shield',       route: '/audit'           },
      { label: 'Reports',      icon: 'pi pi-chart-bar',    route: '/reports'         },
      { label: 'Settings',     icon: 'pi pi-sliders-h',    route: '/settings'        },
      { label: 'Users',        icon: 'pi pi-users',        route: '/user-management' },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
