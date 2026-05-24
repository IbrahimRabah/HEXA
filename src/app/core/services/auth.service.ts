import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  email: string;
}

interface MockUser extends User {
  password: string;
}

export interface TestCredential {
  username: string;
  password: string;
  role: string;
  name: string;
}

export const TEST_CREDENTIALS: TestCredential[] = [
  { username: 'admin',       password: 'admin123',       role: 'Admin',            name: 'Dr. Ibrahim Rabah'  },
  { username: 'reception',   password: 'reception123',   role: 'Reception',        name: 'Sara Al-Rashid'    },
  { username: 'nurse',       password: 'nurse123',       role: 'Nurse',            name: 'Nour Ibrahim'      },
  { username: 'doctor',      password: 'doctor123',      role: 'Doctor',           name: 'Dr. Khalid Omar'   },
  { username: 'labtech',     password: 'labtech123',     role: 'Lab Technician',   name: 'Mohamed Ali'       },
  { username: 'pharmacist',  password: 'pharma123',      role: 'Pharmacist',       name: 'Fatima Zahra'      },
  { username: 'accountant',  password: 'account123',     role: 'Accountant',       name: 'Hassan Mahmoud'    },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly MOCK_USERS: MockUser[] = [
    { id: 1, username: 'admin',      password: 'admin123',     name: 'Dr. Ibrahim Rabah', role: 'Admin',          email: 'admin@hexacare.com'       },
    { id: 2, username: 'reception',  password: 'reception123', name: 'Sara Al-Rashid',   role: 'Reception',      email: 'reception@hexacare.com'   },
    { id: 3, username: 'nurse',      password: 'nurse123',     name: 'Nour Ibrahim',     role: 'Nurse',          email: 'nurse@hexacare.com'       },
    { id: 4, username: 'doctor',     password: 'doctor123',    name: 'Dr. Khalid Omar',  role: 'Doctor',         email: 'doctor@hexacare.com'      },
    { id: 5, username: 'labtech',    password: 'labtech123',   name: 'Mohamed Ali',      role: 'Lab Technician', email: 'lab@hexacare.com'         },
    { id: 6, username: 'pharmacist', password: 'pharma123',    name: 'Fatima Zahra',     role: 'Pharmacist',     email: 'pharmacy@hexacare.com'    },
    { id: 7, username: 'accountant', password: 'account123',   name: 'Hassan Mahmoud',   role: 'Accountant',     email: 'billing@hexacare.com'     },
  ];

  private currentUserSignal = signal<User | null>(this.loadFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  private loadFromStorage(): User | null {
    try {
      const stored = localStorage.getItem('hexa_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  login(username: string, password: string): boolean {
    const found = this.MOCK_USERS.find(
      u => u.username === username && u.password === password,
    );
    if (found) {
      const { password: _pw, ...userWithoutPassword } = found;
      this.currentUserSignal.set(userWithoutPassword);
      localStorage.setItem('hexa_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('hexa_user');
    this.router.navigate(['/login']);
  }
}
