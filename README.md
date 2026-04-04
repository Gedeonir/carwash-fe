# Ikinamba — Mobile Car Wash App

> Professional mobile car wash detailing, delivered to your doorstep. Built with React + Vite + Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & User Flows](#pages--user-flows)
  - [Customer Flow](#customer-flow)
  - [Admin Flow](#admin-flow)
- [Components](#components)
- [Deployment](#deployment)

---

## Overview

**Ikinamba** is a mobile-first web application for booking on-demand car wash services in Kigali, Rwanda. Customers can book a wash, track their washer in real time, and rate their experience — all from their phone. Admins have a full dashboard to manage bookings, the wash team, and analytics.

**Key features:**
- Three auth paths — Sign In, Create Account, or Continue as Guest
- Customer dashboard with live booking status, loyalty progress, and quick re-book
- Multi-step booking flow (service → schedule → location → confirm)
- Live wash tracking with stage-by-stage timeline
- Star rating + tip system post-wash
- Admin panel with bookings table, team management, and revenue analytics
- Toast notification system
- Sticky bottom nav with FAB book button
- Fully themed in black, yellow & white

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| PostCSS + Autoprefixer | CSS processing |
| DM Serif Display | Display / headline font |
| DM Sans | Body / UI font |
| JetBrains Mono | Monospace / code font |

No external UI library. No React Router. Navigation is handled by a simple `navigate(page, data)` prop pattern.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
# Clone or copy the project into your folder
cd ikinamba

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
# Output goes to /dist
```

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
ikinamba/
├── index.html                  # HTML entry point (Google Fonts loaded here)
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js          # Full design token configuration
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Route table + shared state + nav logic
    ├── index.css               # Tailwind directives + global utilities
    ├── components/
    │   ├── UI.jsx              # Shared components: Button, Card, Input, Badge, TopBar, etc.
    │   ├── BottomNav.jsx       # Sticky bottom tab bar with FAB book button
    │   └── Toast.jsx           # Toast notification system (context + hook + container)
    └── pages/
        ├── LandingPage.jsx     # Public marketing page
        ├── AuthPage.jsx        # Sign in / Sign up / Guest — 3-screen flow
        ├── DashboardPage.jsx   # Customer home (post-login)
        ├── BookingPage.jsx     # 2-step: choose service → pick date & time
        ├── LocationPage.jsx    # Set wash location (saved or custom)
        ├── ConfirmPage.jsx     # Booking summary + payment method
        ├── TrackingPage.jsx    # Live wash status timeline
        ├── ReviewPage.jsx      # Star rating, tags, comment, tip
        ├── ServicesPage.jsx    # Browse all packages + add-ons + FAQ
        ├── ProfilePage.jsx     # User info, saved cars, booking history
        ├── NotificationsPage.jsx # Notification center with filters
        └── AdminDashboard.jsx  # Admin: overview, bookings, team, analytics
```

---

## Pages & User Flows

### Customer Flow

```
LandingPage
    │
    └──► AuthPage
              ├── Sign In ──────────────────► DashboardPage
              ├── Create Account ───────────► DashboardPage
              └── Continue as Guest ────────► BookingPage
                                                   │
                                              LocationPage
                                                   │
                                              ConfirmPage
                                                   │
                                             TrackingPage
                                                   │
                                              ReviewPage
```

**Auth paths in detail:**

| Path | Required fields | Destination |
|---|---|---|
| Sign In | Email + password (or Google) | Dashboard |
| Create Account | Name + email + password (or Google) | Dashboard |
| Continue as Guest | Name + phone only | Booking (skips dashboard) |

**Guest nudge:** After a guest completes their wash, the ReviewPage prompts them to save their details for next time.

### Admin Flow

The admin panel is accessed via the small `Admin →` link in the `LandingPage` footer. It has four internal tabs:

| Tab | Content |
|---|---|
| Overview | Stats, active bookings, team status |
| Bookings | Full bookings table with status badges |
| Team | Washer cards with zone, rating, and status |
| Analytics | Revenue by service + popular zones (bar charts) |


### Page keys

| Key | Component |
|---|---|
| `landing` | LandingPage |
| `auth` | AuthPage |
| `dashboard` | DashboardPage |
| `booking` | BookingPage |
| `location` | LocationPage |
| `confirm` | ConfirmPage |
| `tracking` | TrackingPage |
| `review` | ReviewPage |
| `services` | ServicesPage |
| `profile` | ProfilePage |
| `notifications` | NotificationsPage |
| `admin` | AdminDashboard |

## Deployment

### Vercel (recommended)

```bash
npm run build
# Then drag /dist into vercel.com, or use the Vercel CLI:
npx vercel --prod
```

### Netlify

```bash
npm run build
# Drag /dist into app.netlify.com/drop
# Or connect your GitHub repo and set build command: npm run build, publish dir: dist
```

### Manual (any static host)

```bash
npm run build
# Upload the contents of /dist to your server or CDN
```

> The app is a pure client-side SPA. Make sure your host serves `index.html` for all routes if you later add React Router.

---

## License

Private project — Ikinamba © 2025. All rights reserved.