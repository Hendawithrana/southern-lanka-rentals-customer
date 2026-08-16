import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VENDOR_APP_URL } from '../../../core/services/app-links';

@Component({
  selector: 'slr-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="slr-footer">
      <div class="slr-container slr-footer__grid">
        <div class="slr-footer__col slr-footer__brand-col">
          <div class="slr-footer__brand">Southern Lanka Rentals</div>
          <p>Verified bikes, scooters and cars from trusted local rental businesses.</p>
        </div>

        <div class="slr-footer__col">
          <h4>Company</h4>
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/how-it-works">How it works</a>
        </div>

        <div class="slr-footer__col">
          <h4>For customers</h4>
          <a routerLink="/bike-rental/matara">Browse bikes</a>
          <a routerLink="/car-rental/matara">Browse cars</a>
          <a routerLink="/rentals/search">Popular locations</a>
          <a routerLink="/bookings">My bookings</a>
        </div>

        <div class="slr-footer__col">
          <h4>For vendors</h4>
          <a [href]="vendorAppUrl + '/register'">List your business</a>
          <a [href]="vendorAppUrl + '/login'">Vendor login</a>
          <a [href]="vendorAppUrl + '/dashboard'">Vendor dashboard</a>
          <a [href]="vendorAppUrl + '/help'">Vendor help</a>
        </div>

        <div class="slr-footer__col">
          <h4>Legal</h4>
          <a routerLink="/legal/terms">Terms &amp; conditions</a>
          <a routerLink="/legal/privacy">Privacy policy</a>
          <a routerLink="/legal/cancellation">Cancellation policy</a>
          <a routerLink="/legal/rental">Rental policy</a>
        </div>
      </div>

      <div class="slr-container slr-footer__bottom">
        <span>© {{ year }} Southern Lanka Rentals</span>
        <div class="slr-footer__contact">
          <a href="https://wa.me/94000000000" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:hello@southernlankarentals.com">Email</a>
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .slr-footer {
      background: var(--color-primary-dark);
      color: #DCEAE7;
      margin-top: var(--space-8);
      padding: var(--space-8) 0 var(--space-5);
    }
    .slr-footer__grid {
      display: grid;
      grid-template-columns: 1.4fr repeat(4, 1fr);
      gap: var(--space-6);
    }
    .slr-footer__brand { font-family: var(--font-display); font-size: 1.2rem; color: #fff; margin-bottom: var(--space-2); }
    .slr-footer__brand-col p { color: #A9C4BF; max-width: 260px; }
    .slr-footer__col { display: flex; flex-direction: column; gap: 10px; }
    .slr-footer__col h4 { color: #fff; font-family: var(--font-body); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
    .slr-footer__col a { color: #B9D2CD; font-size: 0.9rem; }
    .slr-footer__col a:hover { color: #fff; }
    .slr-footer__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-7);
      padding-top: var(--space-5);
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 0.85rem;
      color: #A9C4BF;
    }
    .slr-footer__contact { display: flex; gap: var(--space-5); }
    .slr-footer__contact a:hover { color: #fff; }

    @media (max-width: 860px) {
      .slr-footer__grid { grid-template-columns: 1fr 1fr; }
      .slr-footer__brand-col { grid-column: 1 / -1; }
    }

    @media (max-width: 560px) {
      .slr-footer__grid { grid-template-columns: 1fr; }
      .slr-footer__bottom { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
      .slr-footer__contact { flex-wrap: wrap; gap: var(--space-4); }
    }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
  vendorAppUrl = VENDOR_APP_URL;
}
