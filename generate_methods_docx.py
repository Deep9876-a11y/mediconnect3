import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DOCX_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "MediConnect_Project_Methods_Documentation.docx")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_header_cell(row, col_idx, text, width_in=None):
    cell = row.cells[col_idx]
    if width_in:
        cell.width = Inches(width_in)
    set_cell_background(cell, "0F766E") # Teal 700
    set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    run.font.bold = True
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(255, 255, 255)
    run.font.name = "Arial"

def add_data_cell(row, col_idx, text, bold=False, is_code=False, bg_color=None, width_in=None):
    cell = row.cells[col_idx]
    if width_in:
        cell.width = Inches(width_in)
    if bg_color:
        set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=90, bottom=90, left=140, right=140)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(str(text))
    run.font.bold = bold
    run.font.size = Pt(9)
    run.font.name = "Consolas" if is_code else "Arial"
    if is_code:
        run.font.color.rgb = RGBColor(14, 116, 144) # Cyan 700
    else:
        run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800

def create_table_with_headers(doc, headers, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    # Header row
    hdr_row = table.rows[0]
    for idx, (h, w) in enumerate(zip(headers, widths)):
        add_header_cell(hdr_row, idx, h, w)
    return table

def add_table_row(table, row_data, is_even=False, widths=None):
    row = table.add_row()
    bg = "F8FAFC" if is_even else "FFFFFF"
    for idx, item in enumerate(row_data):
        w = widths[idx] if widths and idx < len(widths) else None
        is_code = (idx == 0) # method name is code
        bold = (idx == 0)
        add_data_cell(row, idx, item, bold=bold, is_code=is_code, bg_color=bg, width_in=w)

print("Generating MediConnect Methods Documentation (.docx)...")
doc = Document()

# Page Setup: Standard Letter with 0.8 inch margins
sections = doc.sections
for section in sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

# Document Header & Title
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(0)
title_p.paragraph_format.space_after = Pt(4)
title_run = title_p.add_run("MediConnect — Hospital Management System")
title_run.font.name = "Arial"
title_run.font.size = Pt(24)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(15, 118, 110) # Teal 700

sub_p = doc.add_paragraph()
sub_p.paragraph_format.space_before = Pt(0)
sub_p.paragraph_format.space_after = Pt(16)
sub_run = sub_p.add_run("Comprehensive Methods & API Architecture Reference Manual")
sub_run.font.name = "Arial"
sub_run.font.size = Pt(14)
sub_run.font.color.rgb = RGBColor(71, 85, 105) # Slate 600

# Metadata Box
meta_table = doc.add_table(rows=4, cols=2)
meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
meta_data = [
    ("Project Name", "MediConnect (HMS v2.5 Enterprise Edition)"),
    ("Architecture", "Full-Stack React + Python SQLite Backend + Node Express + Firebase Cloud"),
    ("Documentation Date", datetime.now().strftime("%B %d, %Y")),
    ("Total Methods Cataloged", "125+ Methods across 12 Functional Modules")
]
for i, (k, v) in enumerate(meta_data):
    row = meta_table.rows[i]
    cell_k = row.cells[0]
    cell_v = row.cells[1]
    cell_k.width = Inches(2.2)
    cell_v.width = Inches(4.8)
    set_cell_background(cell_k, "F1F5F9")
    set_cell_background(cell_v, "F8FAFC")
    set_cell_margins(cell_k, 60, 60, 100, 100)
    set_cell_margins(cell_v, 60, 60, 100, 100)
    
    pk = cell_k.paragraphs[0]
    rk = pk.add_run(k)
    rk.font.bold = True
    rk.font.size = Pt(9.5)
    rk.font.color.rgb = RGBColor(30, 41, 59)
    
    pv = cell_v.paragraphs[0]
    rv = pv.add_run(v)
    rv.font.size = Pt(9.5)
    rv.font.color.rgb = RGBColor(51, 65, 85)

doc.add_paragraph().paragraph_format.space_after = Pt(12)

# Table of Modules Summary
summary_p = doc.add_heading("1. Executive Summary & Module Inventory", level=1)
summary_p.paragraph_format.space_before = Pt(14)
summary_p.paragraph_format.space_after = Pt(6)

sum_desc = doc.add_paragraph("This technical reference documents every function, method, REST API endpoint, database query handler, frontend service call, React workflow handler, and security verification routine implemented across the MediConnect ecosystem.")
sum_desc.paragraph_format.space_after = Pt(8)

modules_headers = ["Module / Layer", "Source File", "Primary Role", "Method Count"]
modules_widths = [1.8, 1.8, 2.6, 0.8]
mod_table = create_table_with_headers(doc, modules_headers, modules_widths)

module_inventory = [
    ("Backend Database Layer", "backend_db.py", "SQLite schema init, migrations, CRUD operations, PHI masking", "25 methods"),
    ("Python HTTP API Server", "run.py", "Lightweight HTTP server, REST request routing, port fallback", "14 methods"),
    ("Frontend API Service", "src/api/apiService.js", "Unified data access layer, local storage fallback, dual-sync", "36 methods"),
    ("Firebase Cloud Sync", "src/api/firebaseService.js", "Google Cloud Firestore multi-device real-time sync", "7 methods"),
    ("AI & NLP Clinical Engine", "src/components/AiAssistantModal.jsx", "Intent classification, clinical response generation, triage", "5 methods"),
    ("Auth & Identity Management", "src/components/LoginPage.jsx", "Multi-role login, OTP/PIN reset, doctor verification", "8 methods"),
    ("Doctor Portal & EHR", "src/portals/doctor/*", "OPD queue triage, digital prescriptions, slot manager, receptionist", "9 methods"),
    ("Patient Portal & Booking", "src/portals/patient/*", "Doctor search, slot booking, lab tracking, profile settings", "7 methods"),
    ("Receptionist Desk Portal", "src/portals/receptionist/*", "Queue status updates, walk-in tokens, doctor roster monitoring", "5 methods"),
    ("Admin Management & Stats", "src/portals/admin/*", "Department/Doctor CRUD, revenue analytics, audit trails", "5 methods"),
    ("Pan-India Shared EHR", "src/portals/shared/*", "Passcode & OTP-protected doctor-patient records sharing", "4 methods")
]

for idx, row in enumerate(module_inventory):
    add_table_row(mod_table, row, is_even=(idx % 2 == 1), widths=modules_widths)

doc.add_paragraph().paragraph_format.space_after = Pt(14)

# Function to add detailed section
def add_method_section(section_num, section_title, file_path, description, headers, widths, methods_data):
    h = doc.add_heading(f"{section_num}. {section_title}", level=1)
    h.paragraph_format.space_before = Pt(16)
    h.paragraph_format.space_after = Pt(4)
    
    file_info = doc.add_paragraph()
    file_info.paragraph_format.space_after = Pt(4)
    r1 = file_info.add_run("Source File: ")
    r1.font.bold = True
    r2 = file_info.add_run(file_path)
    r2.font.name = "Consolas"
    r2.font.color.rgb = RGBColor(14, 116, 144)
    
    desc_p = doc.add_paragraph(description)
    desc_p.paragraph_format.space_after = Pt(8)
    
    tbl = create_table_with_headers(doc, headers, widths)
    for idx, row in enumerate(methods_data):
        add_table_row(tbl, row, is_even=(idx % 2 == 1), widths=widths)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

# ── 2. Backend SQLite Database Layer ──────────────────────────────────────────
backend_db_methods = [
    ("get_db()", "None", "sqlite3.Connection", "Opens and returns a connection to mediconnect.db with sqlite3.Row factory enabled."),
    ("init_db()", "None", "void", "Executes DDL to create users, departments, doctors, patients, appointments, prescriptions, lab_reports, share_links, audit_logs tables."),
    ("seed_data_if_empty(conn)", "conn: sqlite3.Connection", "void", "Populates initial enterprise hospital dataset (doctors, depts, patients, appointments, lab tests) if tables are empty."),
    ("api_get_departments()", "None", "list[dict]", "Retrieves all hospital wings, department codes, icons, colors, and assigned room locations."),
    ("api_add_department(data)", "data: dict", "dict", "Inserts a new department record with UUID/timestamp and returns the newly created object."),
    ("api_get_doctors()", "None", "list[dict]", "Fetches all doctor profiles, parsing JSON availableDays array and room assignments."),
    ("api_add_doctor(data)", "data: dict", "dict", "Inserts a doctor into the roster including specialization, fee, qualifications, and JSON available days."),
    ("api_update_doctor(doc_id, data)", "doc_id: str, data: dict", "dict", "Updates doctor biographical, departmental, fee, and availability schedule information."),
    ("api_get_patient(patient_id)", "patient_id: str = 'pat-1'", "dict | None", "Fetches patient demographic profile, decodes allergies, chronic conditions, and privacy settings."),
    ("api_update_patient(patient_id, data)", "patient_id: str, data: dict", "dict", "Updates patient contact details, emergency contacts, medical history, security PIN, and privacy flags."),
    ("api_get_appointments(role, user_id)", "role: str, user_id: str | None", "list[dict]", "Returns all appointments. Applies DISHA/HIPAA privacy filter: masks PHI clinical notes if requester is 'admin'."),
    ("api_create_appointment(data)", "data: dict", "dict", "Generates sequential token number, validates date/time slot, and stores new OPD appointment."),
    ("api_update_appointment_status(apt_id, status)", "apt_id: str, status: str", "dict", "Updates appointment status (Scheduled -> In-Progress -> Completed / Cancelled)."),
    ("api_get_prescriptions(role)", "role: str", "list[dict]", "Returns prescriptions. Enforces security rule: returns empty array if requester is 'admin'."),
    ("api_create_prescription(data)", "data: dict", "dict", "Inserts digital prescription with vitals, dosage, timing, duration, advice, and follow-up timeline."),
    ("api_get_lab_reports(role)", "role: str", "list[dict]", "Returns diagnostic test results. Enforces security restriction for non-clinical roles."),
    ("api_create_lab_report(data)", "data: dict", "dict", "Stores diagnostic test findings, normal reference ranges, pathologist verification, and PDF attachments."),
    ("api_get_share_links(patient_id)", "patient_id: str = 'pat-1'", "list[dict]", "Retrieves patient's active and expired Pan-India EHR consultation links with view counts."),
    ("api_create_share_link(data)", "data: dict", "dict", "Creates a time-bound, password-protected MEDIC-XXXX token with custom section-level permissions."),
    ("api_delete_share_link(link_id)", "link_id: str", "dict", "Instantly revokes and removes a shared record access link from the database."),
    ("api_verify_share_link(token, password)", "token: str, password: str", "dict", "Validates token, expiry, max view count, and password. Logs doctor IP/access and returns decrypted EHR."),
    ("api_login_user(identifier, password, role)", "identifier: str, password: str, role: str", "dict", "Authenticates user against email/phone/username and role; returns sanitized user token profile."),
    ("api_register_user(data)", "data: dict", "dict", "Registers doctor/patient/receptionist. Enforces rule: blocks Admin registration for cybersecurity."),
    ("api_reset_password(identifier, otp, pin, new_pass)", "identifier: str, otp: str, pin: str, new_pass: str", "dict", "Validates 4-digit security PIN and updates user password in SQLite database."),
    ("api_get_users()", "None", "list[dict]", "Returns all system user accounts with mapped assigned doctor identifiers.")
]

add_method_section(
    2, "Backend Database Layer (Python SQLite)", "backend_db.py",
    "Provides a robust, zero-dependency persistence layer using SQLite. Features ACID transactions, automated schema migrations, data seeding, and role-based data masking for healthcare compliance.",
    ["Method Signature", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.3, 1.1, 2.8],
    backend_db_methods
)

# ── 3. Python HTTP Server & API Handlers ──────────────────────────────────────
run_py_methods = [
    ("is_port_in_use(port)", "port: int", "bool", "Checks whether a TCP port is occupied on localhost using socket connection probes."),
    ("MediConnectHandler.__init__(*args, **kwargs)", "*args, **kwargs", "void", "Initializes SimpleHTTPRequestHandler pointing to the workspace root directory."),
    ("MediConnectHandler.log_message(format, *args)", "format: str, *args", "void", "Custom logger that suppresses noisy 200/304 static assets and highlights 4xx/5xx errors."),
    ("MediConnectHandler.send_json(status_code, data)", "status_code: int, data: any", "void", "Encodes JSON, writes HTTP headers (CORS, content-length), and streams payload to client."),
    ("MediConnectHandler.do_OPTIONS()", "None", "void", "Handles CORS pre-flight HTTP requests with allowed headers (X-User-Role, Authorization)."),
    ("MediConnectHandler.end_headers()", "None", "void", "Sets Cache-Control: no-cache on JSX, HTML, JS, and CSS files to prevent browser caching bugs."),
    ("MediConnectHandler.get_role_header()", "None", "str", "Extracts X-User-Role HTTP header (patient, doctor, receptionist, admin) from client request."),
    ("MediConnectHandler.read_json_body()", "None", "dict", "Reads UTF-8 encoded request body up to Content-Length and parses into a Python dictionary."),
    ("MediConnectHandler.do_GET()", "None", "void", "Dispatches GET routes: /api/departments, /api/doctors, /api/patient, /api/appointments, /api/prescriptions, /api/lab-reports, /api/share-links, /api/admin/stats, /api/cloud/status."),
    ("MediConnectHandler.do_POST()", "None", "void", "Dispatches POST routes: /api/auth/login, /api/auth/signup, /api/auth/forgot-password, /api/departments, /api/doctors, /api/appointments, /api/prescriptions, /api/lab-reports, /api/share-links, /api/share-links/verify."),
    ("MediConnectHandler.do_PUT()", "None", "void", "Dispatches PUT routes: /api/doctors/{id}, /api/patient/{id} for full resource updates."),
    ("MediConnectHandler.do_PATCH()", "None", "void", "Dispatches PATCH routes: /api/appointments/{id} for partial status updates."),
    ("MediConnectHandler.do_DELETE()", "None", "void", "Dispatches DELETE routes: /api/share-links/{id} for immediate link revocation."),
    ("main()", "None", "void", "Binds to port 5173 (or fallbacks 5174, 3000, 8080), opens system browser, and runs server loop.")
]

add_method_section(
    3, "Python HTTP Server & Dispatch Layer", "run.py",
    "Serves both the single-page React frontend application and handles RESTful HTTP API routing. Features multi-port failover, automated browser launching, and header-based security inspection.",
    ["Method / Function", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.3, 1.1, 2.8],
    run_py_methods
)

# ── 4. Frontend API Service & Dual-Sync ───────────────────────────────────────
api_service_methods = [
    ("timeoutSignal(ms)", "ms: int", "AbortSignal", "Creates an AbortSignal that automatically aborts after specified milliseconds for network resiliency."),
    ("getStored(key, fallback)", "key: str, fallback: any", "any", "Safely retrieves and JSON-parses values from browser localStorage with fallback."),
    ("setStored(key, value)", "key: str, value: any", "void", "JSON-serializes and persists data into browser localStorage."),
    ("initStorage()", "None", "void", "Seeds browser localStorage with initial mock datasets if empty on first startup."),
    ("checkServer()", "None", "Promise<bool>", "Pings /api/health with a 2-second timeout to detect whether backend server is online."),
    ("apiFetch(path, options)", "path: str, options: object", "Promise<any>", "Core HTTP client wrapper that calls backend API and falls back to offline store if unreachable."),
    ("getDepartments()", "None", "Promise<Array>", "Fetches department list from server or offline storage."),
    ("addDepartment(deptData)", "deptData: object", "Promise<object>", "Posts department to API, triggers Firebase saveDoc, and updates local cache."),
    ("getDoctors()", "None", "Promise<Array>", "Returns doctor roster with ratings and available slots."),
    ("getDoctorById(id)", "id: str", "Promise<object | null>", "Finds a specific doctor by unique ID."),
    ("addDoctor(doctorData)", "doctorData: object", "Promise<object>", "Creates doctor, writes to Cloud Firestore, and refreshes doctor list."),
    ("updateDoctor(id, updates)", "id: str, updates: object", "Promise<object>", "Updates doctor details in backend and synchronizes with Firebase."),
    ("getPatientProfile()", "None", "Promise<object>", "Returns active patient profile including UHID, vitals, allergies, and emergency contact."),
    ("updatePatientProfile(profileData)", "profileData: object", "Promise<object>", "Persists updated patient profile to SQLite and Cloud Firestore."),
    ("getAppointments()", "None", "Promise<Array>", "Retrieves full appointment list with patient details and status."),
    ("bookAppointment(bookingData)", "bookingData: object", "Promise<object>", "Books appointment, creates OPD token, syncs to Firestore, and updates revenue metrics."),
    ("updateAppointmentStatus(id, newStatus)", "id: str, newStatus: str", "Promise<object>", "Updates status (Scheduled -> Completed / Cancelled) in database and cloud."),
    ("getPrescriptions()", "None", "Promise<Array>", "Fetches digital prescriptions for logged-in patient."),
    ("addPrescription(prescriptionData)", "prescriptionData: object", "Promise<object>", "Saves prescription, completes corresponding appointment, and writes to Firestore."),
    ("getLabReports()", "None", "Promise<Array>", "Fetches diagnostic laboratory reports and test summaries."),
    ("getLabPackages()", "None", "Promise<Array>", "Returns available diagnostic packages and pricing."),
    ("getHomeSampleOrders()", "None", "Promise<Array>", "Fetches doorstep phlebotomy orders and real-time status."),
    ("bookHomeSample(orderData)", "orderData: object", "Promise<object>", "Places home sample order with 5-stage live tracking timeline."),
    ("updateSampleOrderStatus(id, newStatus)", "id: str, newStatus: str", "Promise<object>", "Advances sample collection status and assigns phlebotomist."),
    ("getAdminStats()", "None", "Promise<object>", "Returns aggregated hospital analytics, revenue, and occupancy."),
    ("getShareLinks()", "None", "Promise<Array>", "Fetches active Pan-India record sharing tokens."),
    ("createShareLink(linkData)", "linkData: object", "Promise<object>", "Creates time-bound MEDIC-XXXX token with custom section permissions and password."),
    ("getShareLinkByToken(token)", "token: str", "Promise<object | null>", "Looks up share link metadata by token."),
    ("unlockShareLink(token, password, doctorInfo)", "token: str, password: str, doctorInfo: object", "Promise<object>", "Validates passcode, increments view count, logs doctor access, and decrypts EHR."),
    ("revokeShareLink(token)", "token: str", "Promise<bool>", "Immediately deactivates and revokes patient share token."),
    ("addPrescriptionFromShare(token, rxData)", "token: str, rxData: object", "Promise<object>", "Allows consulting doctor in external clinic to append prescription to shared record."),
    ("getUsers()", "None", "Promise<Array>", "Fetches all system users for role verification."),
    ("registerUser(userData)", "userData: object", "Promise<object>", "Registers user account via backend API with duplicate check."),
    ("verifyDoctorUser(userId)", "userId: str", "Promise<bool>", "Admin approval function to activate pending doctor accounts."),
    ("loginUser(identifier, password, role)", "identifier: str, password: str, role: str", "Promise<object>", "Validates credentials against email/phone/username and specified role."),
    ("resetPassword(identifier, securityPin, newPassword)", "identifier: str, securityPin: str, newPassword: str", "Promise<object>", "Verifies 4-digit security PIN and resets user password.")
]

add_method_section(
    4, "Frontend Unified Data Access Layer (apiService)", "src/api/apiService.js",
    "Serves as the central data gateway for all React components. Employs a hybrid strategy: queries the active backend when available and gracefully falls back to persistent localStorage.",
    ["Method Name", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    api_service_methods
)

# ── 5. Firebase Cloud Firestore Integration Service ───────────────────────────
firebase_methods = [
    ("getConfig()", "None", "object", "Retrieves active Firebase configuration credentials from localStorage or defaults."),
    ("saveConfig(newConfig)", "newConfig: object", "bool", "Saves custom Firebase API keys, project ID, and re-initializes cloud connection."),
    ("init()", "None", "bool", "Initializes Firebase Web SDK app instance and establishes Firestore database connection."),
    ("getStatus()", "None", "object", "Returns real-time cloud connection health, project ID, region, and synchronized collection names."),
    ("saveDoc(collectionName, docId, data)", "collectionName: str, docId: str, data: object", "Promise<bool>", "Writes or merges a document in Cloud Firestore with timestamp and cloudSync flag."),
    ("getCollectionDocs(collectionName)", "collectionName: str", "Promise<Array | null>", "Fetches all remote documents from a specified Firestore collection."),
    ("syncAllToCloud(bundle)", "bundle: object", "Promise<object>", "Performs bulk bidirectional synchronization of all doctors, appointments, prescriptions, and links to Firestore.")
]

add_method_section(
    5, "Firebase Cloud Database Service (firebaseService)", "src/api/firebaseService.js",
    "Enables real-time multi-device cloud synchronization across India using Google Cloud Firestore (asia-south1 region). Implements dual-sync architecture alongside local SQLite.",
    ["Method Name", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    firebase_methods
)

# ── 6. AI Health Assistant & Clinical NLP Engine ──────────────────────────────
ai_methods = [
    ("detectIntent(text)", "text: str", "str", "Extracts clinical intent using NLP regex rules (greet, appointment, doctor, department, prescription, lab, symptom, emergency, hours, location, billing, cancel, farewell, help)."),
    ("generateReply(intent, text, context)", "intent: str, text: str, context: object", "str", "Synthesizes personalized medical response using live patient EHR, upcoming doctor schedules, and department roster."),
    ("AiAssistantModal({ ...props })", "React Component Props", "JSX.Element", "Renders floating AI modal, manages multi-turn conversation state, auto-scrolling, and quick action suggestion pills."),
    ("handleSend()", "None", "void", "Appends user message, triggers bot typing animation, queries intent engine, and streams response."),
    ("handleQuickAction(prompt)", "prompt: str", "void", "Executes predefined clinical shortcut queries (e.g. 'Show my appointments', 'Find cardiologist').")
]

add_method_section(
    6, "AI Health Assistant & Clinical Intelligence", "src/components/AiAssistantModal.jsx",
    "Provides an AI-driven conversational health assistant capable of triaging symptoms, recommending hospital departments, looking up doctor availability, and explaining prescriptions in plain language.",
    ["Function / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    ai_methods
)

# ── 7. Authentication, Authorization & Navigation ─────────────────────────────
auth_methods = [
    ("LoginPage({ onLoginSuccess })", "onLoginSuccess: function", "JSX.Element", "Main multi-role authentication portal supporting Doctor, Patient, Receptionist, and Administrator."),
    ("handleLoginSubmit(e)", "e: FormEvent", "Promise<void>", "Validates form fields, calls apiService.loginUser, triggers toast alerts, and routes to portal."),
    ("handleSignupSubmit(e)", "e: FormEvent", "Promise<void>", "Registers new user, assigns UHID for patients, assigns doctor link for receptionists."),
    ("handleForgotPassword(e)", "e: FormEvent", "Promise<void>", "Validates 4-digit security PIN and resets password via backend API."),
    ("Navbar({ currentRole, onSwitchRole, ... })", "Navbar Props", "JSX.Element", "Top navigation bar with live search, portal switcher, notifications drawer, and emergency hotline button."),
    ("handleVoiceCommand()", "None", "void", "Speech-to-text listener for hands-free clinical navigation across hospital wings."),
    ("RoleModal({ isOpen, onClose, onSelectRole })", "Modal Props", "JSX.Element", "Interactive role switcher modal for testing multi-role access control."),
    ("Toast({ message, type, onClose })", "Toast Props", "JSX.Element", "Notification banner for success, error, and security warning feedback.")
]

add_method_section(
    7, "Authentication, Security & Navigation Components", "src/components/LoginPage.jsx, Navbar.jsx",
    "Implements multi-tenant role-based access control (RBAC), multi-factor PIN verification, emergency hotlines, and instant role switching.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    auth_methods
)

# ── 8. Doctor Portal & Clinical Workflows ──────────────────────────────────────
doctor_methods = [
    ("DoctorPortal({ currentUser, ... })", "Portal Props", "JSX.Element", "Doctor workstation dashboard with live queue, OPD token counter, patient history, and prescription tools."),
    ("handleConsultPatient(appointment)", "appointment: object", "void", "Opens patient clinical record and initializes new prescription workspace."),
    ("handleCompleteConsultation(rxData)", "rxData: object", "Promise<void>", "Creates digital prescription, completes appointment, and updates patient EHR."),
    ("PrescriptionModal({ isOpen, onClose, ... })", "Modal Props", "JSX.Element", "Interactive prescription builder with dosage calculators, medicine dropdowns, and dietary advice."),
    ("handleAddMedicationRow()", "None", "void", "Adds a dynamic medication row (drug name, dosage, frequency, duration, timing)."),
    ("handlePrintPrescription()", "None", "void", "Generates standardized PDF print layout with hospital header, doctor license, and digital signature."),
    ("PatientHistoryModal({ isOpen, patient, ... })", "Modal Props", "JSX.Element", "Displays longitudinal patient EHR, previous visits, lab trends, allergies, and vitals."),
    ("SlotManager({ doctor, onUpdateSlots })", "Component Props", "JSX.Element", "Interactive OPD schedule manager allowing doctors to toggle available consultation slots."),
    ("ManageReceptionist({ doctorId })", "Component Props", "JSX.Element", "Allows doctor to create, manage, and assign dedicated receptionist staff to their OPD room.")
]

add_method_section(
    8, "Doctor Clinical Portal & OPD Workflows", "src/portals/doctor/*",
    "Empowers physicians with high-speed OPD queue management, digital prescription writing, historical EHR inspection, and staff delegation tools.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    doctor_methods
)

# ── 9. Patient Portal & Self-Service ──────────────────────────────────────────
patient_methods = [
    ("PatientHome({ patient, appointments, ... })", "Props", "JSX.Element", "Patient homepage with quick health stats, upcoming tokens, recent prescriptions, and lab status."),
    ("DoctorSearch({ doctors, departments, ... })", "Props", "JSX.Element", "Specialty and department-based doctor discovery directory with fees, ratings, and experience filters."),
    ("BookingModal({ doctor, patient, onBook })", "Props", "JSX.Element", "OPD slot selection modal with live token generation and UPI/Cash payment summary."),
    ("HealthRecords({ patient, prescriptions, reports })", "Props", "JSX.Element", "Unified patient health locker for downloading PDF prescriptions and lab reports."),
    ("HomeSampleTracker({ orders, onNewOrder })", "Props", "JSX.Element", "Live 5-step doorstep sample collection tracker with phlebotomist details and status."),
    ("PatientProfile({ patient, onUpdateProfile })", "Props", "JSX.Element", "Emergency contact, blood group, chronic disease, and privacy setting configuration."),
    ("ShareRecordModal({ patient, onCreateShareLink })", "Props", "JSX.Element", "Pan-India EHR share generator with custom passcode, duration, and access log viewer.")
]

add_method_section(
    9, "Patient Self-Service Portal & EHR Locker", "src/portals/patient/*",
    "Provides patients with seamless OPD appointment booking, longitudinal diagnostic record viewing, doorstep phlebotomy tracking, and secure record sharing.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    patient_methods
)

# ── 10. Receptionist Desk Portal ───────────────────────────────────────────────
receptionist_methods = [
    ("ReceptionistPortal({ currentUser, ... })", "Props", "JSX.Element", "OPD reception desk dashboard for managing walk-in patient tokens and doctor queues."),
    ("handleGenerateWalkInToken(formData)", "formData: object", "Promise<void>", "Issues instant on-the-spot OPD queue token for walk-in patients without prior online booking."),
    ("handleUpdateQueueStatus(aptId, newStatus)", "aptId: str, newStatus: str", "Promise<void>", "Updates patient queue status (Waiting -> Inside Doctor Room -> Completed)."),
    ("filterAppointmentsByAssignedDoctor()", "None", "Array", "Filters the central appointment registry to only show queue for the receptionist's assigned physician."),
    ("handlePrintTokenSlip(appointment)", "appointment: object", "void", "Prints thermal receipt slip containing Token Number, Patient Name, Room Number, and Doctor Name.")
]

add_method_section(
    10, "Hospital Receptionist & OPD Queue Desk", "src/portals/receptionist/*",
    "Streamlines hospital front-desk operations, queue triage, walk-in token issuance, and doctor-room coordination.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    receptionist_methods
)

# ── 11. Admin Management & Analytics ──────────────────────────────────────────
admin_methods = [
    ("AdminPortal({ adminStats, ... })", "Props", "JSX.Element", "Hospital administrative dashboard with revenue counters, bed occupancy charts, and staff rosters."),
    ("ManageDepartments({ departments, onAddDept })", "Props", "JSX.Element", "Administrative module for creating, editing, and assigning rooms to hospital wings."),
    ("ManageDoctors({ doctors, onAddDoctor, onUpdate })", "Props", "JSX.Element", "Doctor credentialing, licensing, fee adjustment, and account verification system."),
    ("ReportsAnalytics({ stats, appointments, ... })", "Props", "JSX.Element", "Financial revenue analytics, OPD traffic trends, and department performance heatmaps."),
    ("handleExportAuditLogs()", "None", "void", "Exports HIPAA/DISHA compliant patient record access audit logs to CSV/Excel format.")
]

add_method_section(
    11, "Hospital Administration & Governance", "src/portals/admin/*",
    "Provides hospital IT administrators with department structuring, medical staff verification, financial analytics, and regulatory audit trail exports.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    admin_methods
)

# ── 12. Pan-India Secure EHR Sharing (Shared EHR) ──────────────────────────────
shared_ehr_methods = [
    ("DoctorSharedEhrView()", "None", "JSX.Element", "Secure stand-alone portal for consulting physicians across India to view shared patient records."),
    ("handlePasscodeUnlock(passcode)", "passcode: str", "Promise<void>", "Validates token and password against database, decrypts EHR, and logs doctor IP/location."),
    ("handleAppendPrescription(rxData)", "rxData: object", "Promise<void>", "Allows external consulting doctor to prescribe medications directly into patient's centralized EHR."),
    ("handleExportRecordPdf()", "None", "void", "Generates full compiled medical summary PDF including history, lab reports, and active medications.")
]

add_method_section(
    12, "Pan-India Secure EHR Sharing Portal", "src/portals/shared/DoctorSharedEhrView.jsx",
    "Enables zero-friction second opinions across India. Patients generate time-limited, password-protected tokens that allow any registered physician in India to review records and issue prescriptions securely.",
    ["Method / Component", "Parameters", "Return Type", "Description & Implementation Role"],
    [1.8, 1.4, 1.1, 2.7],
    shared_ehr_methods
)

# Save Document
doc.save(DOCX_FILE)
print(f"Successfully generated methods documentation at: {DOCX_FILE}")
