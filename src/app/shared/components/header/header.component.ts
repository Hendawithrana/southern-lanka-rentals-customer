import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VENDOR_APP_URL } from '../../../core/services/app-links';

@Component({
  selector: 'slr-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="slr-header">
      <div class="slr-container slr-header__inner">
        <a routerLink="/" class="slr-header__brand">
          <span class="slr-header__mark">SL</span>
          <span class="slr-header__brand-text">Southern Lanka Rentals</span>
        </a>

        <nav class="slr-header__nav">
          <a routerLink="/rentals/search">Browse rentals</a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/bookings">My bookings</a>
          }
          <a [href]="vendorAppUrl + '/register'" class="slr-header__vendor-link">List your business — free</a>
        </nav>

        <div class="slr-header__actions">
          @if (auth.isAuthenticated()) {
            <span class="slr-header__hello">Hi, {{ auth.fullName() }}</span>
            <button class="slr-btn slr-btn--ghost slr-header__btn" (click)="auth.logout()">Log out</button>
          } @else {
            <a routerLink="/login" class="slr-btn slr-btn--ghost slr-header__btn">Log in</a>
            <a routerLink="/register" class="slr-btn slr-btn--primary slr-header__btn">Sign up</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .slr-header {
      position: sticky;
      top: 0;
      z-index: 40;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-line);
    }
    .slr-header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-5);
      height: 72px;
    }
    .slr-header__brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.15rem;
      color: var(--color-primary-dark);
      white-space: nowrap;
    }
    .slr-header__mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: var(--color-primary);
      color: #fff;
      font-family: var(--font-body);
      font-weight: 800;
      font-size: 0.8rem;
    }
    .slr-header__nav {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .slr-header__vendor-link { color: var(--color-accent-deep); }
    .slr-header__actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      white-space: nowrap;
    }
    .slr-header__hello {
      font-weight: 600;
      font-size: 0.9rem;
      margin-right: var(--space-2);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 860px) {
      .slr-header__nav { display: none; }
    }

    @media (max-width: 480px) {
      .slr-header__inner { height: 64px; gap: var(--space-3); }
      .slr-header__brand-text { display: none; }
      .slr-header__actions { gap: var(--space-2); }
      .slr-header__btn { padding: 9px 14px; font-size: 0.82rem; }
      .slr-header__hello { display: none; }
    }
  `],
})
export class HeaderComponent {
  vendorAppUrl = VENDOR_APP_URL;
  constructor(public auth: AuthService) {}
}
