/**
 * MediConnect HMS — Backend Server v2.0
 * Tech Stack: Node.js + Express + better-sqlite3
 * Database: SQLite (mediconnect.db) — auto-created & seeded on first run
 */

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'mediconnect.db');

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Setup ───────────────────────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    icon        TEXT,
    description TEXT,
    doctor_count INTEGER DEFAULT 0,
    lead_doctor TEXT,
    room        TEXT,
    color       TEXT
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    title           TEXT,
    specialty       TEXT,
    department_id   TEXT REFERENCES departments(id),
    experience      TEXT,
    qualification   TEXT,
    hospital        TEXT,
    location        TEXT,
    rating          REAL DEFAULT 5.0,
    reviews_count   INTEGER DEFAULT 0,
    fee             INTEGER DEFAULT 800,
    avatar          TEXT,
    about           TEXT,
    available_today INTEGER DEFAULT 1,
    available_slots TEXT DEFAULT '[]',
    languages       TEXT DEFAULT '[]',
    is_practo_verified INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS patients (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    age           INTEGER,
    gender        TEXT,
    blood_group   TEXT,
    phone         TEXT,
    email         TEXT,
    address       TEXT,
    allergies     TEXT DEFAULT '[]',
    chronic_conditions TEXT DEFAULT '[]',
    emergency_contact TEXT DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id            TEXT PRIMARY KEY,
    patient_id    TEXT REFERENCES patients(id),
    doctor_id     TEXT REFERENCES doctors(id),
    doctor_name   TEXT,
    specialty     TEXT,
    date          TEXT,
    time          TEXT,
    type          TEXT DEFAULT 'OPD',
    status        TEXT DEFAULT 'Upcoming',
    token_number  TEXT,
    fee           INTEGER,
    prescription_id TEXT,
    notes         TEXT
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id              TEXT PRIMARY KEY,
    appointment_id  TEXT,
    patient_id      TEXT REFERENCES patients(id),
    doctor_id       TEXT,
    doctor_name     TEXT,
    date            TEXT,
    diagnosis       TEXT,
    medications     TEXT DEFAULT '[]',
    instructions    TEXT,
    follow_up       TEXT
  );

  CREATE TABLE IF NOT EXISTS lab_reports (
    id          TEXT PRIMARY KEY,
    patient_id  TEXT REFERENCES patients(id),
    test_name   TEXT,
    date        TEXT,
    status      TEXT DEFAULT 'Ready',
    results     TEXT DEFAULT '[]',
    lab         TEXT,
    ordered_by  TEXT
  );

  CREATE TABLE IF NOT EXISTS sample_orders (
    id            TEXT PRIMARY KEY,
    patient_id    TEXT REFERENCES patients(id),
    package_name  TEXT,
    tests         TEXT DEFAULT '[]',
    address       TEXT,
    date          TEXT,
    time_slot     TEXT,
    status        TEXT DEFAULT 'requested',
    phlebotomist  TEXT DEFAULT '{}',
    timeline      TEXT DEFAULT '[]',
    amount        INTEGER
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id          TEXT PRIMARY KEY,
    session_id  TEXT,
    sender      TEXT NOT NULL,
    message     TEXT NOT NULL,
    timestamp   TEXT NOT NULL,
    role        TEXT DEFAULT 'patient'
  );
`);

// ── Seed Data (only if DB is empty) ─────────────────────────────────────────
const deptCount = db.prepare('SELECT COUNT(*) as c FROM departments').get().c;

if (deptCount === 0) {
  console.log('[MediConnect] Seeding database with initial data...');

  const insertDept = db.prepare(`
    INSERT INTO departments (id,name,icon,description,doctor_count,lead_doctor,room,color)
    VALUES (?,?,?,?,?,?,?,?)
  `);

  const departments = [
    ['cardiology','Cardiology','Heart','Heart care, angioplasty, hypertension & cardiac diagnostics',8,'Dr. Ananya Iyer','Block A - OPD 101-104','rose'],
    ['orthopedics','Orthopedics','Bone','Joint replacement, spine care, fractures & sports injuries',6,'Dr. Rajeshwar Rao','Block B - OPD 201-203','blue'],
    ['neurology','Neurology','Brain','Brain disorders, stroke management, migraine & epilepsy',5,'Dr. Kavita Menon','Block A - OPD 305-307','purple'],
    ['pediatrics','Pediatrics & Child Care','Baby','Child wellness, vaccinations, neonatal intensive care',7,'Dr. Sandeep Deshmukh','Block C - OPD 110-112','amber'],
    ['dermatology','Dermatology','Sparkles','Skin conditions, allergies, hair & cosmetic care',4,'Dr. Meera Nambiar','Block B - OPD 118-120','pink'],
    ['general_medicine','General Medicine','Activity','Fevers, seasonal infections, diabetes & chronic disease control',10,'Dr. Vikramaditya Sen','Block A - OPD 105-109','teal'],
    ['radiology','Radiology & Imaging','Scan','MRI, CT-Scan, Digital X-Ray, 4D Ultrasound',5,'Dr. Alok Srivastava','Basement 1 - Diagnostic Wing','indigo'],
    ['pathology','Pathology & Lab Diagnostics','FlaskConical','Biochemistry, hematology, microbiology & rapid PCR',6,'Dr. Sunita Bansal','Ground Floor - Central Lab','emerald'],
  ];
  departments.forEach(d => insertDept.run(...d));

  const insertDoc = db.prepare(`
    INSERT INTO doctors (id,name,title,specialty,department_id,experience,qualification,hospital,location,rating,reviews_count,fee,avatar,about,available_today,available_slots,languages,is_practo_verified)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const doctors = [
    ['doc-1','Dr. Ananya Iyer','Senior Consultant Cardiologist','Cardiology','cardiology','16+ years','MBBS, MD (Gen Med), DM (Cardiology), FACC','MediConnect Super Specialty Hospital, Saket','South Delhi',4.9,342,900,'https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350','Dr. Ananya Iyer has performed over 2,500 successful interventional cardiac procedures. Specializes in preventive cardiology and hypertension management.',1,'["10:00 AM","11:30 AM","02:00 PM","04:30 PM","05:30 PM"]','["English","Hindi","Tamil"]',1],
    ['doc-2','Dr. Vikramaditya Sen','Chief of Internal Medicine','General Medicine','general_medicine','21+ years','MBBS, MD (Internal Medicine), FRCP (London)','MediConnect City Clinic, Connaught Place','Central Delhi',4.9,520,800,'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350','Expert in complex multi-system disorders, adult diabetes control, seasonal flu complications, and preventive wellness checks.',1,'["09:00 AM","10:30 AM","12:00 PM","03:00 PM","05:00 PM"]','["English","Hindi","Bengali"]',1],
    ['doc-3','Dr. Rajeshwar Rao','Head of Orthopedics & Joint Reconstruction','Orthopedics','orthopedics','18+ years','MBBS, MS (Ortho), Fellowship in Joint Replacement (Germany)','MediConnect Super Specialty Hospital, Saket','South Delhi',4.8,289,1100,'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=350','Pioneered minimal-invasive knee and hip replacements in North India. Over 3,200 surgeries performed with 98% success rate.',1,'["11:00 AM","01:00 PM","03:30 PM","05:30 PM"]','["English","Hindi","Telugu"]',1],
    ['doc-4','Dr. Kavita Menon','Senior Neurologist & Stroke Specialist','Neurology','neurology','14+ years','MBBS, MD (Medicine), DM (Neurology), FEAN','MediConnect Neuro Centre, Dwarka','West Delhi',4.8,198,1000,'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=350','Specialist in acute stroke intervention, epilepsy management and neuroimmunology. Trained at AIIMS Delhi.',1,'["10:00 AM","12:00 PM","02:30 PM","04:00 PM"]','["English","Hindi","Malayalam"]',1],
    ['doc-5','Dr. Sandeep Deshmukh','Consultant Pediatrician & Neonatologist','Pediatrics','pediatrics','12+ years','MBBS, MD (Pediatrics), Fellowship (Neonatology)','MediConnect Child Care, Vasant Kunj','South-West Delhi',4.9,412,700,'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=350','Dedicated to child wellness from newborn to adolescent. Expert in neonatal intensive care and childhood vaccinations.',1,'["09:30 AM","11:00 AM","01:30 PM","04:00 PM","05:30 PM"]','["English","Hindi","Marathi"]',1],
    ['doc-6','Dr. Meera Nambiar','Consultant Dermatologist & Trichologist','Dermatology','dermatology','10+ years','MBBS, MD (Dermatology), Fellowship (Cosmetic Derm)','MediConnect Skin & Hair Clinic, Lajpat Nagar','South Delhi',4.7,276,850,'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350','Expert in advanced laser treatments, hair loss solutions and complex skin disorders. Certified trainer for dermal fillers.',1,'["10:30 AM","12:30 PM","03:00 PM","05:00 PM"]','["English","Hindi","Malayalam"]',1],
  ];
  doctors.forEach(d => insertDoc.run(...d));

  // Seed patient
  db.prepare(`
    INSERT INTO patients (id,name,age,gender,blood_group,phone,email,address,allergies,chronic_conditions,emergency_contact)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    'patient-1','Aarav Sharma',28,'Male','O+','+91 98765 43210','aarav.sharma@email.com','Flat 4B, Saket Residency, New Delhi - 110017',
    '["Penicillin","Sulfa Drugs"]','["Type-2 Diabetes (Controlled)","Mild Hypertension"]',
    '{"name":"Priya Sharma","relation":"Sister","phone":"+91 99887 76655"}'
  );

  // Seed appointments
  const insertAppt = db.prepare(`
    INSERT INTO appointments (id,patient_id,doctor_id,doctor_name,specialty,date,time,type,status,token_number,fee)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `);
  insertAppt.run('APT-1001','patient-1','doc-1','Dr. Ananya Iyer','Cardiology','2025-08-10','10:00 AM','OPD','Completed','A-12',900);
  insertAppt.run('APT-1002','patient-1','doc-2','Dr. Vikramaditya Sen','General Medicine','2025-08-22','09:00 AM','OPD','Completed','A-34',800);
  insertAppt.run('APT-1003','patient-1','doc-1','Dr. Ananya Iyer','Cardiology','2025-09-15','11:30 AM','OPD','Upcoming','A-07',900);

  // Seed prescriptions
  const insertRx = db.prepare(`
    INSERT INTO prescriptions (id,appointment_id,patient_id,doctor_id,doctor_name,date,diagnosis,medications,instructions,follow_up)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);
  insertRx.run(
    'RX-5001','APT-1001','patient-1','doc-1','Dr. Ananya Iyer','2025-08-10','Hypertension Stage 1 & Palpitations',
    '[{"name":"Amlodipine 5mg","dose":"Once daily (morning)","duration":"90 days","instructions":"Take with water"},{"name":"Metoprolol 25mg","dose":"Twice daily","duration":"90 days","instructions":"Do not skip doses"}]',
    'Low sodium diet. Avoid caffeine. Walk 30 min daily.','3 months — Sep 2025'
  );
  insertRx.run(
    'RX-5002','APT-1002','patient-1','doc-2','Dr. Vikramaditya Sen','2025-08-22','Seasonal Viral Fever + Type-2 Diabetes Review',
    '[{"name":"Paracetamol 650mg","dose":"Three times daily","duration":"5 days","instructions":"After meals"},{"name":"Metformin 500mg","dose":"Twice daily","duration":"Ongoing","instructions":"With breakfast and dinner"}]',
    'Rest 3 days. Fluids intake high. Avoid cold foods.','1 month — Sep 2025'
  );

  // Seed lab reports
  db.prepare(`
    INSERT INTO lab_reports (id,patient_id,test_name,date,status,results,lab,ordered_by)
    VALUES (?,?,?,?,?,?,?,?)
  `).run(
    'LAB-3001','patient-1','Comprehensive Metabolic Panel (CMP)','2025-08-22','Ready',
    '[{"test":"Blood Glucose (Fasting)","result":"118 mg/dL","normalRange":"70-100 mg/dL","status":"High"},{"test":"HbA1c","result":"6.8%","normalRange":"Below 5.7%","status":"High"},{"test":"Total Cholesterol","result":"195 mg/dL","normalRange":"Below 200 mg/dL","status":"Normal"},{"test":"LDL Cholesterol","result":"122 mg/dL","normalRange":"Below 130 mg/dL","status":"Normal"},{"test":"Creatinine","result":"0.9 mg/dL","normalRange":"0.7-1.3 mg/dL","status":"Normal"}]',
    'MediConnect Central Lab','Dr. Vikramaditya Sen'
  );

  console.log('[MediConnect] Database seeded successfully!');
}

// ── Helper Functions ─────────────────────────────────────────────────────────
const parseJSON = (val, fallback = null) => {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
};

const doctorRow = (row) => row ? {
  id: row.id, name: row.name, title: row.title, specialty: row.specialty,
  departmentId: row.department_id, experience: row.experience,
  qualification: row.qualification, hospital: row.hospital, location: row.location,
  rating: row.rating, reviewsCount: row.reviews_count, fee: row.fee,
  avatar: row.avatar, about: row.about,
  availableToday: row.available_today === 1,
  availableSlots: parseJSON(row.available_slots, []),
  languages: parseJSON(row.languages, []),
  isPractoVerified: row.is_practo_verified === 1
} : null;

const deptRow = (row) => row ? {
  id: row.id, name: row.name, icon: row.icon, description: row.description,
  doctorCount: row.doctor_count, leadDoctor: row.lead_doctor,
  room: row.room, color: row.color
} : null;

const patientRow = (row) => row ? {
  id: row.id, name: row.name, age: row.age, gender: row.gender,
  bloodGroup: row.blood_group, phone: row.phone, email: row.email,
  address: row.address,
  allergies: parseJSON(row.allergies, []),
  chronicConditions: parseJSON(row.chronic_conditions, []),
  emergencyContact: parseJSON(row.emergency_contact, {})
} : null;

const apptRow = (row) => row ? {
  id: row.id, patientId: row.patient_id, doctorId: row.doctor_id,
  doctorName: row.doctor_name, specialty: row.specialty,
  date: row.date, time: row.time, type: row.type, status: row.status,
  tokenNumber: row.token_number, fee: row.fee,
  prescriptionId: row.prescription_id, notes: row.notes
} : null;

const rxRow = (row) => row ? {
  id: row.id, appointmentId: row.appointment_id, patientId: row.patient_id,
  doctorId: row.doctor_id, doctorName: row.doctor_name, date: row.date,
  diagnosis: row.diagnosis, medications: parseJSON(row.medications, []),
  instructions: row.instructions, followUp: row.follow_up
} : null;

const labRow = (row) => row ? {
  id: row.id, patientId: row.patient_id, testName: row.test_name,
  date: row.date, status: row.status, results: parseJSON(row.results, []),
  lab: row.lab, orderedBy: row.ordered_by
} : null;

const sampleRow = (row) => row ? {
  id: row.id, patientId: row.patient_id, packageName: row.package_name,
  tests: parseJSON(row.tests, []), address: row.address, date: row.date,
  timeSlot: row.time_slot, status: row.status,
  phlebotomist: parseJSON(row.phlebotomist, {}),
  timeline: parseJSON(row.timeline, []), amount: row.amount
} : null;

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', db: 'SQLite (mediconnect.db)', timestamp: new Date(), service: 'MediConnect HMS API v2.0' });
});

// ── DEPARTMENTS ──────────────────────────────────────────────────────────────
app.get('/api/departments', (req, res) => {
  const rows = db.prepare('SELECT * FROM departments').all();
  res.json(rows.map(deptRow));
});

app.post('/api/departments', (req, res) => {
  const { name, icon, description, doctorCount, leadDoctor, room, color } = req.body;
  const id = name.toLowerCase().replace(/\s+/g, '_');
  db.prepare(`INSERT INTO departments (id,name,icon,description,doctor_count,lead_doctor,room,color) VALUES (?,?,?,?,?,?,?,?)`)
    .run(id, name, icon, description, doctorCount || 0, leadDoctor, room, color);
  res.status(201).json(deptRow(db.prepare('SELECT * FROM departments WHERE id=?').get(id)));
});

// ── DOCTORS ──────────────────────────────────────────────────────────────────
app.get('/api/doctors', (req, res) => {
  const { department } = req.query;
  const rows = department
    ? db.prepare('SELECT * FROM doctors WHERE department_id=?').all(department)
    : db.prepare('SELECT * FROM doctors').all();
  res.json(rows.map(doctorRow));
});

app.get('/api/doctors/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM doctors WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctorRow(row));
});

app.post('/api/doctors', (req, res) => {
  const d = req.body;
  const id = `doc-${Date.now()}`;
  db.prepare(`
    INSERT INTO doctors (id,name,title,specialty,department_id,experience,qualification,hospital,location,rating,reviews_count,fee,avatar,about,available_today,available_slots,languages,is_practo_verified)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, d.name, d.title, d.specialty, d.departmentId, d.experience, d.qualification, d.hospital, d.location,
    5.0, 1, d.fee || 800, d.avatar || '', d.about || '',
    1, JSON.stringify(d.availableSlots || ['10:00 AM','12:00 PM','03:00 PM','05:00 PM']),
    JSON.stringify(d.languages || ['English']), 1);
  res.status(201).json(doctorRow(db.prepare('SELECT * FROM doctors WHERE id=?').get(id)));
});

app.put('/api/doctors/:id', (req, res) => {
  const d = req.body;
  const existing = db.prepare('SELECT * FROM doctors WHERE id=?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Doctor not found' });
  db.prepare(`
    UPDATE doctors SET name=?,title=?,specialty=?,department_id=?,experience=?,qualification=?,hospital=?,location=?,fee=?,available_today=?,available_slots=?,languages=? WHERE id=?
  `).run(
    d.name || existing.name, d.title || existing.title, d.specialty || existing.specialty,
    d.departmentId || existing.department_id, d.experience || existing.experience,
    d.qualification || existing.qualification, d.hospital || existing.hospital,
    d.location || existing.location, d.fee || existing.fee,
    d.availableToday !== undefined ? (d.availableToday ? 1 : 0) : existing.available_today,
    d.availableSlots ? JSON.stringify(d.availableSlots) : existing.available_slots,
    d.languages ? JSON.stringify(d.languages) : existing.languages,
    req.params.id
  );
  res.json(doctorRow(db.prepare('SELECT * FROM doctors WHERE id=?').get(req.params.id)));
});

// ── PATIENTS ─────────────────────────────────────────────────────────────────
app.get('/api/patients/current', (req, res) => {
  const row = db.prepare('SELECT * FROM patients WHERE id=?').get('patient-1');
  res.json(patientRow(row));
});

app.put('/api/patients/current', (req, res) => {
  const p = req.body;
  db.prepare(`
    UPDATE patients SET name=?,age=?,gender=?,blood_group=?,phone=?,email=?,address=?,allergies=?,chronic_conditions=?,emergency_contact=? WHERE id=?
  `).run(p.name, p.age, p.gender, p.bloodGroup, p.phone, p.email, p.address,
    JSON.stringify(p.allergies || []), JSON.stringify(p.chronicConditions || []),
    JSON.stringify(p.emergencyContact || {}), 'patient-1');
  res.json(patientRow(db.prepare('SELECT * FROM patients WHERE id=?').get('patient-1')));
});

// ── APPOINTMENTS ─────────────────────────────────────────────────────────────
app.get('/api/appointments', (req, res) => {
  const { patientId, doctorId } = req.query;
  let rows;
  if (patientId) rows = db.prepare('SELECT * FROM appointments WHERE patient_id=? ORDER BY date DESC').all(patientId);
  else if (doctorId) rows = db.prepare('SELECT * FROM appointments WHERE doctor_id=? ORDER BY date DESC').all(doctorId);
  else rows = db.prepare('SELECT * FROM appointments ORDER BY date DESC').all();
  res.json(rows.map(apptRow));
});

app.post('/api/appointments', (req, res) => {
  const b = req.body;
  const id = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
  const token = `A-${Math.floor(10 + Math.random() * 90)}`;
  db.prepare(`
    INSERT INTO appointments (id,patient_id,doctor_id,doctor_name,specialty,date,time,type,status,token_number,fee,notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, b.patientId || 'patient-1', b.doctorId, b.doctorName, b.specialty,
    b.date, b.time, b.type || 'OPD', 'Upcoming', token, b.fee || 800, b.notes || '');
  res.status(201).json(apptRow(db.prepare('SELECT * FROM appointments WHERE id=?').get(id)));
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE appointments SET status=? WHERE id=?').run(status, req.params.id);
  res.json(apptRow(db.prepare('SELECT * FROM appointments WHERE id=?').get(req.params.id)));
});

// ── PRESCRIPTIONS ─────────────────────────────────────────────────────────────
app.get('/api/prescriptions', (req, res) => {
  const rows = db.prepare('SELECT * FROM prescriptions ORDER BY date DESC').all();
  res.json(rows.map(rxRow));
});

app.post('/api/prescriptions', (req, res) => {
  const b = req.body;
  const id = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO prescriptions (id,appointment_id,patient_id,doctor_id,doctor_name,date,diagnosis,medications,instructions,follow_up)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `).run(id, b.appointmentId || null, b.patientId || 'patient-1', b.doctorId, b.doctorName,
    date, b.diagnosis, JSON.stringify(b.medications || []), b.instructions, b.followUp);
  if (b.appointmentId) {
    db.prepare('UPDATE appointments SET status=?,prescription_id=? WHERE id=?')
      .run('Completed', id, b.appointmentId);
  }
  res.status(201).json(rxRow(db.prepare('SELECT * FROM prescriptions WHERE id=?').get(id)));
});

// ── LAB REPORTS ───────────────────────────────────────────────────────────────
app.get('/api/lab/reports', (req, res) => {
  const rows = db.prepare('SELECT * FROM lab_reports ORDER BY date DESC').all();
  res.json(rows.map(labRow));
});

app.get('/api/lab/packages', (req, res) => {
  res.json([
    { id: 'pkg-1', name: 'Complete Blood Count (CBC)', tests: ['Hemoglobin','WBC','Platelets','RBC'], price: 349, duration: '4 hours', popular: true },
    { id: 'pkg-2', name: 'Comprehensive Metabolic Panel', tests: ['Blood Glucose','HbA1c','Cholesterol','Creatinine','Liver Enzymes'], price: 799, duration: '6 hours', popular: true },
    { id: 'pkg-3', name: 'Thyroid Profile (T3,T4,TSH)', tests: ['T3','T4','TSH'], price: 549, duration: '8 hours', popular: false },
    { id: 'pkg-4', name: 'Lipid Profile', tests: ['Total Cholesterol','LDL','HDL','Triglycerides'], price: 499, duration: '4 hours', popular: false },
    { id: 'pkg-5', name: 'Diabetes Screening', tests: ['Fasting Glucose','Post-Prandial Glucose','HbA1c','Urine Microalbumin'], price: 649, duration: '6 hours', popular: true },
    { id: 'pkg-6', name: 'Full Body Health Checkup', tests: ['CBC','CMP','Lipid Profile','Thyroid','Urine Analysis','Chest X-Ray'], price: 1999, duration: '1 day', popular: true },
  ]);
});

// ── HOME SAMPLE ORDERS ────────────────────────────────────────────────────────
app.get('/api/lab/home-sample', (req, res) => {
  const rows = db.prepare('SELECT * FROM sample_orders ORDER BY date DESC').all();
  res.json(rows.map(sampleRow));
});

app.post('/api/lab/home-sample', (req, res) => {
  const b = req.body;
  const id = `HSL-${Math.floor(1000 + Math.random() * 9000)}`;
  const timeline = JSON.stringify([
    { step: 'requested', title: 'Order Placed', time: 'Just now', done: true, current: true },
    { step: 'assigned', title: 'Phlebotomist Assigned', time: 'Pending', done: false, current: false },
    { step: 'collected', title: 'Sample Collection at Doorstep', time: 'Pending', done: false, current: false },
    { step: 'processing', title: 'Lab Testing & Quality Check', time: 'Pending', done: false, current: false },
    { step: 'ready', title: 'Digital Report Ready', time: 'Pending', done: false, current: false },
  ]);
  const phlebo = JSON.stringify({ name: 'Assigning Phlebotomist...', phone: '--', rating: '4.9 ★', badge: 'Verified Specialist', vehicle: 'MediConnect Sample Bike' });
  db.prepare(`
    INSERT INTO sample_orders (id,patient_id,package_name,tests,address,date,time_slot,status,phlebotomist,timeline,amount)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, 'patient-1', b.packageName, JSON.stringify(b.tests || []), b.address, b.date, b.timeSlot, 'requested', phlebo, timeline, b.amount || 0);
  res.status(201).json(sampleRow(db.prepare('SELECT * FROM sample_orders WHERE id=?').get(id)));
});

app.patch('/api/lab/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const stepsOrder = ['requested', 'assigned', 'collected', 'processing', 'ready'];
  const currentIdx = stepsOrder.indexOf(status);
  const ord = db.prepare('SELECT * FROM sample_orders WHERE id=?').get(req.params.id);
  if (!ord) return res.status(404).json({ error: 'Order not found' });

  const timeline = parseJSON(ord.timeline, []).map((step, idx) => ({
    ...step,
    done: idx <= currentIdx,
    current: idx === currentIdx,
    time: idx <= currentIdx ? (step.time === 'Pending' ? 'Updated just now' : step.time) : 'Pending'
  }));

  const phlebo = status !== 'requested'
    ? JSON.stringify({ name: 'Ramesh Kumar', phone: '+91 98112 84729', rating: '4.9 ★ (1,200+ samples)', badge: 'Vaccinated & Apollo Certified', vehicle: 'MediConnect Sample Bike (DL 3S CK 4912)' })
    : ord.phlebotomist;

  db.prepare('UPDATE sample_orders SET status=?,phlebotomist=?,timeline=? WHERE id=?')
    .run(status, phlebo, JSON.stringify(timeline), req.params.id);
  res.json(sampleRow(db.prepare('SELECT * FROM sample_orders WHERE id=?').get(req.params.id)));
});

// ── ADMIN STATS ───────────────────────────────────────────────────────────────
app.get('/api/admin/stats', (req, res) => {
  const totalDoctors = db.prepare('SELECT COUNT(*) as c FROM doctors').get().c;
  const totalPatients = db.prepare('SELECT COUNT(*) as c FROM patients').get().c;
  const totalDepts = db.prepare('SELECT COUNT(*) as c FROM departments').get().c;
  const todayAppts = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='Upcoming'").get().c;
  const completedAppts = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='Completed'").get().c;
  const totalRx = db.prepare('SELECT COUNT(*) as c FROM prescriptions').get().c;
  const revenue = db.prepare("SELECT SUM(fee) as total FROM appointments WHERE status='Completed'").get().total || 0;
  const availDoctors = db.prepare('SELECT COUNT(*) as c FROM doctors WHERE available_today=1').get().c;

  res.json({
    totalDoctors, totalPatients, totalDepartments: totalDepts,
    todayAppointments: todayAppts, completedAppointments: completedAppts,
    totalPrescriptions: totalRx, dailyRevenue: revenue,
    availableDoctors: availDoctors,
    bedOccupancy: 73, patientSatisfaction: 4.8,
    avgWaitTime: 12, onlineConsultations: 45
  });
});

// ── CHAT MESSAGES ─────────────────────────────────────────────────────────────
app.get('/api/chat/history', (req, res) => {
  const { sessionId } = req.query;
  const rows = sessionId
    ? db.prepare('SELECT * FROM chat_messages WHERE session_id=? ORDER BY timestamp ASC').all(sessionId)
    : db.prepare('SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 100').all();
  res.json(rows);
});

app.post('/api/chat/message', (req, res) => {
  const { sessionId, sender, message, role } = req.body;
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  db.prepare('INSERT INTO chat_messages (id,session_id,sender,message,timestamp,role) VALUES (?,?,?,?,?,?)')
    .run(id, sessionId || 'default', sender, message, timestamp, role || 'patient');
  res.status(201).json({ id, sessionId, sender, message, timestamp, role });
});

app.delete('/api/chat/history', (req, res) => {
  const { sessionId } = req.query;
  if (sessionId) {
    db.prepare('DELETE FROM chat_messages WHERE session_id=?').run(sessionId);
  }
  res.json({ success: true });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 MediConnect Backend v2.0 running at http://localhost:${PORT}`);
  console.log(`📦 Database: ${DB_PATH}`);
  console.log(`✅ All API endpoints active\n`);
});
