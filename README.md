# Orbital / Access — Daintree × UW Demonstration v1.4

Interactive **mock user governance** website for a multi-station satellite observatory, with a placeholder satellite dashboard. The application is **fictional and browser-only**. No accounts, invitations, email, export decisions, or security alerts are real. No backend or production authentication is provided.

## Quick start (Windows / Mac / Linux)

- Open `index.html` in a modern browser. No installation required.
- Or open a terminal **in this folder**, run `python -m http.server 8080` (Windows: `py -m http.server 8080`), then visit `http://localhost:8080`.
- The `View as` dropdown is **only a demonstration tool**, never an identity or access control mechanism.
- All changes live in browser memory and reset on reload.

## New registration experience (v1.4)

Two distinct onboarding entry points:

**1. Invite User (administrative)**

- `View as → Super Admin → Invitations → Invite user`: invite a Station Admin, Operator, or Viewer to *any* example station.
- `View as → Station Admin → Invitations → Invite user`: invite an Operator or Viewer for **their assigned station only**.
- Fictional invitation collects **Demo alias, `.test` / `.example` email, proposed role, station**. It generates a **single-use example code** with a 7-day expiration. **No email is sent.**
- Invitation states: `Pending`, `Used`, `Expired`, `Revoked`. Revocation is available within an administrator's scope. An invitation is **not** approval for restricted data.

**2. Request Access (prospective user)**

- `View as → Prospective User → Request Access`: shows a full-page form with a sample alias, example email, fictional affiliation, proposed role and station, research justification, and optional invitation code.
- Try `Use sample invitation` (code `DEMO-UW-VIEW-301`) to prefill a valid invitation. Matching details move the request **directly into Identity review**, not into an active account.
- Try `Try expired invitation` (code `DEMO-EXPIRED-300`), or enter a mismatched, revoked, used, or unknown code: **DENIED** with a readable decision reason.
- Without a code, Viewer / Operator applications enter **Sponsorship review**, requiring Station Admin or Super Admin action before identity verification.
- Station Admin access **requires a Super Admin-issued invitation**; direct self-request is denied.
- Prospective User sees **only Request Access, My Requests, and Access Policy**; no station dashboard, data, or controls.
- `.test`/`.example` email and `Demo …` alias requirements help keep personal information out of this proof of concept. Never submit real details.

## End-to-end walkthrough (5–7 minutes)

1. Select **Super Admin** → **Invitations** → **Invite user**. Create a fake alias and `.test` address; note the invitation code.
2. Select **Prospective User** → **Request Access**. Enter the exact invitation alias/email/role/station, and submit a fictional justification. The application accepts the one-use code.
3. Select **Super Admin** → **Access Requests**. Click `Verify identity (demo)` → `Authorize access (demo)`. Both are *simulations of decisions from outside the system*, **not real verification**.
4. Click **Approve station access**. This creates a sample account in User Directory. Inspect its assigned station and role.
5. As **Prospective User**, submit a **new request without a code**. As **Station Admin**, accept or deny **Sponsorship review**. If approved, identity and compliance stages still follow.
6. Test denials: expired or revoked invitation, mismatched invitation details, denied sponsorship, failed identity review, export review denial, or administrative rejection.
7. Switch to **Operator** and **Viewer** to illustrate role and station scoping. Under Demo Mode, administrators can also open **Security & Access Testing** to trigger access-denied mock scenarios.

## Functional access model

| Role | Stations | Relevant tasks |
|---|---|---|
| Super Admin | All | Invite all non-Super-Admin roles, issue global station assignments, review requests, inspect authorized audits and alerts |
| Station Admin | Assigned station only | Invite local Operators and Viewers, approve sponsorship and final station access after independent reviews |
| Operator | Assigned station only | Operate the **fictional** acquisition controls and view placeholder results |
| Viewer | Assigned station only | Read-only fictional tracking, forecasts, and results |
| Prospective User | **None** | Submit sample application and view its demo status |

**All actual identity and export-compliance decisions must come from authorized personnel/systems**, not Super Admin's self-assertion. The demo's mock reviewer controls are only visible to Super Admin to let a presenter click through those stages; this is **not** the intended production separation of duties.

## Project structure

- `index.html` — page skeleton, demo role selector, navigation.
- `app.js` — all stateful simulation, invitations, requests, review stages, alerts, and station guards.
- `styles.css` — enforced dark mode, contrast, responsive registration form, alert surfaces.
- `vercel.json` — configuration for static hosting.

## Public deployment (fictional demo only)

Place this folder in GitHub, then import it using [Vercel](https://vercel.com/new) as a static project with no build command. Alternatively, run `vercel --prod` from this folder after installing and authenticating the Vercel CLI. **This project is not yet published to a URL by the assistant.**

## Security / compliance limitations (critical)

**This code MUST NOT be used to protect actual restricted data, collect immigration documentation, or make export eligibility determinations.**

- Roles are selectable on the client. Authorization checks only affect browser display and are easily bypassed.
- Invitation codes are predictable fictional tokens stored in JavaScript memory, **not secrets**.
- No real identity provider, MFA, server validation, approved audit storage, or email delivery exists.
- No passport, citizenship, residency, immigration, government ID, or legal-status documents should be submitted here.
- Real registration should use institution-approved identity verification; independent compliance authorizations must be scope-specific, signed/verified, time-bounded, revocable, and checked for every sensitive API/WebSocket action.
- Real hosting must be assessed against UW/Daintree export-control, security, legal, contractual, and data-classification requirements. A publicly hosted Vercel static demo is for **fake data only**.
- “Red-certified” is not itself an actionable security certification spec; clarify the actual data class, accreditation, hosting boundary, and safeguarding requirements with the appropriate UW/Daintree authorities.

The other example stations (B/C) are *illustrative placeholders*, not confirmed UW facilities.
