# Southern Lanka Rentals — Customer Site

The public-facing marketplace: browse, compare and book bikes, scooters and
cars across Southern Sri Lanka. This is one of **two separate Angular
apps** that together make up the frontend - the other is the
[vendor portal](../southern-lanka-rentals-vendor), which owns everything
under what used to be `/vendor/**` in the combined app.

## Why split

Different audiences, different deploy cadence, different auth surface. A
tourist booking a scooter never needs vendor-dashboard code in their bundle,
and a vendor managing their fleet never needs the search/booking flow. Two
apps also means they can be deployed to separate subdomains
(`southernlankarentals.com` / `vendor.southernlankarentals.com`) with
independent release schedules, without any shared build tooling to
coordinate.

## What's here

- Homepage, search results, vehicle detail page, the full 4-step booking flow
- Customer login/register
- Everything from the original combined app **except** `features/vendor/**`
  and the vendor-only services/models (`VendorService`, `vendor-*.model.ts`)

## Talking to the vendor app

There is no shared routing between the two apps - any link to vendor
territory (header's "List your business," footer's "Vendor login," the
homepage's vendor CTA) is a plain `<a href>` to the vendor app's origin,
configured in `src/app/core/services/app-links.ts`:

```ts
export const VENDOR_APP_URL = 'http://localhost:4201';
```

Change this to the vendor app's real URL when deploying. If a vendor
account somehow logs in here, `LoginComponent` detects the `VENDOR` role,
logs them out of this app, and bounces them to the vendor app's login -
this app has no vendor routes to send them to internally.

## Running locally

```bash
npm install
npm start
```

Serves on `http://localhost:4200`. Expects the backend at
`http://localhost:8080/api/v1` (`src/app/core/services/api-config.ts`) and
the vendor app at `http://localhost:4201` for cross-links.

## Deploying (SPA routing)

Client-side routing means the server must fall back to `index.html` for any
path it doesn't recognize as a static file, or a reload on a deep route
(e.g. `/rental/honda-dio-mirissa`) will 404. `<base href="/">` in
`index.html` is required for the same reason - see the vendor app's README
for the longer explanation; it applies identically here.
