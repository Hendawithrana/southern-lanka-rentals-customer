import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'slr-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page slr-container">
      <div class="auth-page__card slr-card">
        <h2>Create your account</h2>
        <p class="auth-page__sub">Book bikes, scooters and cars across Southern Sri Lanka.</p>

        <div class="slr-field">
          <label for="full-name">Full name</label>
          <input id="full-name" type="text" [(ngModel)]="fullName" />
        </div>
        <div class="slr-field">
          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="email" />
        </div>
        <div class="slr-field">
          <label for="phone">Phone</label>
          <input id="phone" type="tel" [(ngModel)]="phone" />
        </div>
        <div class="slr-field">
          <label for="password">Password</label>
          <input id="password" type="password" [(ngModel)]="password" />
        </div>

        @if (error()) {
          <p class="auth-page__error">{{ error() }}</p>
        }

        <button class="slr-btn slr-btn--primary slr-btn--block" [disabled]="loading()" (click)="submit()">
          {{ loading() ? 'Creating account…' : 'Create account' }}
        </button>

        <p class="auth-page__footnote">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; justify-content: center; padding: var(--space-8) 0; }
    .auth-page__card { width: 100%; max-width: 400px; padding: var(--space-6); }
    .auth-page__sub { margin-bottom: var(--space-5); }
    .auth-page__error { color: var(--color-danger); font-size: 0.88rem; margin-bottom: var(--space-3); }
    .auth-page__footnote { text-align: center; font-size: 0.85rem; margin-top: var(--space-5); }
    .auth-page__footnote a { color: var(--color-primary); font-weight: 600; }
  `],
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth
      .registerCustomer({ fullName: this.fullName, email: this.email, phone: this.phone, password: this.password })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message ?? 'Could not create your account. Please try again.');
        },
      });
  }
}
