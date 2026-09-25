# MediConnect — Hospital Management System (HMS)
### *Frontend-First University Project Demo & Faculty Pitch*

[![Aesthetic](https://img.shields.io/badge/Design-Apollo%2024%7C7%20%26%20Practo%20Inspired-teal)](https://github.com)
[![Status](https://img.shields.io/badge/Demo-Ready%20for%20Live%20Pitch-emerald)](https://github.com)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind%20CSS-sky)](https://github.com)
[![Backend Ready](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20(Ready)-indigo)](https://github.com)

---

## 🎯 Executive Summary
**MediConnect** is an integrated Hospital Management Web Platform designed with the visual fidelity, warmth, and trust-building UX of industry leaders like **Apollo 24|7** and **Practo**. Tailored specifically for high-impact university presentations and faculty pitches, it features **three fully functional role-based portals** connected via a reactive client-side mock service layer with persistent `localStorage` synchronization.

---

## 🚀 Live Demo Quickstart

### Option 1: Instant Launch via Built-in Python Server (Recommended)
Open a terminal in the project directory:
```bash
python -m http.server 5173
```
Then open your browser to:
👉 **[http://localhost:5173](http://localhost:5173)**

### Option 2: Direct Browser Launch
You can also open `index.html` directly in modern web browsers (Chrome, Edge, Firefox, Safari).

---

## 🎭 Presentation Mode: One-Click Role Switcher

During your faculty pitch, switch between all three stakeholder perspectives in seconds without logging in or logging out:
1. Look at the top navigation bar for the **Role Switcher** pills:
   - **`[Patient Portal]`** (Aarav Sharma — UHID: MC-2026-8941)
   - **`[Doctor Portal]`** (Dr. Ananya Iyer — Senior Consultant Cardiologist)
   - **`[Admin Portal]`** (Super Admin & Hospital Operations)
2. Click **"Demo Role Switcher"** in the top utility bar or the user profile dropdown to launch the **Presentation Launchpad Modal**.

> **Note on Data Sync**: Data created in one portal immediately syncs across all portals. When a patient books an appointment, it instantly appears in the Doctor's queue and increments the Admin's daily revenue and OPD count!

---

## 🏥 Portal Breakdown & Features

### 1. 🧑‍⚕️ Patient Portal
- **Apollo-Inspired Hero Search**: Search by doctor name, specialty, or common symptoms (*"Cardiologist, Fever, Knee Pain"*).
- **Find Doctors & Filter**: Filter by department, availability today, consultation fee, and rating.
- **3-Step Appointment Booking Stepper**:
  - Step 1: In-Clinic OPD Visit or Secure HD Video Call.
  - Step 2: Date & Available Slot selection (Morning/Evening chips).
  - Step 3: Patient details, chief symptoms, and payment option (UPI / Card / Pay at Clinic).
  - Step 4: Instant booking confirmation with OPD token number (`A-14`).
- **Home Sample Collection & Live Tracker**:
  - Diagnostic test catalog (Complete Hemogram, Lipid Profile, Thyroid Panel, Full Body Wellness).
  - Booking form with address, preferred slot, and fasting instructions.
  - **Live 5-Step Visual Tracker UI**: `Requested` ➔ `Phlebotomist Assigned` (with contact card) ➔ `Sample Collected` ➔ `Lab Processing` ➔ `Report Ready`.
  - Includes a *"Simulate Next Stage"* button so presenters can show the full pipeline in 10 seconds.
- **My Health Records & Timeline**:
  - Chronological history of past visits.
  - Digital Prescription viewer with Rx medicine table, dosage, frequency, and doctor instructions.
  - Diagnostic Lab report modal with observed biomarker values vs reference intervals.
- **Patient Profile**:
  - Personal info, blood group, emergency contact, known drug allergies, and chronic conditions with instant edit & save.

---

### 2. 🩺 Doctor Portal (Dr. Ananya Iyer — Cardiology)
- **Live OPD Patient Queue**:
  - List of today's patients with time slot, token number, age, gender, consultation mode, and chief complaint.
  - One-click status updates: `Waiting` ➔ `In Consultation` ➔ `Completed`.
- **Patient Medical History Dossier**:
  - Click any patient in the queue to inspect their vitals triage (BP, pulse, SpO2, temp), previous prescriptions, and background medical summary.
- **Write Digital Prescription Form**:
  - Clinical diagnosis, dynamic medication table (Drug name, dosage, frequency, duration, instructions), lifestyle advice, and follow-up date.
  - Automatically completes the queue item and appends to the patient's records!
- **Availability & Slot Manager**:
  - Toggle morning & evening consultation slots on/off.
  - Toggle today's clinic duty status (On Duty vs In Surgery).

---

### 3. 🛡️ Admin Portal (Hospital Executive)
- **Executive KPI Cards**:
  - Total Registered Patients (`2,480`), Active Doctors (`48`), Today's OPD Bookings (`76`), Daily Revenue (`₹1,52,400`), Bed Occupancy Rate (`86%`).
- **Doctor Roster Management**:
  - Searchable directory table of all medical doctors across departments.
  - "Add New Doctor" modal form with qualifications, experience, department, fee, and photo URL.
  - Toggle doctor shift status (On Duty / On Leave).
- **Hospital Departments Management**:
  - Grid of clinical wings (Cardiology, Orthopedics, Neurology, Pediatrics, Dermatology, General Medicine, Radiology, Pathology).
  - Add new department modal with OPD room numbers and HOD assignment.
- **Reports & Analytics**:
  - Interactive SVG Bar Chart for weekly appointment volumes (Monday - Sunday) with hover tooltips and daily revenue.
  - Department-wise patient volume percentage progress bars.
  - Hospital revenue stream distribution (OPD consultations vs Diagnostics vs Pharmacy).

---

### 4. 🤖 "Ask MediConnect Assistant" (Phase 2 Placeholder)
As specified in project requirements, conversational AI / RAG is reserved for Phase 2. The app includes prominent buttons and banners for **"Ask MediConnect Assistant"** that open an interactive roadmap dialog showcasing:
- Automated symptom triage to medical departments
- Layman-friendly lab report biomarker explainer
- Conversational scheduling assistant

---

## 🛠️ Project Structure
```
c:\Users\hp\HMS\
├── index.html                   # Master entry point with Tailwind CDN, Google Fonts & React UMD
├── build_bundle.py              # Script that packages modular JSX components into appBundle.jsx
├── src/
│   ├── appBundle.jsx            # Unified application script compiled by Babel in browser
│   ├── App.jsx                  # Root component & global state router
│   ├── api/
│   │   └── apiService.js        # Pluggable asynchronous API layer with localStorage caching
│   ├── data/
│   │   └── mockData.js          # Realistic clinical datasets (doctors, appointments, tests)
│   ├── components/
│   │   ├── Icons.jsx            # Self-contained SVG Icon library (stethoscope, heartbeat, etc.)
│   │   ├── Navbar.jsx           # Top emergency bar, brand logo, role switcher pills
│   │   ├── RoleModal.jsx        # Demo perspective selector modal
│   │   ├── AiAssistantModal.jsx # Phase 2 AI triage placeholder modal
│   │   └── Toast.jsx            # Floating action feedback alert
│   └── portals/
│       ├── patient/             # Patient Portal views (Search, Booking, Tracker, Records, Profile)
│       ├── doctor/              # Doctor Portal views (Queue, Patient History, Prescription, Slots)
│       └── admin/               # Admin Portal views (Dashboard, Doctors, Departments, Analytics)
├── server/
│   ├── package.json             # Node.js Express backend dependencies
│   └── server.js                # Express REST API routes skeleton ready for Phase 2
└── README.md                    # Project documentation & pitch guide
```

---

## 🔌 Connecting Real Node.js Backend (Phase 2)
The frontend communicates exclusively through `src/api/apiService.js`. When transitioning to a production database (e.g. MongoDB or PostgreSQL), you only need to swap the simulated delay functions in `apiService.js` with standard `fetch('/api/...')` calls pointing to `server/server.js`.
