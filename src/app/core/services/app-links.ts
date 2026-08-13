/**
 * This app and the vendor portal are separate deployments (separate
 * Angular projects, separate origins in production - e.g.
 * rentals.example.com vs vendor.rentals.example.com). Cross-app
 * navigation is therefore a plain external link, not a routerLink.
 * Point this at wherever the vendor app is actually served.
 */
export const VENDOR_APP_URL = 'http://localhost:4201';
