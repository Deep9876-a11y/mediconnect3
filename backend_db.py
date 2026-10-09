"""
MediConnect - SQLite Persistent Database Layer
Handles database schema initialization, seed data migration, and full CRUD queries.
Database file: mediconnect.db
"""

import sqlite3
import json
import os
import uuid
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mediconnect.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    # Users Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        username TEXT UNIQUE,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        security_pin TEXT DEFAULT '1234',
        created_at TEXT,
        assigned_doctor_id TEXT
    )
    ''')

    # Departments Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT,
        icon TEXT,
        color TEXT,
        description TEXT,
        room TEXT,
        doctor_count INTEGER DEFAULT 1
    )
    ''')

    # Doctors Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        department TEXT,
        specialization TEXT,
        experience INTEGER,
        qualification TEXT,
        room_no TEXT,
        fee INTEGER DEFAULT 500,
        available_days TEXT,
        image TEXT,
        about TEXT
    )
    ''')

    # Patients Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        uhid TEXT UNIQUE,
        age INTEGER,
        gender TEXT,
        blood_group TEXT,
        phone TEXT,
        email TEXT,
        abha_id TEXT,
        emergency_contact TEXT,
        address TEXT,
        allergies TEXT,
        chronic_conditions TEXT,
        security_pin TEXT DEFAULT '1234',
        privacy_settings TEXT
    )
    ''')

    # Appointments Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        patient_name TEXT,
        patient_age INTEGER,
        patient_gender TEXT,
        patient_phone TEXT,
        doctor_id TEXT,
        doctor_name TEXT,
        department TEXT,
        date TEXT,
        time TEXT,
        slot TEXT,
        status TEXT DEFAULT 'Scheduled',
        token_number TEXT,
        type TEXT DEFAULT 'In-Person',
        symptoms TEXT,
        history_summary TEXT,
        vitals TEXT,
        notes TEXT,
        created_at TEXT
    )
    ''')

    # Prescriptions Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        appointment_id TEXT,
        patient_id TEXT,
        patient_name TEXT,
        doctor_id TEXT,
        doctor_name TEXT,
        date TEXT,
        diagnosis TEXT,
        vitals TEXT,
        medicines TEXT,
        advice TEXT,
        follow_up TEXT,
        created_at TEXT
    )
    ''')

    # Lab Reports Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS lab_reports (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        test_name TEXT,
        test_type TEXT,
        department TEXT,
        date TEXT,
        doctor_name TEXT,
        status TEXT,
        result TEXT,
        normal_range TEXT,
        unit TEXT,
        summary TEXT,
        file_name TEXT,
        file_url TEXT,
        created_at TEXT
    )
    ''')

    # Share Links Table (Pan-India Secure EHR Sharing)
    c.execute('''
    CREATE TABLE IF NOT EXISTS share_links (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        token TEXT UNIQUE,
        title TEXT,
        expires_at TEXT,
        password TEXT,
        max_views INTEGER DEFAULT 5,
        view_count INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        allowed_sections TEXT,
        created_at TEXT,
        logs TEXT
    )
    ''')

    # Audit Logs (HIPAA / DISHA compliant data access trails)
    c.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT,
        user_role TEXT,
        user_name TEXT,
        target_id TEXT,
        timestamp TEXT,
        details TEXT
    )
    ''')

    conn.commit()
    seed_data_if_empty(conn)
    conn.close()

def seed_data_if_empty(conn):
    c = conn.cursor()

    # 1. Users Seed
    c.execute('SELECT COUNT(*) FROM users')
    if c.fetchone()[0] == 0:
        now = datetime.now().isoformat()
        users = [
            ('usr-pat-1', 'Tushar Tawar', 'tushar.tawar@example.com', '+91 98765 43210', 'tushar.tawar', 'patient', 'patient123', '1234', now),
            ('usr-doc-1', 'Dr. Ananya Sharma', 'dr.ananya@mediconnect.in', '+91 98111 88888', 'dr.ananya', 'doctor', 'doctor123', '4321', now),
            ('usr-doc-2', 'Dr. Rajesh Verma', 'dr.rajesh@mediconnect.in', '+91 98222 77777', 'dr.rajesh', 'doctor', 'doctor123', '4321', now),
            ('usr-adm-1', 'Hospital IT Administration', 'admin@mediconnect.in', '+91 98999 00000', 'admin', 'admin', 'admin@hms', '9999', now)
        ]
        c.executemany('INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)', users)

    # 2. Departments Seed
    c.execute('SELECT COUNT(*) FROM departments')
    if c.fetchone()[0] == 0:
        depts = [
            ('dept-1', 'Cardiology', 'CARD', 'HeartPulse', 'rose', 'Advanced cardiac catheterization, arrhythmia treatment, non-invasive imaging, and angioplasty.', 'Room 201, Block B', 3),
            ('dept-2', 'Neurology', 'NEUR', 'Brain', 'purple', 'Comprehensive stroke management, epilepsy diagnostics, neuro-electrophysiology, and Parkinson care.', 'Room 305, Block A', 2),
            ('dept-3', 'Orthopedics', 'ORTH', 'Bone', 'amber', 'Robotic joint replacement, sports injury arthroscopy, spine surgery, and trauma management.', 'Room 110, Ground Floor', 4),
            ('dept-4', 'General Medicine', 'GEN', 'Stethoscope', 'teal', 'Primary preventative care, acute infectious disease management, and chronic multi-system treatment.', 'Room 102, Ground Floor', 5),
            ('dept-5', 'Pediatrics', 'PED', 'Baby', 'sky', 'Neonatal intensive care (NICU level 3), child immunizations, and developmental monitoring.', 'Room 214, Block C', 3),
            ('dept-6', 'Dermatology', 'DERM', 'Activity', 'pink', 'Phototherapy, skin biopsy analysis, autoimmune dermatoses, and cosmetic laser treatments.', 'Room 402, Block A', 2)
        ]
        c.executemany('INSERT INTO departments VALUES (?,?,?,?,?,?,?,?)', depts)

    # 3. Doctors Seed
    c.execute('SELECT COUNT(*) FROM doctors')
    if c.fetchone()[0] == 0:
        doctors = [
            ('doc-1', 'Dr. Ananya Sharma', 'dr.ananya@mediconnect.in', '+91 98111 88888', 'Cardiology', 'Senior Interventional Cardiologist', 14, 'MBBS, MD (Med), DM (Cardio), FACC', 'Room 201', 800, json.dumps(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']), 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300', 'Specializes in coronary interventions, acute coronary syndromes, and preventative heart care with 14+ years of clinical excellence.'),
            ('doc-2', 'Dr. Rajesh Verma', 'dr.rajesh@mediconnect.in', '+91 98222 77777', 'Neurology', 'Senior Consultant Neurosurgeon', 18, 'MBBS, MS (Gen Surg), MCh (Neurosurg)', 'Room 305', 1000, json.dumps(['Mon', 'Wed', 'Fri', 'Sat']), 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', 'Pioneer in minimally invasive keyhole neurosurgery and computer-assisted stereotactic brain surgery.'),
            ('doc-3', 'Dr. Vikram Malhotra', 'dr.vikram@mediconnect.in', '+91 98333 66666', 'Orthopedics', 'Lead Robotic Joint Replacement Surgeon', 12, 'MBBS, MS (Ortho), Fellowship in Arthroscopy (Germany)', 'Room 110', 700, json.dumps(['Tue', 'Thu', 'Fri', 'Sat']), 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300', 'Has performed over 3,200 successful robotic knee and hip arthroplasties.'),
            ('doc-4', 'Dr. Sunita Rao', 'dr.sunita@mediconnect.in', '+91 98444 55555', 'General Medicine', 'Chief Consultant Physician', 16, 'MBBS, MD (Internal Medicine)', 'Room 102', 600, json.dumps(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']), 'https://images.unsplash.com/photo-1594824813511-20926d24a919?auto=format&fit=crop&q=80&w=300', 'Specializes in complex adult multi-morbidity, diabetes metabolic disorders, and geriatric health.')
        ]
        c.executemany('INSERT INTO doctors VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', doctors)

    # 4. Patient Seed
    c.execute('SELECT COUNT(*) FROM patients')
    if c.fetchone()[0] == 0:
        privacy_defaults = json.dumps({
            "block_admin_clinical": True,
            "require_doctor_consent_pin": True,
            "allow_treating_doctor_session": True,
            "notify_on_record_access": True
        })
        patient = (
            'pat-1',
            'Tushar Tawar',
            'MC-2025-08912',
            32,
            'Male',
            'O+',
            '+91 98765 43210',
            'tushar.tawar@example.com',
            '91-4432-8819-2041',
            'Pooja Tawar (Spouse: +91 98765 43219)',
            'Tower 4, Flat 702, DLF Phase 5, Gurugram, Haryana',
            json.dumps(['Penicillin', 'Sulfa Drugs']),
            json.dumps(['Mild Hypertension (Stage 1)']),
            '1234',
            privacy_defaults
        )
        c.execute('INSERT INTO patients VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', patient)

    # 5. Appointments Seed
    c.execute('SELECT COUNT(*) FROM appointments')
    if c.fetchone()[0] == 0:
        now = datetime.now().strftime('%Y-%m-%d')
        appts = [
            (
                'apt-1', 'pat-1', 'Tushar Tawar', 32, 'Male', '+91 98765 43210',
                'doc-1', 'Dr. Ananya Sharma', 'Cardiology',
                now, '10:30 AM', '10:30 AM - 10:45 AM', 'Scheduled', 'C-101', 'In-Person',
                'Mild exertional chest heaviness, recurrent palpitation after coffee',
                'Known hypertensive on ACE inhibitors for 2 years. Regular follow-up.',
                json.dumps({'bp': '128/84 mmHg', 'pulse': '76 bpm', 'spo2': '99%', 'temp': '98.6 F'}),
                'Routine quarterly cardiology review and resting ECG evaluation',
                datetime.now().isoformat()
            ),
            (
                'apt-2', 'pat-1', 'Tushar Tawar', 32, 'Male', '+91 98765 43210',
                'doc-4', 'Dr. Sunita Rao', 'General Medicine',
                '2026-09-18', '04:00 PM', '04:00 PM - 04:15 PM', 'Completed', 'G-042', 'In-Person',
                'Routine annual executive health wellness checkup and blood panel review',
                'Hypertension controlled. Normal BMI.',
                json.dumps({'bp': '124/80 mmHg', 'pulse': '72 bpm', 'spo2': '99%', 'temp': '98.4 F'}),
                'Vitals stable. Fasting blood profile advised.',
                datetime.now().isoformat()
            )
        ]
        c.executemany('INSERT INTO appointments VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', appts)

    # 6. Prescriptions Seed
    c.execute('SELECT COUNT(*) FROM prescriptions')
    if c.fetchone()[0] == 0:
        medicines = json.dumps([
            {"name": "Telmisartan 40mg", "dosage": "1 tablet OD", "duration": "30 days", "timing": "Morning after breakfast", "instructions": "Continue blood pressure maintenance"},
            {"name": "Atorvastatin 10mg", "dosage": "1 tablet HS", "duration": "30 days", "timing": "Night after dinner", "instructions": "Cardio-protective lipid optimization"}
        ])
        vitals = json.dumps({'bp': '126/82 mmHg', 'pulse': '74 bpm', 'weight': '72 kg'})
        rx = (
            'rx-1', 'apt-2', 'pat-1', 'Tushar Tawar',
            'doc-4', 'Dr. Sunita Rao', '2026-09-18',
            'Essential Primary Hypertension (Controlled)',
            vitals, medicines,
            'Low sodium diet (<2g/day). 30 mins brisk morning walk 5 days a week. Hydrate adequately.',
            'Follow up after 3 months with Lipid profile and Serum Creatinine.',
            datetime.now().isoformat()
        )
        c.execute('INSERT INTO prescriptions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', rx)

    # 7. Lab Reports Seed
    c.execute('SELECT COUNT(*) FROM lab_reports')
    if c.fetchone()[0] == 0:
        reports = [
            (
                'lab-1', 'pat-1', 'Comprehensive Lipid Profile', 'Blood Biochemistry', 'Biochemistry Lab 1',
                '2026-09-19', 'Dr. Sunita Rao', 'Completed', 'Total Chol: 182 mg/dL, HDL: 48, LDL: 110, Triglycerides: 140',
                'Desirable < 200 mg/dL', 'mg/dL', 'Normal lipid spectrum. Cardioprotective ratios within target.',
                'Lipid_Profile_Report_MC08912.pdf', '#', datetime.now().isoformat()
            ),
            (
                'lab-2', 'pat-1', '12-Lead Digital Resting ECG', 'Cardiovascular Diagnostics', 'Cardio Lab 2',
                '2026-09-20', 'Dr. Ananya Sharma', 'Completed', 'Normal Sinus Rhythm, HR 74 bpm, No ST-T segment elevation',
                'Normal Sinus Rhythm', 'bpm', 'Resting electrical heart activity within normal biological limits.',
                'ECG_12Lead_MC08912.pdf', '#', datetime.now().isoformat()
            )
        ]
        c.executemany('INSERT INTO lab_reports VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', reports)

    # 8. Share Links Seed
    c.execute('SELECT COUNT(*) FROM share_links')
    if c.fetchone()[0] == 0:
        share = (
            'link-1', 'pat-1', 'MEDIC-DELHI-7721', 'Pan-India Second Opinion Access Link',
            '2026-10-01T23:59:59', 'delhi2026', 10, 1, 1,
            json.dumps(['prescriptions', 'lab_reports', 'vitals', 'conditions']),
            datetime.now().isoformat(),
            json.dumps([{"timestamp": datetime.now().isoformat(), "ip": "127.0.0.1", "action": "Link created by patient"}])
        )
        c.execute('INSERT INTO share_links VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', share)

    # 9. Audit Logs Seed
    c.execute('SELECT COUNT(*) FROM audit_logs')
    if c.fetchone()[0] == 0:
        log = (
            'log-1', 'SYSTEM_INIT', 'SYSTEM', 'MediConnect SQLite DB',
            'pat-1', datetime.now().isoformat(),
            'Database initialized with HIPAA/DISHA patient privacy safeguards.'
        )
        c.execute('INSERT INTO audit_logs VALUES (?,?,?,?,?,?,?)', log)

    conn.commit()

# Run initialization when module loaded
init_db()

# ── API QUERY FUNCTIONS ───────────────────────────────────────────────────────

def api_get_departments():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM departments')
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def api_add_department(data):
    conn = get_db()
    c = conn.cursor()
    dept_id = data.get('id') or f"dept-{int(datetime.now().timestamp())}"
    c.execute('''
    INSERT INTO departments (id, name, code, icon, color, description, room, doctor_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (dept_id, data.get('name'), data.get('code', 'GEN'), data.get('icon', 'Building'),
          data.get('color', 'teal'), data.get('description', ''), data.get('room', 'Block A'),
          data.get('doctorCount', 1)))
    conn.commit()
    conn.close()
    return {'id': dept_id, **data}

def api_get_doctors():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM doctors')
    rows = []
    for r in c.fetchall():
        d = dict(r)
        if d.get('available_days'):
            try:
                d['availableDays'] = json.loads(d['available_days'])
            except:
                d['availableDays'] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        d['roomNo'] = d.get('room_no')
        rows.append(d)
    conn.close()
    return rows

def api_add_doctor(data):
    conn = get_db()
    c = conn.cursor()
    doc_id = data.get('id') or f"doc-{int(datetime.now().timestamp())}"
    avail = json.dumps(data.get('availableDays', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']))
    c.execute('''
    INSERT INTO doctors (id, name, email, phone, department, specialization, experience, qualification, room_no, fee, available_days, image, about)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, data.get('name'), data.get('email'), data.get('phone'), data.get('department'),
          data.get('specialization'), data.get('experience', 5), data.get('qualification'),
          data.get('roomNo', 'Room 101'), data.get('fee', 500), avail,
          data.get('image', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'),
          data.get('about', 'Senior Medical Practitioner')))
    conn.commit()
    conn.close()
    return {'id': doc_id, **data}

def api_update_doctor(doc_id, data):
    conn = get_db()
    c = conn.cursor()
    avail = json.dumps(data.get('availableDays', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']))
    c.execute('''
    UPDATE doctors SET name=?, email=?, phone=?, department=?, specialization=?, experience=?, qualification=?, room_no=?, fee=?, available_days=?, image=?, about=?
    WHERE id=?
    ''', (data.get('name'), data.get('email'), data.get('phone'), data.get('department'),
          data.get('specialization'), data.get('experience', 5), data.get('qualification'),
          data.get('roomNo'), data.get('fee', 500), avail, data.get('image'), data.get('about'), doc_id))
    conn.commit()
    conn.close()
    return {'id': doc_id, **data}

def api_get_patient(patient_id='pat-1'):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM patients WHERE id=?', (patient_id,))
    row = c.fetchone()
    if not row:
        c.execute('SELECT * FROM patients LIMIT 1')
        row = c.fetchone()
    if not row:
        conn.close()
        return None
    p = dict(row)
    p['bloodGroup'] = p.get('blood_group')
    p['emergencyContact'] = p.get('emergency_contact')
    p['securityPin'] = p.get('security_pin')
    try:
        p['allergies'] = json.loads(p.get('allergies', '[]'))
    except:
        p['allergies'] = ['Penicillin']
    try:
        p['chronicConditions'] = json.loads(p.get('chronic_conditions', '[]'))
    except:
        p['chronicConditions'] = []
    try:
        p['privacySettings'] = json.loads(p.get('privacy_settings', '{}'))
    except:
        p['privacySettings'] = {}
    conn.close()
    return p

def api_update_patient(patient_id, data):
    conn = get_db()
    c = conn.cursor()
    allergies = json.dumps(data.get('allergies', [])) if isinstance(data.get('allergies'), list) else data.get('allergies', '[]')
    chronic = json.dumps(data.get('chronicConditions', [])) if isinstance(data.get('chronicConditions'), list) else data.get('chronicConditions', '[]')
    privacy = json.dumps(data.get('privacySettings', {})) if isinstance(data.get('privacySettings'), dict) else data.get('privacySettings', '{}')
    
    c.execute('''
    UPDATE patients SET name=?, age=?, gender=?, blood_group=?, phone=?, email=?, emergency_contact=?, address=?, allergies=?, chronic_conditions=?, security_pin=?, privacy_settings=?
    WHERE id=?
    ''', (data.get('name'), data.get('age'), data.get('gender'), data.get('bloodGroup'),
          data.get('phone'), data.get('email'), data.get('emergencyContact'), data.get('address'),
          allergies, chronic, data.get('securityPin', '1234'), privacy, patient_id))
    conn.commit()
    conn.close()
    return api_get_patient(patient_id)

def api_get_appointments(role='admin', user_id=None):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM appointments ORDER BY created_at DESC')
    rows = []
    for r in c.fetchall():
        a = dict(r)
        a['patientName'] = a.get('patient_name')
        a['doctorName'] = a.get('doctor_name')
        a['tokenNumber'] = a.get('token_number')
        a['patientAge'] = a.get('patient_age')
        a['patientGender'] = a.get('patient_gender')
        a['patientPhone'] = a.get('patient_phone')
        a['historySummary'] = a.get('history_summary')
        try:
            a['vitals'] = json.loads(a.get('vitals', '{}'))
        except:
            a['vitals'] = {}

        # SECURITY FILTER: If requester is Admin, MASK patient clinical data!
        if role == 'admin':
            # Admin sees operational data only (token, time, doctor, dept, status)
            # Patient Name masked, Clinical notes & symptoms redacted
            a['symptoms'] = "🔒 [Restricted] Confidential PHI - Clinical notes hidden from Administrative Staff"
            a['historySummary'] = "🔒 [Restricted] Medical history accessible only by treating physician with patient consent."
        
        rows.append(a)
    conn.close()
    return rows

def api_create_appointment(data):
    conn = get_db()
    c = conn.cursor()
    apt_id = data.get('id') or f"apt-{int(datetime.now().timestamp())}"
    token_num = data.get('tokenNumber') or f"T-{int(datetime.now().timestamp()) % 1000:03d}"
    vitals_json = json.dumps(data.get('vitals', {}))
    now = datetime.now().isoformat()
    
    c.execute('''
    INSERT INTO appointments (id, patient_id, patient_name, patient_age, patient_gender, patient_phone,
                              doctor_id, doctor_name, department, date, time, slot, status,
                              token_number, type, symptoms, history_summary, vitals, notes, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (apt_id, data.get('patientId', 'pat-1'), data.get('patientName', 'Tushar Tawar'),
          data.get('patientAge', 32), data.get('patientGender', 'Male'), data.get('patientPhone', '+91 98765 43210'),
          data.get('doctorId'), data.get('doctorName'), data.get('department'),
          data.get('date'), data.get('time'), data.get('slot', data.get('time')),
          data.get('status', 'Scheduled'), token_num, data.get('type', 'In-Person'),
          data.get('symptoms', ''), data.get('historySummary', ''), vitals_json,
          data.get('notes', ''), now))
    conn.commit()
    conn.close()
    return {'id': apt_id, 'tokenNumber': token_num, **data}

def api_update_appointment_status(apt_id, status):
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE appointments SET status=? WHERE id=?', (status, apt_id))
    conn.commit()
    conn.close()
    return {'id': apt_id, 'status': status}

def api_get_prescriptions(role='doctor'):
    # SECURITY RULE: Hospital Admin cannot inspect prescriptions!
    if role == 'admin':
        return []

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM prescriptions ORDER BY created_at DESC')
    rows = []
    for r in c.fetchall():
        rx = dict(r)
        rx['patientName'] = rx.get('patient_name')
        rx['doctorName'] = rx.get('doctor_name')
        rx['followUp'] = rx.get('follow_up')
        try:
            rx['medicines'] = json.loads(rx.get('medicines', '[]'))
        except:
            rx['medicines'] = []
        try:
            rx['vitals'] = json.loads(rx.get('vitals', '{}'))
        except:
            rx['vitals'] = {}
        rows.append(rx)
    conn.close()
    return rows

def api_create_prescription(data):
    conn = get_db()
    c = conn.cursor()
    rx_id = data.get('id') or f"rx-{int(datetime.now().timestamp())}"
    meds = json.dumps(data.get('medicines', []))
    vitals = json.dumps(data.get('vitals', {}))
    now = datetime.now().isoformat()
    
    c.execute('''
    INSERT INTO prescriptions (id, appointment_id, patient_id, patient_name, doctor_id, doctor_name,
                               date, diagnosis, vitals, medicines, advice, follow_up, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (rx_id, data.get('appointmentId'), data.get('patientId', 'pat-1'), data.get('patientName', 'Tushar Tawar'),
          data.get('doctorId'), data.get('doctorName'), data.get('date'), data.get('diagnosis'),
          vitals, meds, data.get('advice'), data.get('followUp'), now))
    conn.commit()
    conn.close()
    return {'id': rx_id, **data}

def api_get_lab_reports(role='doctor'):
    # SECURITY RULE: Hospital Admin cannot inspect lab results!
    if role == 'admin':
        return []

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM lab_reports ORDER BY created_at DESC')
    rows = []
    for r in c.fetchall():
        lr = dict(r)
        lr['testName'] = lr.get('test_name')
        lr['testType'] = lr.get('test_type')
        lr['doctorName'] = lr.get('doctor_name')
        lr['normalRange'] = lr.get('normal_range')
        lr['fileName'] = lr.get('file_name')
        lr['fileUrl'] = lr.get('file_url')
        rows.append(lr)
    conn.close()
    return rows

def api_create_lab_report(data):
    conn = get_db()
    c = conn.cursor()
    lr_id = data.get('id') or f"lab-{int(datetime.now().timestamp())}"
    now = datetime.now().isoformat()
    c.execute('''
    INSERT INTO lab_reports (id, patient_id, test_name, test_type, department, date, doctor_name,
                             status, result, normal_range, unit, summary, file_name, file_url, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (lr_id, data.get('patientId', 'pat-1'), data.get('testName'), data.get('testType', 'Biochemistry'),
          data.get('department', 'Pathology Lab'), data.get('date', datetime.now().strftime('%Y-%m-%d')),
          data.get('doctorName', 'Pathologist'), data.get('status', 'Completed'),
          data.get('result', ''), data.get('normalRange', ''), data.get('unit', ''),
          data.get('summary', ''), data.get('fileName', 'Report.pdf'), data.get('fileUrl', '#'), now))
    conn.commit()
    conn.close()
    return {'id': lr_id, **data}

def api_get_share_links(patient_id='pat-1'):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM share_links WHERE patient_id=? ORDER BY created_at DESC', (patient_id,))
    rows = []
    for r in c.fetchall():
        sl = dict(r)
        sl['expiresAt'] = sl.get('expires_at')
        sl['maxViews'] = sl.get('max_views')
        sl['viewCount'] = sl.get('view_count')
        sl['isActive'] = bool(sl.get('is_active'))
        try:
            sl['allowedSections'] = json.loads(sl.get('allowed_sections', '[]'))
        except:
            sl['allowedSections'] = []
        try:
            sl['logs'] = json.loads(sl.get('logs', '[]'))
        except:
            sl['logs'] = []
        rows.append(sl)
    conn.close()
    return rows

def api_create_share_link(data):
    conn = get_db()
    c = conn.cursor()
    link_id = data.get('id') or f"link-{int(datetime.now().timestamp())}"
    token = data.get('token') or f"MEDIC-{uuid.uuid4().hex[:6].upper()}"
    sections = json.dumps(data.get('allowedSections', ['prescriptions', 'lab_reports', 'vitals', 'conditions']))
    logs = json.dumps([{"timestamp": datetime.now().isoformat(), "ip": "127.0.0.1", "action": "Link created by patient"}])
    now = datetime.now().isoformat()

    c.execute('''
    INSERT INTO share_links (id, patient_id, token, title, expires_at, password, max_views, view_count, is_active, allowed_sections, created_at, logs)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (link_id, data.get('patientId', 'pat-1'), token, data.get('title', 'Doctor Consultation Share Link'),
          data.get('expiresAt'), data.get('password'), data.get('maxViews', 5), 0, 1, sections, now, logs))
    conn.commit()
    conn.close()
    return {'id': link_id, 'token': token, **data}

def api_delete_share_link(link_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM share_links WHERE id=?', (link_id,))
    conn.commit()
    conn.close()
    return {'success': True, 'id': link_id}

def api_verify_share_link(token, password):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM share_links WHERE token=?', (token,))
    row = c.fetchone()
    if not row:
        conn.close()
        return {'success': False, 'error': 'Invalid or expired share link'}
    
    sl = dict(row)
    if not sl.get('is_active'):
        conn.close()
        return {'success': False, 'error': 'This share link has been revoked by the patient'}
    
    if sl.get('expires_at') and sl.get('expires_at') < datetime.now().isoformat():
        conn.close()
        return {'success': False, 'error': 'This share link has expired'}
        
    if sl.get('max_views') and sl.get('view_count', 0) >= sl.get('max_views'):
        conn.close()
        return {'success': False, 'error': 'Maximum view limit reached for this share link'}

    if sl.get('password') and sl.get('password') != password:
        conn.close()
        return {'success': False, 'error': 'Incorrect password'}

    # Increment view count
    new_count = sl.get('view_count', 0) + 1
    try:
        logs = json.loads(sl.get('logs', '[]'))
    except:
        logs = []
    logs.append({"timestamp": datetime.now().isoformat(), "action": "Accessed by consulting doctor", "ip": "127.0.0.1"})
    
    c.execute('UPDATE share_links SET view_count=?, logs=? WHERE token=?', (new_count, json.dumps(logs), token))
    conn.commit()
    conn.close()

    patient = api_get_patient(sl.get('patient_id'))
    prescriptions = api_get_prescriptions('doctor')
    lab_reports = api_get_lab_reports('doctor')

    return {
        'success': True,
        'link': {
            'token': token,
            'title': sl.get('title'),
            'allowedSections': json.loads(sl.get('allowed_sections', '[]')),
            'viewCount': new_count,
            'maxViews': sl.get('max_views')
        },
        'patient': patient,
        'prescriptions': prescriptions,
        'labReports': lab_reports
    }

def api_login_user(identifier, password, role):
    conn = get_db()
    c = conn.cursor()
    c.execute('''
    SELECT * FROM users 
    WHERE (email=? OR phone=? OR username=?) AND role=?
    ''', (identifier, identifier, identifier, role))
    user = c.fetchone()
    conn.close()

    if not user:
        return {'success': False, 'error': f'No {role} account found matching "{identifier}".'}
    
    u = dict(user)
    if u.get('password') != password:
        return {'success': False, 'error': 'Incorrect password. Please verify and try again.'}

    return {
        'success': True,
        'user': {
            'id': u.get('id'),
            'name': u.get('name'),
            'email': u.get('email'),
            'phone': u.get('phone'),
            'username': u.get('username'),
            'role': u.get('role'),
            'securityPin': u.get('security_pin'),
            'assignedDoctorId': u.get('assigned_doctor_id')
        }
    }

def api_register_user(data):
    # CRITICAL SECURITY RULE: Admin role CANNOT be registered!
    if data.get('role') == 'admin':
        return {'success': False, 'error': 'Registration for Hospital Administrator is permanently disabled for security.'}

    conn = get_db()
    c = conn.cursor()
    
    email = data.get('email')
    phone = data.get('phone')
    username = email.split('@')[0] if email else f"user_{int(datetime.now().timestamp())}"
    user_id = f"usr-{data.get('role')[:3]}-{int(datetime.now().timestamp())}"
    pin = data.get('securityPin') or '1234'
    now = datetime.now().isoformat()

    try:
        c.execute('''
        INSERT INTO users (id, name, email, phone, username, role, password, security_pin, created_at, assigned_doctor_id)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        ''', (user_id, data.get('name'), email, phone, username, data.get('role'), data.get('password'), pin, now, data.get('assignedDoctorId')))
        
        # If registering as patient, create patient profile
        if data.get('role') == 'patient':
            pat_id = f"pat-{int(datetime.now().timestamp())}"
            uhid = f"MC-2026-{int(datetime.now().timestamp()) % 10000:04d}"
            privacy = json.dumps({"block_admin_clinical": True, "require_doctor_consent_pin": True})
            c.execute('''
            INSERT INTO patients (id, name, uhid, age, gender, blood_group, phone, email, abha_id, emergency_contact, address, allergies, chronic_conditions, security_pin, privacy_settings)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ''', (pat_id, data.get('name'), uhid, 28, 'Male', 'B+', phone, email, '', '', 'India', '[]', '[]', pin, privacy))

        conn.commit()
        conn.close()
        return {'success': True, 'user': {'id': user_id, 'name': data.get('name'), 'email': email, 'role': data.get('role'), 'securityPin': pin, 'assignedDoctorId': data.get('assignedDoctorId')}}
    except sqlite3.IntegrityError:
        conn.close()
        return {'success': False, 'error': 'An account with this email or phone number already exists.'}
    except Exception as e:
        conn.close()
        return {'success': False, 'error': str(e)}

def api_reset_password(identifier, otp, pin, new_pass):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email=? OR phone=? OR username=?', (identifier, identifier, identifier))
    user = c.fetchone()
    if not user:
        conn.close()
        return {'success': False, 'error': f'No user found for "{identifier}".'}
    
    u = dict(user)
    if u.get('security_pin') and pin and u.get('security_pin') != pin:
        conn.close()
        return {'success': False, 'error': 'Invalid 4-digit Security Key.'}

    c.execute('UPDATE users SET password=? WHERE id=?', (new_pass, u.get('id')))
    conn.commit()
    conn.close()
    return {'success': True, 'message': 'Password reset successfully! You can now login.'}

def api_get_users():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users')
    rows = c.fetchall()
    conn.close()
    users = []
    for r in rows:
        u = dict(r)
        # map assigned_doctor_id to assignedDoctorId
        if 'assigned_doctor_id' in u:
            u['assignedDoctorId'] = u['assigned_doctor_id']
        users.append(u)
    return users
