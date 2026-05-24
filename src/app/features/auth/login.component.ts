import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, TEST_CREDENTIALS } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly testCredentials = TEST_CREDENTIALS;
  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly showTestUsers = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleTestUsers(): void {
    this.showTestUsers.update(v => !v);
  }

  fillCredentials(username: string, password: string): void {
    this.loginForm.patchValue({ username, password });
    this.showTestUsers.set(false);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    const { username, password } = this.loginForm.value;
    // Simulate async delay for UX polish
    setTimeout(() => {
      const success = this.authService.login(username!, password!);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Invalid username or password. Please check your credentials.');
        this.isLoading.set(false);
      }
    }, 600);
  }
}
