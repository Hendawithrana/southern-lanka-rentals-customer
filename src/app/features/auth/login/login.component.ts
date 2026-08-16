import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VENDOR_APP_URL } from '../../../core/services/app-links';

@Component({
  selector: 'slr-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page slr-container">
      <div class="auth-page__card slr-card">
        <h2>Log in</h2>
        <p class="auth-page__sub">Welcome back — manage your bookings and account.</p>

        <div class="slr-field">
          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="email" />
        </div>
        <div class="slr-field">
          <label for="password">Password</label>
          <input id="password" type="password" [(ngModel)]="password" />
        </div>

        @if (error()) {
          <p class="auth-page__error">{{ error() }}</p>
        }

        <button class="slr-btn slr-btn--primary slr-btn--block" [disabled]="loading()" (click)="submit()">
          {{ loading() ? 'Logging in…' : 'Log in' }}
        </button>

        <p class="auth-page__footnote">
          New here? <a routerLink="/register">Create an account</a> ·
          <a [href]="vendorAppUrl + '/register'">List your business</a>
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
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);
  vendorAppUrl = VENDOR_APP_URL;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.auth.role() === 'VENDOR') {
          // This account is a vendor - this app is customer-only, so send them
          // to the vendor portal instead of stranding them on a site with no
          // vendor routes.
          this.auth.logout();
          window.location.href = `${this.vendorAppUrl}/login`;
          return;
        }
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
        this.router.navigateByUrl(redirectTo || '/');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password.');
      },
    });
  }
}
