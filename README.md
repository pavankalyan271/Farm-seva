# Farm Seva

Farm Seva is a frontend-only React + TypeScript application that connects farmers with nearby agricultural machinery owners.

Farmers can discover machinery, send machinery requests, manage bookings, and receive notifications. Machinery owners can register and manage machinery, respond to requests, schedule jobs, and manage completed work.

## Features

- Farmer registration and login
- Machinery owner registration and login
- Farmer dashboard
- Machinery owner dashboard
- Nearby machinery discovery
- Machinery search and filtering
- Machinery request system
- Booking/request status tracking
- Owner request management
- Job scheduling
- Notifications
- Location support
- English, Telugu, and Hindi UI
- Language switching without page reload
- Language preference persistence
- Frontend-only demo authentication

## Languages

Farm Seva supports three languages:

| Code | Language |
|------|----------|
| `en` | English |
| `te` | తెలుగు |
| `hi` | हिंदी |

The selected language is stored in:

```text
farmseva_language

## technology Stack
React
TypeScript
Vite
CSS
Browser localStorage
Hash-based frontend routing

Project Structure
src/
├── components/
│   └── Header.tsx
│
├── i18n/
│   ├── en.ts
│   ├── te.ts
│   ├── hi.ts
│   └── index.ts
│
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Farmer.tsx
│   ├── MachineryOwner.tsx
│   ├── FarmerDashboard.tsx
│   └── OwnerDashboard.tsx
│
├── App.tsx
├── LanguageProvider.tsx
└── main.tsx
Internationalization

The multilingual system is implemented using React Context.

Translation dictionaries are located in:

src/i18n/en.ts
src/i18n/te.ts
src/i18n/hi.ts

The language provider is:

src/LanguageProvider.tsx

Components can access translations using:

const { language, setLanguage, t } = useLanguage();

Example:

<h1>{t("farmer_dashboard_title")}</h1>

The English dictionary defines the translation keys, and Telugu and Hindi provide the corresponding translations.

Language Persistence

The selected language is stored in browser localStorage using:

farmseva_language

The application reads the stored language when starting and falls back to English when no valid language is stored.

Supported values:

en
te
hi
Installation

Install project dependencies:

npm install
Development

Start the development server:

npm run dev

Vite will display the local development URL in the terminal.

Production Build

Run:

npm run build

A successful build should finish with:

✓ built
Preview Production Build

After building:

npm run preview
Testing Language Switching
Start the application.
Open the language selector in the header.
Select English.
Select తెలుగు.
Select हिंदी.
Confirm the current page changes language immediately.
Open the Farmer Dashboard and test all three languages.
Open the Machinery Owner Dashboard and test all three languages.
Refresh the browser.
Confirm the selected language is preserved.
Application Routes

Farm Seva uses hash-based frontend routing.

Available routes include:

#/
#/login
#/farmer
#/owner
#/farmer-dashboard
#/owner-dashboard
Demo Authentication

Authentication is currently frontend-only for demonstration purposes.

The application uses browser localStorage for demo account and session data.

This implementation is not intended for production authentication.

A production version should use a secure backend authentication system.

Local Storage

The application uses localStorage for its existing frontend demo functionality.

The multilingual feature adds:

farmseva_language

Existing application localStorage keys, routing, business logic, and data models are not changed by the multilingual implementation.

Accessibility

The language selector is keyboard accessible and includes an accessible label.

Existing navigation, focus behavior, semantic HTML, and accessibility attributes are preserved.

Business Logic

The multilingual implementation is frontend-only.

It does not add:

Backend services
Database
API server
Authentication server
New business logic

The existing application behavior remains unchanged.

Build Verification

Before committing changes, run:

npm run build

The project is considered ready when TypeScript compilation and the Vite production build complete successfully.

Current Status

The current Farm Seva frontend includes:

English UI
Telugu UI
Hindi UI
Farmer registration
Machinery owner registration
Login
Farmer dashboard
Machinery owner dashboard
Machinery discovery
Machinery requests
Bookings
Notifications
Language persistence
Responsive frontend UI
Future Improvements

Possible future improvements include:

Secure backend authentication
Database integration
Production APIs
Real-time notifications
Online payments
Advanced machinery search
Improved location services
Additional Indian regional languages
Production deployment

