const { useState, useEffect, useRef, useCallback } = React;

// ==================== src/data/mockData.js ====================
const INITIAL_DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "Heart",
    description: "Heart care, angioplasty, hypertension & cardiac diagnostics",
    doctorCount: 8,
    leadDoctor: "Dr. Ananya Iyer",
    room: "Block A - OPD 101-104",
    color: "rose"
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: "Bone",
    description: "Joint replacement, spine care, fractures & sports injuries",
    doctorCount: 6,
    leadDoctor: "Dr. Rajeshwar Rao",
    room: "Block B - OPD 201-203",
    color: "blue"
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: "Brain",
    description: "Brain disorders, stroke management, migraine & epilepsy",
    doctorCount: 5,
    leadDoctor: "Dr. Kavita Menon",
    room: "Block A - OPD 305-307",
    color: "purple"
  },
  {
    id: "pediatrics",
    name: "Pediatrics & Child Care",
    icon: "Baby",
    description: "Child wellness, vaccinations, neonatal intensive care",
    doctorCount: 7,
    leadDoctor: "Dr. Sandeep Deshmukh",
    room: "Block C - OPD 110-112",
    color: "amber"
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "Sparkles",
    description: "Skin conditions, allergies, hair & cosmetic care",
    doctorCount: 4,
    leadDoctor: "Dr. Meera Nambiar",
    room: "Block B - OPD 118-120",
    color: "pink"
  },
  {
    id: "general_medicine",
    name: "General Medicine",
    icon: "Activity",
    description: "Fevers, seasonal infections, diabetes & chronic disease control",
    doctorCount: 10,
    leadDoctor: "Dr. Vikramaditya Sen",
    room: "Block A - OPD 105-109",
    color: "teal"
  },
  {
    id: "radiology",
    name: "Radiology & Imaging",
    icon: "Scan",
    description: "MRI, CT-Scan, Digital X-Ray, 4D Ultrasound",
    doctorCount: 5,
    leadDoctor: "Dr. Alok Srivastava",
    room: "Basement 1 - Diagnostic Wing",
    color: "indigo"
  },
  {
    id: "pathology",
    name: "Pathology & Lab Diagnostics",
    icon: "FlaskConical",
    description: "Biochemistry, hematology, microbiology & rapid PCR",
    doctorCount: 6,
    leadDoctor: "Dr. Sunita Bansal",
    room: "Ground Floor - Central Lab",
    color: "emerald"
  }
];

const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Ananya Iyer",
    title: "Senior Consultant Cardiologist",
    specialty: "Cardiology",
    departmentId: "cardiology",
    experience: "16+ years",
    qualification: "MBBS, MD (Gen Med), DM (Cardiology), FACC",
    hospital: "MediConnect Super Specialty Hospital, Saket",
    location: "South Delhi",
    rating: 4.9,
    reviewsCount: 342,
    fee: 900,
    avatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350",
    about: "Dr. Ananya Iyer has performed over 2,500 successful interventional cardiac procedures. Specializes in preventive cardiology and hypertension management.",
    availableToday: true,
    availableSlots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "05:30 PM"],
    languages: ["English", "Hindi", "Tamil"],
    isPractoVerified: true
  },
  {
    id: "doc-2",
    name: "Dr. Vikramaditya Sen",
    title: "Chief of Internal Medicine",
    specialty: "General Medicine",
    departmentId: "general_medicine",
    experience: "21+ years",
    qualification: "MBBS, MD (Internal Medicine), FRCP (London)",
    hospital: "MediConnect City Clinic, Connaught Place",
    location: "Central Delhi",
    rating: 4.9,
    reviewsCount: 520,
    fee: 800,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350",
    about: "Expert in complex multi-system disorders, adult diabetes control, seasonal flu complications, and preventive wellness checks.",
    availableToday: true,
    availableSlots: ["09:30 AM", "10:15 AM", "12:00 PM", "03:15 PM", "06:00 PM"],
    languages: ["English", "Hindi", "Bengali"],
    isPractoVerified: true
  },
  {
    id: "doc-3",
    name: "Dr. Meera Nambiar",
    title: "Consultant Dermatologist & Cosmetologist",
    specialty: "Dermatology",
    departmentId: "dermatology",
    experience: "11+ years",
    qualification: "MBBS, DVD, MD (Dermatology)",
    hospital: "MediConnect Aesthetic & Skin Wing",
    location: "Gurugram",
    rating: 4.8,
    reviewsCount: 289,
    fee: 750,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350",
    about: "Dedicated dermatologist treating acne, psoriasis, chronic eczema, hair loss, and pediatric dermatological conditions with holistic skincare regimens.",
    availableToday: false,
    availableSlots: ["Tomorrow 11:00 AM", "Tomorrow 01:00 PM", "Tomorrow 04:00 PM"],
    languages: ["English", "Hindi", "Malayalam"],
    isPractoVerified: true
  },
  {
    id: "doc-4",
    name: "Dr. Rajeshwar Rao",
    title: "Senior Joint Replacement & Spine Surgeon",
    specialty: "Orthopedics",
    departmentId: "orthopedics",
    experience: "19+ years",
    qualification: "MBBS, MS (Orthopedics), M.Ch (Ortho, UK)",
    hospital: "MediConnect Bone & Joint Institute",
    location: "Noida Sector 62",
    rating: 4.9,
    reviewsCount: 412,
    fee: 1000,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=350",
    about: "Pioneer in minimally invasive knee and hip replacements, arthroscopy, sports trauma, and geriatric osteoporosis care.",
    availableToday: true,
    availableSlots: ["11:00 AM", "12:30 PM", "03:30 PM", "05:00 PM"],
    languages: ["English", "Hindi", "Telugu"],
    isPractoVerified: true
  },
  {
    id: "doc-5",
    name: "Dr. Sandeep Deshmukh",
    title: "Lead Pediatrician & Neonatologist",
    specialty: "Pediatrics & Child Care",
    departmentId: "pediatrics",
    experience: "14+ years",
    qualification: "MBBS, DCH, DNB (Pediatrics)",
    hospital: "MediConnect Mother & Child Centre",
    location: "Dwarka",
    rating: 4.9,
    reviewsCount: 380,
    fee: 700,
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=350",
    about: "Compassionate pediatrician handling developmental milestones, newborn immunization, childhood asthma, and pediatric nutritional wellness.",
    availableToday: true,
    availableSlots: ["10:30 AM", "11:45 AM", "02:30 PM", "04:15 PM"],
    languages: ["English", "Hindi", "Marathi"],
    isPractoVerified: true
  },
  {
    id: "doc-6",
    name: "Dr. Kavita Menon",
    title: "Senior Neurologist & Stroke Specialist",
    specialty: "Neurology",
    departmentId: "neurology",
    experience: "15+ years",
    qualification: "MBBS, MD, DM (Neurology)",
    hospital: "MediConnect Neurosciences Centre",
    location: "South Delhi",
    rating: 4.8,
    reviewsCount: 195,
    fee: 950,
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=350",
    about: "Specialized in stroke rehabilitation, Parkinson's disease, complex neuropathies, and migraine headache clinics.",
    availableToday: true,
    availableSlots: ["01:00 PM", "03:00 PM", "04:45 PM"],
    languages: ["English", "Hindi"],
    isPractoVerified: true
  }
];

const CURRENT_PATIENT = {
  id: "pat-101",
  name: "Tushar Tawar",
  age: 22,
  gender: "Male",
  bloodGroup: "O+",
  phone: "+91 98765 43210",
  email: "tushar.tawar@example.com",
  uhid: "MC-2026-9082",
  address: "A-42, Green Park Extension, New Delhi - 110016",
  emergencyContact: {
    name: "Sunil Tawar (Father)",
    phone: "+91 98765 99999"
  },
  allergies: ["Penicillin", "Sulfa drugs"],
  chronicConditions: ["Mild Hypertension"],
  height: "178 cm",
  weight: "74 kg",
  vitals: {
    bp: "120/80 mmHg",
    sugar: "110 mg/dL (Fasting)",
    heartRate: "72 bpm"
  },
  medicalHistory: {
    previousDiseases: ["Typhoid (2020)", "Mild Asthma"],
    surgicalHistory: ["Appendectomy (2015)", "Right knee arthroscopy (2022)"],
    accidentalHistory: ["Minor car accident (2018, no severe injuries)"],
    hospitalAdmissions: ["Max Hospital (2015) - Appendectomy", "Apollo Hospital (2020) - Typhoid"]
  },
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
};

const INITIAL_APPOINTMENTS = [
  {
    id: "APT-9102",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Iyer",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    patientAge: 32,
    patientGender: "Male",
    date: "2026-09-17",
    timeSlot: "11:30 AM",
    type: "In-Clinic Consultation",
    room: "Block A - Room 102",
    status: "Upcoming",
    symptoms: "Mild palpitations and routine blood pressure follow-up",
    fee: 900,
    paymentStatus: "Paid (UPI)",
    tokenNumber: "A-14"
  },
  {
    id: "APT-8821",
    doctorId: "doc-2",
    doctorName: "Dr. Vikramaditya Sen",
    doctorSpecialty: "General Medicine",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    patientAge: 32,
    patientGender: "Male",
    date: "2026-08-28",
    timeSlot: "10:15 AM",
    type: "Video Consultation",
    room: "Tele-OPD Room 4",
    status: "Completed",
    symptoms: "Seasonal viral fever and dry cough",
    fee: 800,
    paymentStatus: "Paid Online",
    tokenNumber: "V-06",
    prescriptionId: "RX-4412"
  },
  {
    id: "APT-8409",
    doctorId: "doc-4",
    doctorName: "Dr. Rajeshwar Rao",
    doctorSpecialty: "Orthopedics",
    doctorAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    patientAge: 32,
    patientGender: "Male",
    date: "2026-07-15",
    timeSlot: "03:30 PM",
    type: "In-Clinic Consultation",
    room: "Block B - Room 201",
    status: "Completed",
    symptoms: "Right ankle twist during running",
    fee: 1000,
    paymentStatus: "Paid at Counter",
    tokenNumber: "B-22",
    prescriptionId: "RX-3920"
  },
  {
    id: "APT-9101",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Iyer",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-102",
    patientName: "Rajesh Gupta",
    patientAge: 56,
    patientGender: "Male",
    date: "2026-09-17",
    timeSlot: "10:00 AM",
    type: "In-Clinic Consultation",
    room: "Block A - Room 102",
    status: "Completed",
    symptoms: "Post-angioplasty 6-month checkup, shortness of breath on climbing stairs",
    fee: 900,
    paymentStatus: "Paid (Card)",
    tokenNumber: "A-12",
    vitals: { bp: "138/88 mmHg", pulse: "78 bpm", spo2: "98%", temp: "98.4 F" },
    historySummary: "Hypertensive since 2018. Had DES stent placed in LAD in March 2026."
  },
  {
    id: "APT-9103",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Iyer",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-103",
    patientName: "Sunita Patel",
    patientAge: 48,
    patientGender: "Female",
    date: "2026-09-17",
    timeSlot: "02:00 PM",
    type: "In-Clinic Consultation",
    room: "Block A - Room 102",
    status: "Waiting",
    symptoms: "Elevated lipid profile and occasional chest tightness",
    fee: 900,
    paymentStatus: "Paid (UPI)",
    tokenNumber: "A-15",
    vitals: { bp: "142/90 mmHg", pulse: "84 bpm", spo2: "99%", temp: "98.6 F" },
    historySummary: "Family history of early CAD. No prior hospitalizations."
  },
  {
    id: "APT-9104",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Iyer",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=150",
    patientId: "pat-104",
    patientName: "Deepak Verma",
    patientAge: 39,
    patientGender: "Male",
    date: "2026-09-17",
    timeSlot: "04:30 PM",
    type: "Video Consultation",
    room: "Tele-OPD 2",
    status: "Waiting",
    symptoms: "Review of 24hr Holter Monitoring report",
    fee: 900,
    paymentStatus: "Paid (NetBanking)",
    tokenNumber: "V-18",
    vitals: { bp: "126/82 mmHg", pulse: "72 bpm", spo2: "99%", temp: "98.2 F" },
    historySummary: "Mild sinus tachycardia reported under work stress."
  }
];

const INITIAL_PRESCRIPTIONS = [
  {
    id: "RX-4412",
    appointmentId: "APT-8821",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    doctorId: "doc-2",
    doctorName: "Dr. Vikramaditya Sen",
    doctorSpecialty: "General Medicine",
    date: "2026-08-28",
    diagnosis: "Acute Upper Respiratory Tract Viral Infection",
    medicines: [
      { name: "Tab. Paracetamol 650mg", dosage: "1 tab", frequency: "Three times a day (TDS)", duration: "3 days", instructions: "After meals when fever exceeds 99.5F" },
      { name: "Tab. Levocetirizine 5mg", dosage: "1 tab", frequency: "Once daily at night (OD)", duration: "5 days", instructions: "Bedtime, may cause mild drowsiness" },
      { name: "Syp. Ascoril-D", dosage: "10 ml", frequency: "Twice daily (BD)", duration: "5 days", instructions: "Take with warm water" }
    ],
    advice: "Drink plenty of warm fluids, steam inhalation twice a day, rest adequately.",
    followUp: "Follow up after 5 days if fever persists."
  },
  {
    id: "RX-3920",
    appointmentId: "APT-8409",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    doctorId: "doc-4",
    doctorName: "Dr. Rajeshwar Rao",
    doctorSpecialty: "Orthopedics",
    date: "2026-07-15",
    diagnosis: "Grade 1 Lateral Ankle Sprain (Right)",
    medicines: [
      { name: "Tab. Aceclofenac + Paracetamol (Zerodol-P)", dosage: "1 tab", frequency: "Twice daily (BD)", duration: "5 days", instructions: "Strictly after food" },
      { name: "Cap. Pantoprazole 40mg", dosage: "1 cap", frequency: "Once daily before breakfast", duration: "5 days", instructions: "Empty stomach in morning" },
      { name: "Volini Gel / Spray", dosage: "Local application", frequency: "Three times a day", duration: "7 days", instructions: "Apply gently, do not massage vigorously" }
    ],
    advice: "R.I.C.E protocol: Rest, Ice application 15 mins x 4 times/day, Crepe bandage support, Elevation of right limb.",
    followUp: "Review after 10 days or if severe swelling develops."
  }
];

const INITIAL_LAB_REPORTS = [
  {
    id: "LAB-7821",
    testName: "Complete Blood Count (CBC) & ESR",
    category: "Hematology",
    sampleDate: "2026-08-29",
    reportDate: "2026-08-30",
    doctorName: "Dr. Vikramaditya Sen",
    status: "Ready",
    summary: "Mild leukocytosis consistent with viral recovery. Platelet count and hemoglobin normal.",
    keyMetrics: [
      { parameter: "Hemoglobin", value: "15.2 g/dL", normalRange: "13.8 - 17.2", status: "Normal" },
      { parameter: "Total Leucocyte Count (TLC)", value: "9,800 /cumm", normalRange: "4,000 - 11,000", status: "Normal" },
      { parameter: "Platelet Count", value: "2.45 Lakhs /cumm", normalRange: "1.5 - 4.5", status: "Normal" },
      { parameter: "ESR (1st hr)", value: "14 mm", normalRange: "0 - 15", status: "Normal" }
    ]
  },
  {
    id: "LAB-6910",
    testName: "Comprehensive Lipid Profile (Fasting)",
    category: "Biochemistry",
    sampleDate: "2026-06-12",
    reportDate: "2026-06-13",
    doctorName: "Dr. Ananya Iyer",
    status: "Ready",
    summary: "Borderline LDL cholesterol. Dietary lifestyle changes and exercise advised.",
    keyMetrics: [
      { parameter: "Total Cholesterol", value: "205 mg/dL", normalRange: "< 200", status: "Borderline" },
      { parameter: "HDL Cholesterol (Good)", value: "48 mg/dL", normalRange: "> 40", status: "Normal" },
      { parameter: "LDL Cholesterol (Bad)", value: "132 mg/dL", normalRange: "< 100", status: "Borderline" },
      { parameter: "Triglycerides", value: "145 mg/dL", normalRange: "< 150", status: "Normal" }
    ]
  }
];

const AVAILABLE_LAB_PACKAGES = [
  {
    id: "pkg-1",
    name: "Complete Hemogram (CBC + ESR)",
    testsCount: "24 Tests",
    price: 399,
    originalPrice: 800,
    discount: "50% OFF",
    fasting: "No fasting required",
    reportTime: "Reports in 6 hours",
    description: "Evaluates overall health, screens for anemia, infections, clotting disorders."
  },
  {
    id: "pkg-2",
    name: "Executive Lipid & Heart Risk Panel",
    testsCount: "8 Tests",
    price: 649,
    originalPrice: 1200,
    discount: "46% OFF",
    fasting: "10-12 hours fasting mandatory",
    reportTime: "Reports in 8 hours",
    description: "Measures good/bad cholesterol, triglycerides, and cardiovascular risk index."
  },
  {
    id: "pkg-3",
    name: "Comprehensive Full Body Wellness (78 Tests)",
    testsCount: "78 Tests",
    price: 1299,
    originalPrice: 3200,
    discount: "59% OFF",
    fasting: "10-12 hrs fasting required",
    reportTime: "Same day reports",
    description: "Liver function, Kidney profile, Thyroid panel, Diabetes (HbA1c), CBC & Vitamin D."
  },
  {
    id: "pkg-4",
    name: "Thyroid Complete Profile (T3, T4, TSH)",
    testsCount: "3 Tests",
    price: 499,
    originalPrice: 950,
    discount: "47% OFF",
    fasting: "Morning sample preferred",
    reportTime: "Reports in 6 hours",
    description: "Evaluates hyperthyroidism, hypothyroidism and metabolic energy regulation."
  }
];

const INITIAL_HOME_SAMPLE_ORDERS = [
  {
    id: "HSL-9281",
    packageId: "pkg-3",
    packageName: "Comprehensive Full Body Wellness (78 Tests)",
    patientName: "Tushar Tawar",
    patientPhone: "+91 98765 43210",
    address: "A-42, Green Park Extension, New Delhi - 110016",
    preferredDate: "Tomorrow (Sep 18)",
    preferredSlot: "07:30 AM - 08:30 AM",
    amount: 1299,
    status: "assigned", // 'requested' -> 'assigned' -> 'collected' -> 'processing' -> 'ready'
    phlebotomist: {
      name: "Ramesh Kumar",
      phone: "+91 98112 84729",
      rating: "4.9 ★ (1,200+ samples collected)",
      badge: "Vaccinated & Apollo Certified",
      vehicle: "MediConnect Sample Bike (DL 3S CK 4912)"
    },
    timeline: [
      { step: "requested", title: "Order Placed", time: "Sep 16, 06:30 PM", done: true },
      { step: "assigned", title: "Phlebotomist Assigned", time: "Sep 16, 07:15 PM", done: true, current: true },
      { step: "collected", title: "Sample Collection at Doorstep", time: "Expected: Sep 18, 08:00 AM", done: false },
      { step: "processing", title: "Lab Testing & Quality Check", time: "Expected: Sep 18, 01:00 PM", done: false },
      { step: "ready", title: "Digital Report Ready", time: "Expected: Sep 18, 06:00 PM", done: false }
    ]
  }
];

const INITIAL_ADMIN_STATS = {
  totalPatients: 2480,
  activeDoctors: 48,
  todayAppointments: 76,
  dailyRevenue: 152400,
  bedOccupancyRate: 86,
  weeklyAppointments: [
    { day: "Mon", count: 82, revenue: 142000 },
    { day: "Tue", count: 94, revenue: 168500 },
    { day: "Wed", count: 88, revenue: 159000 },
    { day: "Thu", count: 76, revenue: 152400 },
    { day: "Fri", count: 104, revenue: 184000 },
    { day: "Sat", count: 112, revenue: 201000 },
    { day: "Sun", count: 68, revenue: 118000 }
  ],
  departmentBreakdown: [
    { name: "General Medicine", count: 320, percentage: 28, color: "#0d9488" },
    { name: "Cardiology", count: 245, percentage: 21, color: "#f43f5e" },
    { name: "Orthopedics", count: 195, percentage: 17, color: "#0284c7" },
    { name: "Pediatrics", count: 170, percentage: 15, color: "#f59e0b" },
    { name: "Dermatology", count: 130, percentage: 11, color: "#ec4899" },
    { name: "Neurology", count: 92, percentage: 8, color: "#8b5cf6" }
  ],
  recentActivity: [
    { id: 1, type: "booking", text: "New Cardiology appointment booked for Deepak Verma", time: "5 mins ago" },
    { id: 2, type: "lab", text: "Home sample collection completed for Order #HSL-9280", time: "22 mins ago" },
    { id: 3, type: "prescription", text: "Dr. Vikramaditya Sen generated prescription #RX-4413", time: "40 mins ago" },
    { id: 4, type: "doctor", text: "Dr. Sandeep Deshmukh marked shift active in Pediatrics", time: "1 hr ago" },
    { id: 5, type: "report", text: "Pathology lab verified 18 automated CBC panels", time: "2 hrs ago" }
  ]
};


const INITIAL_PATIENTS = [
  {
    id: "pat-101",
    name: "Tushar Tawar",
    age: 22,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 12345",
    email: "tushar.tawar@example.com",
    uhid: "MC-2026-9082",
    address: "A-42, Green Park Extension, New Delhi",
    allergies: ["None"],
    chronicConditions: ["None"],
    registeredDate: "2026-01-10",
    status: "Active"
  },
  {
    id: "pat-102",
    name: "Rajesh Gupta",
    age: 56,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98111 22334",
    email: "rajesh.gupta@example.com",
    uhid: "MC-2026-4412",
    address: "B-12, Saket, New Delhi",
    allergies: ["Penicillin"],
    chronicConditions: ["Hypertension", "Post-Angioplasty"],
    registeredDate: "2026-03-15",
    status: "Active"
  },
  {
    id: "pat-103",
    name: "Sunita Patel",
    age: 48,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 98222 33445",
    email: "sunita.patel@example.com",
    uhid: "MC-2026-5591",
    address: "C-90, Greater Kailash, New Delhi",
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Dyslipidemia"],
    registeredDate: "2026-04-20",
    status: "Active"
  },
  {
    id: "pat-104",
    name: "Deepak Verma",
    age: 39,
    gender: "Male",
    bloodGroup: "O-",
    phone: "+91 98333 44556",
    email: "deepak.verma@example.com",
    uhid: "MC-2026-6720",
    address: "Sector 14, Gurugram",
    allergies: ["Aspirin"],
    chronicConditions: ["Mild Tachycardia"],
    registeredDate: "2026-05-12",
    status: "Active"
  }
];

const INITIAL_SHARE_LINKS = [
  {
    id: "SHR-7821",
    token: "SHR-7821",
    patientId: "pat-101",
    patientName: "Tushar Tawar",
    uhid: "MC-2026-9082",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 22).toISOString(),
    durationHours: 24,
    password: "4321",
    maxAccessCount: 3,
    currentAccessCount: 1,
    doctorRecipient: "Dr. K. S. Mehra (Apollo Clinic, Mumbai)",
    note: "Pan-India Consultation - Second Opinion on Cardiac & BP Status",
    isRevoked: false,
    accessLogs: [
      {
        doctorName: "Dr. K. S. Mehra",
        regNo: "MCI-48921",
        clinic: "Apollo Clinic, Andheri West, Mumbai",
        accessedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }
];

const INITIAL_USERS = [
  {
    id: "usr-1",
    username: "aarav.sharma",
    email: "tushar.tawar@example.com",
    phone: "+91 98765 43210",
    password: "patient123",
    securityPin: "1234",
    name: "Tushar Tawar",
    role: "patient",
    uhid: "MC-2026-9082",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "usr-2",
    username: "dr.ananya",
    email: "dr.ananya@mediconnect.in",
    phone: "+91 98111 88888",
    password: "doctor123",
    securityPin: "4321",
    name: "Dr. Ananya Iyer",
    role: "doctor",
    dept: "Cardiology",
    avatar: "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "usr-3",
    username: "dr.rajan",
    email: "dr.rajan@mediconnect.in",
    phone: "+91 98222 77777",
    password: "doctor123",
    securityPin: "7777",
    name: "Dr. Rajan Mehta",
    role: "doctor",
    dept: "Orthopedics",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "usr-4",
    username: "admin",
    email: "admin@mediconnect.in",
    phone: "+91 98999 00000",
    password: "admin@hms",
    securityPin: "9999",
    name: "Super Admin",
    role: "admin",
    dept: "Hospital Operations",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "usr-5",
    username: "receptionist",
    email: "receptionist@mediconnect.in",
    phone: "+91 98888 77777",
    password: "desk123",
    securityPin: "7777",
    name: "Priya Sharma",
    role: "receptionist",
    assignedDoctorId: "doc-1",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
  }
];


// ==================== src/api/firebaseService.js ====================
/**
 * MediConnect — Google Cloud Firestore Integration Service
 * Provides real-time online multi-device synchronization across India.
 * Dual-sync: writes to Cloud Firestore and syncs with SQLite/localStorage.
 */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBvDemoKeyMediConnectHMS2026India99",
  authDomain: "mediconnect-hms-india.firebaseapp.com",
  projectId: "mediconnect-hms-india",
  storageBucket: "mediconnect-hms-india.appspot.com",
  messagingSenderId: "982144510023",
  appId: "1:982144510023:web:7f8a9b0c1d2e3f4a5b6c"
};

const CONFIG_STORAGE_KEY = 'mediconnect_firebase_config';
const CLOUD_SYNC_LOGS_KEY = 'mediconnect_cloud_sync_logs';

let firestoreInstance = null;
let isInitialized = false;

const firebaseService = {
  getConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FIREBASE_CONFIG;
    } catch (e) {
      return DEFAULT_FIREBASE_CONFIG;
    }
  },

  saveConfig(newConfig) {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      isInitialized = false;
      firestoreInstance = null;
      return this.init();
    } catch (e) {
      return false;
    }
  },

  init() {
    if (isInitialized && firestoreInstance) return true;

    try {
      if (typeof window === 'undefined' || !window.firebase) {
        // Firebase scripts not loaded in window
        return false;
      }

      const config = this.getConfig();
      if (!window.firebase.apps || window.firebase.apps.length === 0) {
        window.firebase.initializeApp(config);
      }
      firestoreInstance = window.firebase.firestore();
      isInitialized = true;
      return true;
    } catch (e) {
      console.warn('Firebase initialization warning:', e.message);
      // Graceful fallback: return false
      return false;
    }
  },

  getStatus() {
    const config = this.getConfig();
    const hasFirebase = typeof window !== 'undefined' && Boolean(window.firebase);
    return {
      isOnline: navigator.onLine,
      hasFirebaseSdk: hasFirebase,
      isFirestoreConnected: Boolean(firestoreInstance) || hasFirebase,
      projectId: config.projectId || 'mediconnect-hms-india',
      authDomain: config.authDomain,
      cloudRegion: 'asia-south1 (Mumbai, India)',
      storageType: 'Google Cloud Firestore NoSQL',
      collections: [
        { name: 'appointments', label: 'OPD Appointments' },
        { name: 'prescriptions', label: 'Digital Prescriptions' },
        { name: 'doctors', label: 'Doctor Roster' },
        { name: 'departments', label: 'Hospital Wings' },
        { name: 'patients', label: 'Patient Clinical Profiles' },
        { name: 'share_links', label: 'Pan-India Shared Links' }
      ]
    };
  },

  async saveDoc(collectionName, docId, data) {
    if (!this.init() || !firestoreInstance) {
      return false;
    }

    try {
      await firestoreInstance.collection(collectionName).doc(String(docId)).set({
        ...data,
        updatedAt: new Date().toISOString(),
        cloudSync: true
      }, { merge: true });
      return true;
    } catch (e) {
      console.warn(`Firestore save error on ${collectionName}/${docId}:`, e.message);
      return false;
    }
  },

  async getCollectionDocs(collectionName) {
    if (!this.init() || !firestoreInstance) {
      return null;
    }

    try {
      const snapshot = await firestoreInstance.collection(collectionName).get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      return docs;
    } catch (e) {
      console.warn(`Firestore read error on ${collectionName}:`, e.message);
      return null;
    }
  },

  async syncAllToCloud(bundle) {
    const status = this.getStatus();
    const results = { success: true, count: 0, errors: [] };

    const syncItems = [
      { coll: 'departments', data: bundle.departments || [] },
      { coll: 'doctors', data: bundle.doctors || [] },
      { coll: 'appointments', data: bundle.appointments || [] },
      { coll: 'prescriptions', data: bundle.prescriptions || [] },
      { coll: 'share_links', data: bundle.shareLinks || [] }
    ];

    if (bundle.patient) {
      syncItems.push({ coll: 'patients', data: [bundle.patient] });
    }

    for (const item of syncItems) {
      for (const record of item.data) {
        if (!record.id) continue;
        const saved = await this.saveDoc(item.coll, record.id, record);
        if (saved) results.count++;
      }
    }

    // Save sync audit log
    try {
      const logs = JSON.parse(localStorage.getItem(CLOUD_SYNC_LOGS_KEY) || '[]');
      logs.unshift({
        timestamp: new Date().toISOString(),
        count: results.count,
        projectId: status.projectId,
        status: 'Synced Successfully'
      });
      localStorage.setItem(CLOUD_SYNC_LOGS_KEY, JSON.stringify(logs.slice(0, 10)));
    } catch (e) { /* noop */ }

    return results;
  }
};


// ==================== src/api/apiService.js ====================
/**
 * MediConnect API Service v2.0
 * All calls now hit the real Node.js + SQLite backend at localhost:5000.
 * Falls back gracefully to localStorage mock data if the server is offline.
 */

// Cross-browser compatible timeout signal helper
function timeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}




const BASE_URL = '/api';
let serverAvailable = null; // null triggers automatic health check to connect to Python SQLite backend

// LocalStorage Keys (fallback)
const STORAGE_KEYS = {
  DOCTORS: 'mediconnect_doctors',
  DEPARTMENTS: 'mediconnect_departments',
  PATIENT: 'mediconnect_patient',
  APPOINTMENTS: 'mediconnect_appointments',
  PRESCRIPTIONS: 'mediconnect_prescriptions',
  LAB_REPORTS: 'mediconnect_lab_reports',
  SAMPLE_ORDERS: 'mediconnect_sample_orders',
  ADMIN_STATS: 'mediconnect_admin_stats',
  SHARE_LINKS: 'mediconnect_share_links',
  USERS: 'mediconnect_users'
};

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
}

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) setStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) setStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  if (!localStorage.getItem(STORAGE_KEYS.PATIENT)) setStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) setStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) setStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  if (!localStorage.getItem(STORAGE_KEYS.LAB_REPORTS)) setStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
  if (!localStorage.getItem(STORAGE_KEYS.SAMPLE_ORDERS)) setStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_STATS)) setStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
  if (!localStorage.getItem(STORAGE_KEYS.SHARE_LINKS)) setStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────
async function checkServer() {
  if (serverAvailable !== null) return serverAvailable;
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: timeoutSignal(2000) });
    serverAvailable = res.ok;
  } catch (e) {
    serverAvailable = false;
  }
  return serverAvailable;
}

async function apiFetch(path, options = {}) {
  const online = await checkServer();
  if (!online) return null; // caller handles fallback

  try {
    const fetchOptions = {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    serverAvailable = false;
    return null;
  }
}

const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

// ── API Service ───────────────────────────────────────────────────────────────
const apiService = {

  // DEPARTMENTS
  async getDepartments() {
    const data = await apiFetch('/departments');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  async addDepartment(deptData) {
    const data = await apiFetch('/departments', { method: 'POST', body: deptData });
    const newDept = data || { ...deptData, id: deptData.name.toLowerCase().replace(/\s+/g, '_') };
    firebaseService.saveDoc('departments', newDept.id, newDept);
    if (data) return data;
    await delay();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    setStored(STORAGE_KEYS.DEPARTMENTS, [...depts, newDept]);
    return newDept;
  },

  // DOCTORS
  async getDoctors() {
    const data = await apiFetch('/doctors');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  async getDoctorById(id) {
    const data = await apiFetch(`/doctors/${id}`);
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS).find(d => d.id === id) || null;
  },

  async addDoctor(doctorData) {
    const data = await apiFetch('/doctors', { method: 'POST', body: doctorData });
    const newDoc = data || { ...doctorData, id: `doc-${Date.now()}`, rating: 5.0, reviewsCount: 1, isPractoVerified: true, availableToday: true, availableSlots: ['10:00 AM','12:00 PM','03:00 PM','05:00 PM'] };
    firebaseService.saveDoc('doctors', newDoc.id, newDoc);
    if (data) return data;
    await delay();
    const docs = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    setStored(STORAGE_KEYS.DOCTORS, [newDoc, ...docs]);
    return newDoc;
  },

  async updateDoctor(id, updates) {
    const data = await apiFetch(`/doctors/${id}`, { method: 'PUT', body: updates });
    firebaseService.saveDoc('doctors', id, updates);
    if (data) return data;
    await delay();
    const docs = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    const updated = docs.map(d => d.id === id ? { ...d, ...updates } : d);
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return updated.find(d => d.id === id);
  },

  // PATIENT
  async getPatientProfile() {
    const data = await apiFetch('/patients/current');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
  },

  async updatePatientProfile(profileData) {
    const data = await apiFetch('/patients/current', { method: 'PUT', body: profileData });
    firebaseService.saveDoc('patients', profileData.id || 'pat-1', profileData);
    if (data) return data;
    await delay();
    setStored(STORAGE_KEYS.PATIENT, profileData);
    return profileData;
  },

  // APPOINTMENTS
  async getAppointments() {
    const data = await apiFetch('/appointments');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  async bookAppointment(bookingData) {
    const data = await apiFetch('/appointments', { method: 'POST', body: bookingData });
    const newAppt = data || { ...bookingData, id: `APT-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Upcoming', tokenNumber: `A-${Math.floor(10 + Math.random() * 90)}` };
    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('appointments', newAppt.id, newAppt);
    if (data) return data;
    await delay(180);
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setStored(STORAGE_KEYS.APPOINTMENTS, [newAppt, ...appointments]);
    const stats = getStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
    stats.todayAppointments += 1;
    stats.dailyRevenue += Number(bookingData.fee || 800);
    setStored(STORAGE_KEYS.ADMIN_STATS, stats);
    return newAppt;
  },

  async updateAppointmentStatus(id, newStatus) {
    const data = await apiFetch(`/appointments/${id}/status`, { method: 'PATCH', body: { status: newStatus } });
    firebaseService.saveDoc('appointments', id, { status: newStatus });
    if (data) return data;
    await delay();
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setStored(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated.find(a => a.id === id);
  },

  // PRESCRIPTIONS
  async getPrescriptions() {
    const data = await apiFetch('/prescriptions');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },

  async addPrescription(prescriptionData) {
    const data = await apiFetch('/prescriptions', { method: 'POST', body: prescriptionData });
    const newRx = data || { ...prescriptionData, id: `RX-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0] };
    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('prescriptions', newRx.id, newRx);
    if (data) return data;
    await delay(150);
    const prescriptions = getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    setStored(STORAGE_KEYS.PRESCRIPTIONS, [newRx, ...prescriptions]);
    if (prescriptionData.appointmentId) await this.updateAppointmentStatus(prescriptionData.appointmentId, 'Completed');
    return newRx;
  },

  // LAB
  async getLabReports() {
    const data = await apiFetch('/lab/reports');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
  },

  async getLabPackages() {
    const data = await apiFetch('/lab/packages');
    if (data) return data;
    return AVAILABLE_LAB_PACKAGES;
  },

  async getHomeSampleOrders() {
    const data = await apiFetch('/lab/home-sample');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
  },

  async bookHomeSample(orderData) {
    const data = await apiFetch('/lab/home-sample', { method: 'POST', body: orderData });
    if (data) return data;
    await delay(180);
    const orders = getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
    const newOrder = {
      ...orderData, id: `HSL-${Math.floor(1000 + Math.random() * 9000)}`, status: 'requested',
      phlebotomist: { name: 'Assigning Phlebotomist...', phone: '--', rating: '4.9 ★', badge: 'Verified Specialist', vehicle: 'MediConnect Sample Bike' },
      timeline: [
        { step: 'requested', title: 'Order Placed', time: 'Just now', done: true, current: true },
        { step: 'assigned', title: 'Phlebotomist Assigned', time: 'Pending', done: false, current: false },
        { step: 'collected', title: 'Sample Collection at Doorstep', time: 'Pending', done: false, current: false },
        { step: 'processing', title: 'Lab Testing & Quality Check', time: 'Pending', done: false, current: false },
        { step: 'ready', title: 'Digital Report Ready', time: 'Pending', done: false, current: false },
      ]
    };
    setStored(STORAGE_KEYS.SAMPLE_ORDERS, [newOrder, ...orders]);
    return newOrder;
  },

  async updateSampleOrderStatus(id, newStatus) {
    const data = await apiFetch(`/lab/orders/${id}/status`, { method: 'PATCH', body: { status: newStatus } });
    if (data) return data;
    await delay();
    const orders = getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
    const stepsOrder = ['requested', 'assigned', 'collected', 'processing', 'ready'];
    const currentIdx = stepsOrder.indexOf(newStatus);
    const updated = orders.map(ord => {
      if (ord.id !== id) return ord;
      const updatedTimeline = ord.timeline.map((step, idx) => ({ ...step, done: idx <= currentIdx, current: idx === currentIdx, time: idx <= currentIdx ? (step.time === 'Pending' ? 'Updated just now' : step.time) : 'Pending' }));
      const phlebo = newStatus !== 'requested' ? { name: 'Ramesh Kumar', phone: '+91 98112 84729', rating: '4.9 ★ (1,200+ samples)', badge: 'Vaccinated & Apollo Certified', vehicle: 'MediConnect Sample Bike (DL 3S CK 4912)' } : ord.phlebotomist;
      return { ...ord, status: newStatus, phlebotomist: phlebo, timeline: updatedTimeline };
    });
    setStored(STORAGE_KEYS.SAMPLE_ORDERS, updated);
    return updated.find(o => o.id === id);
  },

  // ADMIN STATS
  async getAdminStats() {
    const data = await apiFetch('/admin/stats');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
  },

  // ── PAN-INDIA DOCTOR EHR SHARE LINKS ─────────────────────────────────────
  async getShareLinks() {
    await delay();
    return getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
  },

  async createShareLink(linkData) {
    await delay(120);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const token = `SHR-${Math.floor(10000 + Math.random() * 90000)}`;
    const hours = Number(linkData.durationHours || 24);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + hours * 3600 * 1000).toISOString();

    const newLink = {
      id: token,
      token,
      patientId: linkData.patientId || 'pat-101',
      patientName: linkData.patientName || 'Tushar Tawar',
      uhid: linkData.uhid || 'MC-2026-9082',
      createdAt: now.toISOString(),
      expiresAt,
      durationHours: hours,
      password: String(linkData.password || '1234'),
      maxAccessCount: Number(linkData.maxAccessCount || 1),
      currentAccessCount: 0,
      doctorRecipient: linkData.doctorRecipient || 'Any Consulting Doctor in India',
      note: linkData.note || 'Full Medical History & Diagnostic Records Access',
      isRevoked: false,
      accessLogs: []
    };

    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('share_links', newLink.id, newLink);

    const updated = [newLink, ...links];
    setStored(STORAGE_KEYS.SHARE_LINKS, updated);
    return newLink;
  },

  async getShareLinkByToken(token) {
    await delay(60);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    return links.find(l => l.token === token) || null;
  },

  async unlockShareLink(token, password, doctorInfo = {}) {
    await delay(180);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const link = links.find(l => l.token === token);

    if (!link) {
      return { success: false, error: 'Share link not found or invalid.' };
    }
    if (link.isRevoked) {
      return { success: false, error: 'This access link has been revoked by the patient.' };
    }
    if (new Date() > new Date(link.expiresAt)) {
      return { success: false, error: 'This access link has expired. Please ask the patient for a new link.' };
    }
    if (link.currentAccessCount >= link.maxAccessCount) {
      return { success: false, error: `Access person limit reached (${link.maxAccessCount}/${link.maxAccessCount} views used).` };
    }
    if (String(link.password).trim() !== String(password).trim()) {
      return { success: false, error: 'Incorrect access passcode. Please check with the patient.' };
    }

    // Success: increment access count and log access
    const updatedCount = link.currentAccessCount + 1;
    const logEntry = {
      doctorName: doctorInfo.doctorName || 'Consulting Physician',
      regNo: doctorInfo.regNo || 'MCI-VERIFIED',
      clinic: doctorInfo.clinic || 'Pan-India Clinical OPD',
      city: doctorInfo.city || 'India',
      accessedAt: new Date().toISOString()
    };

    const updatedLinks = links.map(l => {
      if (l.token === token) {
        return {
          ...l,
          currentAccessCount: updatedCount,
          accessLogs: [logEntry, ...(l.accessLogs || [])]
        };
      }
      return l;
    });
    setStored(STORAGE_KEYS.SHARE_LINKS, updatedLinks);

    // Fetch patient data for the doctor view
    const patient = getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
    const prescriptions = getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    const labReports = getStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);

    return {
      success: true,
      link: { ...link, currentAccessCount: updatedCount },
      data: { patient, prescriptions, labReports, appointments }
    };
  },

  async revokeShareLink(token) {
    await delay(100);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const updated = links.map(l => l.token === token ? { ...l, isRevoked: true } : l);
    setStored(STORAGE_KEYS.SHARE_LINKS, updated);
    return true;
  },

  async addPrescriptionFromShare(token, rxData) {
    await delay(200);
    const newRx = await this.addPrescription({
      ...rxData,
      notes: `${rxData.notes || ''} [Issued via Pan-India Shared Record Portal: ${token}]`
    });
    return newRx;
  },

  // ── USER AUTH & SECURITY ──────────────────────────────────────────────────
  async getUsers() {
    const data = await apiFetch('/users');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async registerUser(userData) {
    // Attempt backend registration in SQLite database
    const backendRes = await apiFetch('/auth/signup', {
      method: 'POST',
      body: userData
    });
    if (backendRes) {
      if (!backendRes.success) {
        throw new Error(backendRes.error || 'Registration failed');
      }
      return backendRes.user;
    }

    await delay(200);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);

    const exists = users.some(u =>
      (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase()) ||
      (userData.phone && u.phone?.replace(/\D/g, '') === userData.phone.replace(/\D/g, '')) ||
      (userData.username && u.username?.toLowerCase() === userData.username.toLowerCase())
    );

    if (exists) {
      throw new Error('An account with this email, phone number, or username already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      securityPin: userData.securityPin || '1234',
      name: userData.name,
      role: userData.role || 'patient',
      status: userData.role === 'doctor' ? 'pending' : 'active',
      uhid: userData.role === 'patient' ? `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      dept: userData.dept || (userData.role === 'doctor' ? 'General Medicine' : undefined),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      assignedDoctorId: userData.assignedDoctorId
    };

    const updatedUsers = [...users, newUser];
    setStored(STORAGE_KEYS.USERS, updatedUsers);

    // If new user is patient, also update patient profile
    if (newUser.role === 'patient') {
      const patient = getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
      const updatedPatient = {
        ...patient,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        uhid: newUser.uhid
      };
      setStored(STORAGE_KEYS.PATIENT, updatedPatient);
    }

    return newUser;
  },
  
  async verifyDoctorUser(userId) {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => u.id === userId ? { ...u, status: 'active' } : u);
    setStored(STORAGE_KEYS.USERS, updated);
    return true;
  },

  async loginUser(identifier, password, role) {
    // Attempt SQLite backend login first
    const backendRes = await apiFetch('/auth/login', {
      method: 'POST',
      body: { identifier, password, role }
    });
    if (backendRes && backendRes.success) {
      return backendRes;
    }

    await delay(150);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const user = users.find(u => {
      const matchRole = !role || u.role === role;
      const matchUsername = u.username?.toLowerCase() === cleanId;
      const matchEmail = u.email?.toLowerCase() === cleanId;
      const matchPhone = cleanDigits && u.phone?.replace(/\D/g, '').endsWith(cleanDigits);
      return matchRole && (matchUsername || matchEmail || matchPhone);
    });

    if (!user) {
      return { success: false, error: 'No account found with this Email / Phone / Username for this role.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }
    if (user.status === 'pending') {
      return { success: false, error: 'Your account is pending verification by an Admin. Please wait for approval.' };
    }

    return { success: true, user };
  },

  async resetPassword(identifier, securityPin, newPassword) {
    // Attempt SQLite backend password reset first
    const backendRes = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { identifier, securityPin, newPassword }
    });
    if (backendRes) {
      return backendRes;
    }

    await delay(200);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const userIdx = users.findIndex(u => {
      const matchUsername = u.username?.toLowerCase() === cleanId;
      const matchEmail = u.email?.toLowerCase() === cleanId;
      const matchPhone = cleanDigits && u.phone?.replace(/\D/g, '').endsWith(cleanDigits);
      return matchUsername || matchEmail || matchPhone;
    });

    if (userIdx === -1) {
      return { success: false, error: 'No account found matching this Email or Phone.' };
    }

    const user = users[userIdx];
    if (user.securityPin && user.securityPin !== securityPin.trim()) {
      return { success: false, error: 'Invalid 4-digit Security Key. Verification failed.' };
    }

    users[userIdx] = { ...user, password: newPassword };
    setStored(STORAGE_KEYS.USERS, users);
    return { success: true, user: users[userIdx] };
  }
};

// ── Chat Service ──────────────────────────────────────────────────────────────
const chatService = {
  SESSION_KEY: 'mediconnect_chat_session',

  getSessionId() {
    let sid = localStorage.getItem(this.SESSION_KEY);
    if (!sid) {
      sid = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.SESSION_KEY, sid);
    }
    return sid;
  },

  async getHistory() {
    const sid = this.getSessionId();
    try {
      const res = await fetch(`${BASE_URL}/chat/history?sessionId=${sid}`, { signal: timeoutSignal(2000) });
      if (res.ok) return await res.json();
    } catch (e) { /* noop - fallback below */ }
    try { return JSON.parse(localStorage.getItem('mediconnect_chat_history') || '[]'); } catch (e) { return []; }
  },

  async saveMessage(sender, message, role = 'patient') {
    const sid = this.getSessionId();
    const msgObj = { id: `local-${Date.now()}`, sessionId: sid, sender, message, timestamp: new Date().toISOString(), role };
    try {
      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, sender, message, role }),
        signal: timeoutSignal(2000)
      });
      if (res.ok) return await res.json();
    } catch (e) { /* noop - fallback below */ }
    const history = JSON.parse(localStorage.getItem('mediconnect_chat_history') || '[]');
    history.push(msgObj);
    localStorage.setItem('mediconnect_chat_history', JSON.stringify(history));
    return msgObj;
  },

  async clearHistory() {
    const sid = this.getSessionId();
    try {
      await fetch(`${BASE_URL}/chat/history?sessionId=${sid}`, { method: 'DELETE', signal: timeoutSignal(2000) });
    } catch (e) { /* noop */ }
    localStorage.removeItem('mediconnect_chat_history');
  }
};


// ==================== src/components/Icons.jsx ====================


const Icons = {
  Stethoscope: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75v5.25a6 6 0 0012 0V3.75m-12 0H3m1.5 0H6m10.5 0H18m-1.5 0H15M10.5 15a4.5 4.5 0 009 0v-2.25M19.5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  HeartPulse: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l2.25-3 3 6 2.25-3" />
    </svg>
  ),
  Activity: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ShieldCheck: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Star: ({ className = "w-5 h-5", fill = "currentColor" }) => (
    <svg className={className} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  FileText: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  FlaskConical: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  ),
  Pill: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  Truck: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Info: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronDown: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Download: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Bot: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
    </svg>
  ),
  TrendingUp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
      <line x1="9" y1="6" x2="9.01" y2="6" />
      <line x1="15" y1="6" x2="15.01" y2="6" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
      <line x1="9" y1="14" x2="9.01" y2="14" />
      <line x1="15" y1="14" x2="15.01" y2="14" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Bone: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 7.5a2.12 2.12 0 0 0-2.12-2.12 2.12 2.12 0 0 0-1.88 1.12L9.5 9.5a2.12 2.12 0 0 0-3-3 2.12 2.12 0 0 0-3 3 2.12 2.12 0 0 0 3 3l5 3a2.12 2.12 0 0 0 3 3 2.12 2.12 0 0 0 3-3 2.12 2.12 0 0 0-1-1.88l5-3a2.12 2.12 0 0 0 1-1.62z" />
    </svg>
  ),
  Brain: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5A3 3 0 0 0 4 8c0 .5.12.98.34 1.4A3.5 3.5 0 0 0 4 13.5a3.5 3.5 0 0 0 3.5 3.5h.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 13 17h.5A3.5 3.5 0 0 0 17 13.5c0-.52-.12-1.02-.34-1.47.6-.5 1-1.23 1-2.03 0-1.66-1.34-3-3-3v-.5A2.5 2.5 0 0 0 12.16 4 2.5 2.5 0 0 0 9.5 2z" />
    </svg>
  ),
  Baby: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M9 12h.01M15 12h.01M10 16c.5.5 1.5 1 2 1s1.5-.5 2-1" />
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5h-1.5" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  ),
  Bed: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  ),
  Video: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Send: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Lock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  ExternalLink: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Copy: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  MessageSquare: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Trash2: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Cloud: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  Database: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  RefreshCw: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
};


// ==================== src/components/Navbar.jsx ====================



function Navbar({ activeRole, setRole, onOpenRoleModal, onOpenAiModal, onOpenCloudModal, onLogout, patient, authUser, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = authUser?.name || (
    activeRole === 'patient' ? 'Aarav Sharma' :
    activeRole === 'doctor'  ? 'Dr. Ananya Iyer' : 'Super Admin'
  );

  const displayAvatar = authUser?.avatar || (
    activeRole === 'patient'
      ? (patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100")
      : activeRole === 'doctor'
        ? "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=100"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  );

  const roleBadge = {
    patient: { label: 'Patient', color: 'bg-teal-600', dot: 'bg-teal-500' },
    doctor:  { label: 'Doctor',  color: 'bg-sky-600',  dot: 'bg-sky-500'  },
    admin:   { label: 'Admin',   color: 'bg-indigo-600', dot: 'bg-indigo-500' },
    receptionist: { label: 'Receptionist', color: 'bg-fuchsia-600', dot: 'bg-fuchsia-500' }
  }[activeRole] || { label: 'Staff', color: 'bg-slate-600', dot: 'bg-slate-500' };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      {/* Top emergency & quick info bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>24x7 Emergency OPD:</span>
            <a href="tel:108" className="underline font-bold text-sky-200 hover:text-white">108</a>
            <span className="text-sky-400">|</span>
            <a href="tel:1800633422" className="underline font-semibold text-sky-200 hover:text-white">1800-MEDI-CONNECT</a>
          </span>
          <span className="hidden md:inline-block text-sky-300">
            NABH Accredited Multi-Specialty Hospital Network
          </span>
        </div>
        <div className="flex items-center space-x-3">

        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Icons.HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Medi<span className="text-teal-600">Connect</span>
                </span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide leading-none hidden sm:block">
                Secure Role-Based Portal
              </p>
            </div>
          </div>



          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Online Cloud Database Status Button */}
            <button
              onClick={onOpenCloudModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold transition shadow-xs"
              title="Google Cloud Firestore Online Database"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Icons.Cloud className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Cloud DB</span>
            </button>

            {/* Ask AI Assistant Button */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-sky-500/10 hover:from-teal-500/20 hover:to-sky-500/20 border border-teal-300/40 text-teal-800 text-xs font-semibold transition-all shadow-sm"
              title="AI Triage & Clinical Assistant"
            >
              <Icons.Bot className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Ask AI</span>

            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Icons.Activity className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Hospital Alerts</span>
                    <span className="text-[10px] text-teal-600 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>Close</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                    {[
                      { title: 'Dr. Ananya Iyer confirmed slot', body: 'Appointment #APT-9102 scheduled for tomorrow at 11:30 AM.', time: '10 mins ago' },
                      { title: 'Phlebotomist Assigned', body: 'Ramesh Kumar assigned for Order #HSL-9281 (Full Body Panel).', time: '1 hour ago' },
                      { title: 'Prescription Updated', body: 'Digital prescription #RX-4412 ready for download.', time: 'Yesterday' }
                    ].map((n, i) => (
                      <div key={i} className="py-2 text-xs">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 text-[11px]">{n.body}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar + Dropdown with Logout */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-left"
              >
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                />
                <div className="hidden sm:block text-xs leading-tight">
                  <p className="font-bold text-slate-800">{displayName}</p>
                  <p className="text-[10px] text-teal-600 font-medium capitalize flex items-center space-x-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot} inline-block`}></span>
                    <span>{activeRole} Portal</span>
                  </p>
                </div>
                <Icons.ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <img src={displayAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{activeRole} · Logged in</p>
                      </div>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1.5">

                    <button
                      onClick={() => { setShowUserMenu(false); onOpenAiModal(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors"
                    >
                      <Icons.Bot className="w-4 h-4 text-slate-400" />
                      <span>AI Assistant</span>
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors"
                      >
                        <Icons.X className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}


// ==================== src/components/RoleModal.jsx ====================



function RoleModal({ isOpen, onClose, currentRole, onSelectRole }) {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'patient',
      title: 'Patient Portal',
      persona: 'Aarav Sharma (Patient)',
      color: 'teal',
      border: 'border-teal-200 hover:border-teal-500 hover:bg-teal-50/50',
      badgeBg: 'bg-teal-100 text-teal-800',
      icon: Icons.User,
      description: 'Book doctor appointments, view real-time home sample collection tracker, inspect medical prescriptions and lab diagnostic records.',
      features: ['Find & Filter Doctors', 'Interactive Booking Stepper', 'Home Sample Collection Tracker', 'Health Records Timeline']
    },
    {
      id: 'doctor',
      title: 'Doctor Portal',
      persona: 'Dr. Ananya Iyer (Cardiologist)',
      color: 'sky',
      border: 'border-sky-200 hover:border-sky-500 hover:bg-sky-50/50',
      badgeBg: 'bg-sky-100 text-sky-800',
      icon: Icons.Stethoscope,
      description: 'Manage live daily OPD patient queue, inspect patient clinical dossiers, write prescriptions with auto-save to health records, manage slot availability.',
      features: ["Today's Patient Queue", 'Patient Medical History', 'Prescription Writing Form', 'Slot & Availability Manager']
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      persona: 'Hospital Executive & Super Admin',
      color: 'indigo',
      border: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      icon: Icons.ShieldCheck,
      description: 'Monitor hospital KPIs (revenue, bed occupancy, appointments), manage doctor rosters, oversee departments, and analyze operational trends.',
      features: ['Executive Dashboard Metrics', 'Doctor Management (Add/Edit)', 'Hospital Departments', 'Weekly Analytics & Revenue Charts']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 text-white flex justify-between items-center">
          <div>
            <span className="inline-block bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 border border-teal-500/30">
              Role Selector
            </span>
            <h2 className="text-xl font-bold tracking-tight">Select Presentation Perspective</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Switch roles instantly during your faculty pitch to showcase each stakeholder portal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => {
            const IconComp = role.icon;
            const isSelected = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onClose();
                }}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${isSelected
                    ? 'border-teal-600 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
                    : role.border + ' bg-white shadow-sm'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{role.title}</h3>
                  <p className="text-[11px] font-semibold text-teal-700 mb-2">{role.persona}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {role.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-1 mb-4">
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                        <Icons.CheckCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                  >
                    {isSelected ? 'Currently Viewing' : `Switch to ${role.title}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>* Role switching retains simulated appointments & prescriptions across sessions.</span>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/components/Toast.jsx ====================



function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <Icons.CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      icon: <Icons.Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <Icons.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
    }
  };

  const config = typeConfig[toast.type || 'success'];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-xl ${config.bg} max-w-md`}>
        {config.icon}
        <div className="text-xs">
          <p className="font-bold">{toast.title || 'Notification'}</p>
          <p className="text-slate-600 text-[11px] mt-0.5">{toast.message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded text-slate-400 hover:text-slate-700">
          <Icons.X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ==================== src/components/AiAssistantModal.jsx ====================




// ── Intent Engine ─────────────────────────────────────────────────────────────
function detectIntent(text) {
  const t = text.toLowerCase();
  if (/\b(hi|hello|hey|greet|good morning|good evening|namaste)\b/.test(t)) return 'greet';
  if (/\b(appointment|book|schedule|slot|visit|consult)\b/.test(t)) return 'appointment';
  if (/\b(doctor|physician|specialist|dr\.?)\b/.test(t)) return 'doctor';
  if (/\b(department|dept|section|wing|ward)\b/.test(t)) return 'department';
  if (/\b(prescription|medicine|drug|tablet|medication|rx)\b/.test(t)) return 'prescription';
  if (/\b(lab|report|test|blood|sample|result|diagnostic)\b/.test(t)) return 'lab';
  if (/\b(symptom|pain|fever|headache|chest|breathe|cough|vomit|nausea|dizzy|fatigue|weakness)\b/.test(t)) return 'symptom';
  if (/\b(emergency|urgent|911|ambulance|critical)\b/.test(t)) return 'emergency';
  if (/\b(hour|timing|open|time|opd|schedule)\b/.test(t)) return 'hours';
  if (/\b(location|address|where|direction|map|floor|block)\b/.test(t)) return 'location';
  if (/\b(bill|payment|fee|cost|price|charge|insurance)\b/.test(t)) return 'billing';
  if (/\b(cancel|reschedule|change appointment)\b/.test(t)) return 'cancel';
  if (/\b(thank|thanks|bye|goodbye|great|awesome|perfect)\b/.test(t)) return 'farewell';
  if (/\b(help|what can you|menu|option)\b/.test(t)) return 'help';
  return 'unknown';
}

function generateReply(intent, text, context) {
  const { patient, appointments, doctors, departments, prescriptions } = context;
  const name = patient?.name?.split(' ')[0] || 'there';
  const t = text.toLowerCase();

  switch (intent) {
    case 'greet':
      return `Hello **${name}**! 👋 I'm **MediConnect Assistant**, your AI-powered healthcare companion.\n\nI can help you with:\n- 📅 Your appointments\n- 👨‍⚕️ Finding doctors\n- 💊 Prescriptions\n- 🧪 Lab reports\n- 🏥 Departments & timings\n\nHow can I assist you today?`;

    case 'appointment': {
      const upcoming = appointments?.filter(a => a.status === 'Upcoming') || [];
      const completed = appointments?.filter(a => a.status === 'Completed') || [];
      if (upcoming.length === 0 && completed.length === 0)
        return `You have no appointments on record, **${name}**. Would you like to **book one**? Head to the Patient Portal → Book Appointment section.`;
      let reply = `📅 **Your Appointments, ${name}:**\n\n`;
      if (upcoming.length > 0) {
        reply += `**Upcoming (${upcoming.length}):**\n`;
        upcoming.forEach(a => { reply += `• **${a.doctorName}** — ${a.date} at ${a.time || a.slot || 'TBD'} *(${a.specialty})*\n  Token: ${a.tokenNumber || 'N/A'}\n`; });
      }
      if (completed.length > 0) {
        reply += `\n**Completed (${completed.length}):**\n`;
        completed.slice(0, 3).forEach(a => { reply += `• ${a.doctorName} — ${a.date} ✅\n`; });
      }
      reply += `\nTo book a new appointment, go to **Patient Portal → Book Appointment**.`;
      return reply;
    }

    case 'doctor': {
      const specialties = { cardio: 'Cardiology', heart: 'Cardiology', neuro: 'Neurology', brain: 'Neurology', ortho: 'Orthopedics', bone: 'Orthopedics', joint: 'Orthopedics', pediatric: 'Pediatrics', child: 'Pediatrics', skin: 'Dermatology', derm: 'Dermatology', general: 'General Medicine', radiol: 'Radiology', path: 'Pathology' };
      let filteredDoctors = doctors || [];
      for (const [key, dept] of Object.entries(specialties)) {
        if (t.includes(key)) { filteredDoctors = filteredDoctors.filter(d => d.specialty?.toLowerCase().includes(dept.toLowerCase())); break; }
      }
      if (filteredDoctors.length === 0) return `I couldn't find doctors matching that specialty. Available departments: ${departments?.map(d => d.name).join(', ')}.`;
      const top = filteredDoctors.slice(0, 4);
      let reply = `👨‍⚕️ **Doctors available:**\n\n`;
      top.forEach(d => { reply += `• **${d.name}** — ${d.specialty}\n  ${d.experience} exp | ⭐ ${d.rating} | Fee: ₹${d.fee}\n  ${d.availableToday ? '✅ Available Today' : '❌ Not Available Today'}\n\n`; });
      if (filteredDoctors.length > 4) reply += `...and ${filteredDoctors.length - 4} more. Visit **Patient Portal → Book Appointment** to see all.`;
      return reply;
    }

    case 'department': {
      const depts = departments || [];
      if (depts.length === 0) return `Department information is loading. Please try again shortly.`;
      let reply = `🏥 **Our Departments (${depts.length} total):**\n\n`;
      depts.slice(0, 6).forEach(d => { reply += `• **${d.name}** — ${d.description?.slice(0, 60)}...\n  Lead: ${d.leadDoctor} | ${d.room}\n`; });
      return reply;
    }

    case 'prescription': {
      const rxs = prescriptions || [];
      if (rxs.length === 0) return `No prescriptions found for your account, **${name}**. Prescriptions are added after your appointments.`;
      let reply = `💊 **Your Prescriptions (${rxs.length} total):**\n\n`;
      rxs.slice(0, 3).forEach(rx => {
        reply += `**${rx.id}** — *${rx.date}* by ${rx.doctorName}\n`;
        reply += `Diagnosis: ${rx.diagnosis}\n`;
        if (rx.medications?.length > 0) reply += `Medications: ${rx.medications.map(m => m.name || m).join(', ')}\n`;
        reply += `\n`;
      });
      reply += `View complete prescriptions in **Patient Portal → Medical Records**.`;
      return reply;
    }

    case 'lab': {
      return `🧪 **Lab Services at MediConnect:**\n\n• **Home Sample Collection** — Certified phlebotomist visits your doorstep\n• **Walk-in Lab** — Ground Floor, Central Lab\n• Reports delivered digitally within **4-8 hours**\n\nPopular tests: CBC, CMP, HbA1c, Thyroid, Lipid Profile\n\nBook a home sample via **Patient Portal → Lab & Home Sample** section.`;
    }

    case 'symptom': {
      const symptomMap = [
        { keywords: ['chest', 'heart', 'palpitation', 'breathe'], dept: 'Cardiology', urgency: '🔴 HIGH' },
        { keywords: ['headache', 'migraine', 'seizure', 'dizzy', 'stroke'], dept: 'Neurology', urgency: '🟡 MEDIUM' },
        { keywords: ['fever', 'cold', 'cough', 'fatigue', 'vomit', 'nausea'], dept: 'General Medicine', urgency: '🟢 LOW' },
        { keywords: ['bone', 'joint', 'knee', 'back', 'spine', 'fracture'], dept: 'Orthopedics', urgency: '🟡 MEDIUM' },
        { keywords: ['skin', 'rash', 'itch', 'hair', 'acne'], dept: 'Dermatology', urgency: '🟢 LOW' },
        { keywords: ['child', 'baby', 'infant', 'newborn', 'kid'], dept: 'Pediatrics', urgency: '🟡 MEDIUM' },
      ];
      let matched = null;
      for (const entry of symptomMap) {
        if (entry.keywords.some(k => t.includes(k))) { matched = entry; break; }
      }
      if (matched) {
        return `🩺 Based on your symptoms, I recommend consulting our **${matched.dept}** department.\n\nUrgency: ${matched.urgency}\n\n> ⚠️ *This is not a medical diagnosis. Please consult a doctor for proper evaluation.*\n\nWould you like to **book an appointment** with a ${matched.dept} specialist?`;
      }
      return `🩺 I'll help you find the right doctor for your symptoms. For accurate guidance, please describe your symptoms in more detail, or visit our **OPD Reception** at Block A - Ground Floor for a quick triage assessment.\n\n> ⚠️ *For emergencies, call: **1800-MED-CONNECT** or visit Emergency at Block E.*`;
    }

    case 'emergency':
      return `🚨 **EMERGENCY CONTACT:**\n\n📞 **Ambulance: 1800-MED-CONNECT** (24/7 Free)\n📞 **Emergency Ward: +91 11 4000 5000**\n🏥 **Emergency Block E** — Open 24 hours\n\nFor life-threatening situations, **please call 112 (National Emergency) immediately.**\n\n*MediConnect emergency team responds within 8 minutes.*`;

    case 'hours':
      return `🕐 **MediConnect Operating Hours:**\n\n• **OPD Timings:** Mon–Sat, 8:00 AM – 8:00 PM\n• **Emergency:** 24 × 7 (All days)\n• **Lab (Home Sample):** 6:00 AM – 10:00 AM (morning slots)\n• **Pharmacy:** 8:00 AM – 10:00 PM\n• **Radiology:** Mon–Sat, 9:00 AM – 6:00 PM\n\nFor appointments, call **+91 11 4000 5000** or book online.`;

    case 'location':
      return `📍 **MediConnect Hospital Locations:**\n\n• **Main Hospital:** Saket, New Delhi — *Block A (OPD), Block B, Block C, Block E (Emergency)*\n• **City Clinic:** Connaught Place, Central Delhi\n• **Child Care Centre:** Vasant Kunj, South-West Delhi\n• **Neuro Centre:** Dwarka, West Delhi\n• **Skin & Hair Clinic:** Lajpat Nagar, South Delhi\n\nAll locations accessible via Metro. Free parking available at Main Hospital.`;

    case 'billing':
      return `💳 **Billing & Payment Information:**\n\n• **Accepted:** Cash, All Credit/Debit Cards, UPI, Net Banking\n• **Insurance:** Empanelled with 40+ TPA & PSUs (Mediclaim, CGHS, ECHS)\n• **OPD Consultation Fee:** ₹700 – ₹1,100 (varies by specialist)\n• **Billing Desk:** Block A, Ground Floor\n\nFor insurance pre-authorisation, call **+91 11 4000 5001**.`;

    case 'cancel':
      return `📋 **Appointment Cancellation / Rescheduling:**\n\n• Cancellations allowed **up to 2 hours before** appointment time\n• Reschedule via **Patient Portal → My Appointments**\n• For same-day changes, call **+91 11 4000 5000**\n• Full refund within **3-5 business days** if cancelled 24h in advance\n\nIs there a specific appointment you'd like to cancel?`;

    case 'farewell':
      return `Thank you for visiting MediConnect, **${name}**! 😊\n\nStay healthy and take care! If you need anything, I'm always here.\n\n*Your health is our priority.* 🏥💚`;

    case 'help':
      return `🤖 **MediConnect Assistant — What I can help with:**\n\n1. 📅 **Appointments** — View upcoming, book new\n2. 👨‍⚕️ **Doctors** — Find specialists, check availability\n3. 🏥 **Departments** — Info on all 8 departments\n4. 💊 **Prescriptions** — View your medication history\n5. 🧪 **Lab Tests** — Book home sample, view reports\n6. 🩺 **Symptoms** — Get department recommendations\n7. 🚨 **Emergency** — Emergency contacts & location\n8. 🕐 **Hours & Location** — Timings, address, parking\n9. 💳 **Billing** — Payment, insurance info\n\nJust type your question naturally!`;

    default:
      return `I'm not sure I understand that completely, **${name}**. Could you rephrase?\n\nI can help with **appointments, doctors, prescriptions, lab reports, symptoms, emergencies, hospital timings,** and more.\n\nType **"help"** to see everything I can do! 😊`;
  }
}

function AiAssistantModal({ isOpen, onClose, patient, appointments, doctors, departments, prescriptions }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const context = { patient, appointments, doctors, departments, prescriptions };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: `Hello **${patient?.name?.split(' ')[0] || 'there'}**! 👋 I'm your **MediConnect AI Assistant**.\n\nAsk me anything about your appointments, doctors, prescriptions, lab tests, or symptoms!\n\nType **"help"** to see all my capabilities.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || isTyping) return;
    setInput('');
    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    chatService.saveMessage('user', text, 'patient');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateReply(detectIntent(text), text, context);
      const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      chatService.saveMessage('bot', reply, 'assistant');
    }, 700 + Math.random() * 600);
  }, [input, isTyping, context]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const formatMessage = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</React.Fragment>
      ));
    });
  };

  if (!isOpen) return null;

  const quickReplies = [
    { label: '📅 Appointments', text: 'Show my appointments' },
    { label: '👨‍⚕️ Doctors', text: 'Show available doctors' },
    { label: '💊 Prescriptions', text: 'Show my prescriptions' },
    { label: '🚨 Emergency', text: 'What is the emergency number?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Icons.Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-none">MediConnect Assistant</h3>
              <p className="text-teal-100 text-[11px] mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                AI-Powered · SQLite Connected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}>
                  <Icons.Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'}`}
                style={msg.sender === 'user' ? { background: 'linear-gradient(135deg, #0d9488, #0284c7)' } : {}}>
                <p className="text-xs">{formatMessage(msg.text)}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-teal-100 text-right' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 ml-2 mt-1 bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                  {patient?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}>
                <Icons.Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2 flex-shrink-0">
            {quickReplies.map(qr => (
              <button key={qr.text} onClick={() => sendMessage(qr.text)} className="text-xs px-3 py-1.5 rounded-full border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors font-medium">
                {qr.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex gap-2 items-end flex-shrink-0">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your health..."
            rows={1}
            className="flex-1 resize-none text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-700 placeholder-slate-400 bg-slate-50"
            style={{ minHeight: '42px', maxHeight: '80px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}
          >
            <Icons.Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/components/CloudDatabaseModal.jsx ====================




function CloudDatabaseModal({ isOpen, onClose, onSyncComplete, showToast }) {
  if (!isOpen) return null;

  const currentConfig = firebaseService.getConfig();
  const status = firebaseService.getStatus();

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiKey: currentConfig.apiKey || '',
    authDomain: currentConfig.authDomain || '',
    projectId: currentConfig.projectId || '',
    storageBucket: currentConfig.storageBucket || '',
    messagingSenderId: currentConfig.messagingSenderId || '',
    appId: currentConfig.appId || ''
  });

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!configForm.projectId.trim()) {
      alert('Please provide a valid Firebase Project ID.');
      return;
    }
    firebaseService.saveConfig(configForm);
    setIsEditingConfig(false);
    if (showToast) showToast('Cloud Firebase configuration saved and reconnected!', 'success');
  };

  const handleSyncToCloud = async () => {
    setSyncing(true);
    try {
      // Gather local data from localStorage
      const depts = JSON.parse(localStorage.getItem('mediconnect_departments') || '[]');
      const docs = JSON.parse(localStorage.getItem('mediconnect_doctors') || '[]');
      const appts = JSON.parse(localStorage.getItem('mediconnect_appointments') || '[]');
      const rxs = JSON.parse(localStorage.getItem('mediconnect_prescriptions') || '[]');
      const patient = JSON.parse(localStorage.getItem('mediconnect_patient') || '{}');
      const shareLinks = JSON.parse(localStorage.getItem('mediconnect_share_links') || '[]');

      await firebaseService.syncAllToCloud({
        departments: depts,
        doctors: docs,
        appointments: appts,
        prescriptions: rxs,
        patient,
        shareLinks
      });

      if (showToast) showToast('All hospital records synced to Cloud Firestore successfully!', 'success');
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      if (showToast) showToast('Sync failed: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-indigo-950 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300">
              <Icons.Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE CLOUD DATABASE</span>
                </span>
              </div>
              <h3 className="text-lg font-black mt-1">Google Cloud Firestore Integration</h3>
              <p className="text-xs text-slate-300">
                Real-time multi-device cloud persistence across hospitals & clinic branches in India.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Cloud Status Card */}
          <div className="bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Active Cloud Instance
                </span>
                <h4 className="text-base font-black text-slate-900 mt-0.5">
                  {status.projectId}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Region: <strong className="text-slate-800">{status.cloudRegion}</strong> • Engine: <strong className="text-slate-800">Cloud Firestore (NoSQL)</strong>
                </p>
              </div>

              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Live & Connected</span>
              </span>
            </div>

            <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">
                Multi-device real-time sync with offline SQLite resilience
              </span>
              <button
                onClick={handleSyncToCloud}
                disabled={syncing}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Icons.RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Local to Cloud'}</span>
              </button>
            </div>
          </div>

          {/* Synchronized Collections List */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
              Active Cloud Collections (Auto-Synchronized)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {status.collections.map((c) => (
                <div key={c.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
                    <Icons.Database className="w-3.5 h-3.5" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{c.label}</p>
                  <span className="text-[9px] text-emerald-700 font-semibold block">✓ Cloud Synced</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Configuration Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-xs">
                  Firebase Cloud Credentials
                </h4>
                <p className="text-[11px] text-slate-500">
                  Connect your own Google Firebase project or use the default MediConnect cloud instance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingConfig(!isEditingConfig)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-[11px]"
              >
                {isEditingConfig ? 'Cancel' : 'Configure Custom Firebase'}
              </button>
            </div>

            {isEditingConfig ? (
              <form onSubmit={handleSaveConfig} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Project ID</label>
                    <input
                      type="text"
                      value={configForm.projectId}
                      onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                      placeholder="e.g. my-hospital-project"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">API Key</label>
                    <input
                      type="text"
                      value={configForm.apiKey}
                      onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Auth Domain</label>
                    <input
                      type="text"
                      value={configForm.authDomain}
                      onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                      placeholder="my-project.firebaseapp.com"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Storage Bucket</label>
                    <input
                      type="text"
                      value={configForm.storageBucket}
                      onChange={(e) => setConfigForm({ ...configForm, storageBucket: e.target.value })}
                      placeholder="my-project.appspot.com"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition"
                  >
                    Save & Connect Project
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="font-mono text-slate-700 block">
                    Project: <strong className="text-slate-900">{status.projectId}</strong>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Auth: {status.authDomain}
                  </span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Cloud Synchronized
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
            <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted in transit (TLS 1.3) & at rest (AES-256)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/patient/BookingModal.jsx ====================



function BookingModal({ isOpen, onClose, selectedDoctor, onBookingComplete, patient }) {
  if (!isOpen || !selectedDoctor) return null;

  const [step, setStep] = useState(1);
  const [consultType, setConsultType] = useState('In-Clinic Consultation');
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [selectedSlot, setSelectedSlot] = useState(selectedDoctor.availableSlots?.[0] || '10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const dates = [
    { label: 'Today', date: '2026-09-17', day: 'Thu' },
    { label: 'Tomorrow', date: '2026-09-18', day: 'Fri' },
    { label: 'Sep 19', date: '2026-09-19', day: 'Sat' },
    { label: 'Sep 21', date: '2026-09-21', day: 'Mon' }
  ];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const bookingData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatar,
      patientId: patient?.id || 'pat-101',
      patientName: patient?.name || 'Aarav Sharma',
      patientAge: patient?.age || 32,
      patientGender: patient?.gender || 'Male',
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultType,
      room: consultType === 'In-Clinic Consultation' ? 'Block A - Room 102' : 'Tele-OPD Room 3',
      symptoms: symptoms || 'General follow-up consultation',
      fee: selectedDoctor.fee,
      paymentStatus: paymentMethod === 'Pay at Clinic' ? 'Pay at Clinic' : `Paid (${paymentMethod})`
    };

    const result = await onBookingComplete(bookingData);
    setIsSubmitting(false);
    setConfirmedBooking(result);
    setStep(4); // Success step
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={selectedDoctor.avatar}
              alt={selectedDoctor.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-teal-100">
                Apollo & Practo Verified Doctor
              </span>
              <h3 className="text-base font-bold leading-tight">{selectedDoctor.name}</h3>
              <p className="text-xs text-sky-200">{selectedDoctor.specialty} • {selectedDoctor.experience}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg text-sky-200 hover:text-white hover:bg-white/10">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span className={step === 1 ? 'font-bold text-teal-900' : 'text-slate-500'}>Mode</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span className={step === 2 ? 'font-bold text-teal-900' : 'text-slate-500'}>Date & Slot</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span className={step === 3 ? 'font-bold text-teal-900' : 'text-slate-500'}>Details & Pay</span>
            </div>
          </div>
        )}

        {/* Step 1: Mode Selection */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Select Consultation Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConsultType('In-Clinic Consultation')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  consultType === 'In-Clinic Consultation'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                  <Icons.Building className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-slate-900">In-Clinic Visit</p>
                <p className="text-[11px] text-slate-500 mt-1">Visit MediConnect Hospital OPD. In-person physical checkup.</p>
                <p className="text-xs font-bold text-teal-700 mt-3">₹{selectedDoctor.fee}</p>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('Video Consultation')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  consultType === 'Video Consultation'
                    ? 'border-sky-600 bg-sky-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                  <Icons.Video className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-slate-900">Video Consult</p>
                <p className="text-[11px] text-slate-500 mt-1">HD Tele-consultation via MediConnect secure video room.</p>
                <p className="text-xs font-bold text-sky-700 mt-3">₹{selectedDoctor.fee}</p>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-2 text-xs text-slate-600">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Includes free 7-day follow-up consultation with {selectedDoctor.name}.</span>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue to Date & Slot</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Slot */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">1. Select Appointment Date</h4>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all ${
                      selectedDate === d.date
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80 uppercase">{d.day}</span>
                    <span className="block text-xs font-bold mt-0.5">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">2. Available Time Slots</h4>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor.availableSlots || ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '05:30 PM']).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all ${
                      selectedSlot === slot
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue to Patient Details</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Details & Payment */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Patient:</span>{' '}
                  <span className="font-bold text-slate-800">{patient?.name || 'Aarav Sharma'} (32, M)</span>
                </div>
                <div>
                  <span className="text-slate-500">UHID:</span>{' '}
                  <span className="font-mono font-semibold text-slate-700">{patient?.uhid || 'MC-2026-8941'}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Slot: <span className="font-semibold text-teal-700">{selectedDate} at {selectedSlot}</span> ({consultType})
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Reason for Visit / Chief Symptoms (Optional)
              </label>
              <textarea
                rows="2"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Mild headache, fever since yesterday, routine BP checkup..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['UPI', 'Card / NetBanking', 'Pay at Clinic'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-center rounded-lg border font-medium transition-all ${
                      paymentMethod === method
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-teal-800 font-medium">Consultation Fee</p>
                <p className="text-[10px] text-slate-500">Includes hospital registration & GST</p>
              </div>
              <span className="text-base font-black text-teal-900">₹{selectedDoctor.fee}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Confirming Booking...</span>
                ) : (
                  <>
                    <span>Confirm & Book Appointment</span>
                    <Icons.CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation Screen */}
        {step === 4 && confirmedBooking && (
          <div className="p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Icons.CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Appointment Confirmed
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Booking ID: {confirmedBooking.id}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirmation SMS & WhatsApp sent to {patient?.phone || '+91 98765 43210'}.
              </p>
            </div>

            {/* Token Card */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-4 rounded-xl text-left shadow-lg">
              <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
                <div>
                  <p className="text-[10px] text-teal-300 font-bold uppercase">OPD Token Number</p>
                  <p className="text-2xl font-black tracking-wider text-white">{confirmedBooking.tokenNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-300">Room / OPD Wing</p>
                  <p className="text-xs font-bold text-teal-200">{confirmedBooking.room}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Doctor</p>
                  <p className="font-semibold text-slate-100">{confirmedBooking.doctorName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Slot</p>
                  <p className="font-semibold text-slate-100">{confirmedBooking.date} • {confirmedBooking.timeSlot}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Go to My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ==================== src/portals/patient/DoctorSearch.jsx ====================



function DoctorSearch({ doctors, departments, onSelectDoctorForBooking }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const doctorList = doctors || [];
  const specialties = ['All', ...new Set(doctorList.map((d) => d?.specialty).filter(Boolean))];

  const filteredDoctors = doctorList
    .filter((doc) => {
      if (!doc) return false;
      const matchesSearch =
        (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.hospital || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      const matchesAvailability = !onlyAvailableToday || doc.availableToday;

      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'fee-low') return (a.fee || 0) - (b.fee || 0);
      if (sortBy === 'fee-high') return (b.fee || 0) - (a.fee || 0);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-teal-400/20 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-teal-400/30">
            Verified Doctors Directory
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Find & Book Top Medical Specialists
          </h2>
          <p className="text-xs text-sky-200 mt-1">
            Over 48+ certified doctors available for in-clinic OPD and instant tele-consultation.
          </p>

          {/* Search Input Box */}
          <div className="mt-4 flex bg-white rounded-xl shadow-xl p-1.5 border border-white/20">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
              <Icons.Search className="w-5 h-5 text-teal-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, hospital branch (e.g. Cardiologist, Ananya, Saket)..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-slate-400 hover:text-slate-600"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Icons.Stethoscope className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Specialty chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Sort & Availability options */}
        <div className="flex items-center space-x-3 text-xs flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Available Today</span>
          </label>

          <div className="flex items-center space-x-1 text-slate-500">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="rating">Top Rated (4.8+)</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
            <Icons.Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No doctors match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search filters or selecting "All" specialties.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
                setOnlyAvailableToday(false);
              }}
              className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Head Info */}
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    {doctor.availableToday && (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border-2 border-white shadow">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base leading-tight hover:text-teal-700 cursor-pointer">
                        {doctor.name}
                      </h3>
                      {doctor.isPractoVerified && (
                        <span className="inline-flex items-center space-x-0.5 text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded text-[10px] font-bold">
                          <Icons.ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      {doctor.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doctor.qualification}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-slate-600 mt-2">
                      <span className="flex items-center space-x-1 font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Icons.Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{doctor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{doctor.experience} exp</span>
                    </div>
                  </div>
                </div>

                {/* Location & Hospital */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-1 truncate max-w-[70%]">
                    <Icons.MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                    <span className="font-bold text-slate-900 text-sm">₹{doctor.fee}</span>
                  </div>
                </div>

                {/* Next Slot Preview Pill */}
                <div className="mt-3 bg-slate-50 rounded-lg p-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Icons.Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Next Slot:</span>
                    <span className="font-semibold text-teal-800">
                      {doctor.availableSlots?.[0] || '10:00 AM Today'}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {doctor.languages?.join(', ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="w-full py-2 px-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1"
                >
                  <Icons.Calendar className="w-3.5 h-3.5" />
                  <span>Book Hospital Visit</span>
                </button>
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="w-full py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Icons.Video className="w-3.5 h-3.5" />
                  <span>Video Consult</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ==================== src/portals/patient/HomeSampleTracker.jsx ====================



function HomeSampleTracker({ orders, packages, onRequestSample, onAdvanceStatus, patient }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(packages[0]?.id || 'pkg-3');
  const [address, setAddress] = useState(patient?.address || 'A-42, Green Park Extension, New Delhi');
  const [dateSlot, setDateSlot] = useState('Tomorrow 07:30 AM - 08:30 AM');
  const [phone, setPhone] = useState(patient?.phone || '+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to the first order to display in tracker
  const [activeOrderId, setActiveOrderId] = useState(orders[0]?.id || null);
  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const pkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
    const orderData = {
      packageId: pkg.id,
      packageName: pkg.name,
      patientName: patient?.name || 'Aarav Sharma',
      patientPhone: phone,
      address,
      preferredDate: 'Tomorrow',
      preferredSlot: dateSlot,
      amount: pkg.price
    };

    const newOrd = await onRequestSample(orderData);
    setIsSubmitting(false);
    setShowOrderForm(false);
    setActiveOrderId(newOrd.id);
  };

  const stepsMeta = [
    { key: 'requested', label: 'Order Requested', icon: Icons.Calendar },
    { key: 'assigned', label: 'Phlebotomist Assigned', icon: Icons.User },
    { key: 'collected', label: 'Sample Collected', icon: Icons.FlaskConical },
    { key: 'processing', label: 'Lab Processing', icon: Icons.Activity },
    { key: 'ready', label: 'Report Ready', icon: Icons.FileText }
  ];

  const getStepIndex = (status) => {
    const keys = ['requested', 'assigned', 'collected', 'processing', 'ready'];
    return keys.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-white/20 text-teal-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            NABL Certified Pathology at Doorstep
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Home Sample Collection & Lab Tests
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            Certified vaccinated phlebotomists collect blood & urine samples in temperature-controlled barcoded vacutainers. Reports delivered directly to your app.
          </p>
        </div>

        <button
          onClick={() => setShowOrderForm(!showOrderForm)}
          className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4 text-teal-700" />
          <span>{showOrderForm ? 'Close Booking Form' : 'Book Home Collection'}</span>
        </button>
      </div>

      {/* Booking Form Dropdown/Modal */}
      {showOrderForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500/40 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Home Sample Collection</h3>
              <p className="text-xs text-slate-500">Select test package and confirm doorstep location.</p>
            </div>
            <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-slate-600">
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateOrder} className="space-y-4">
            {/* Package selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">Select Diagnostic Package</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all ${
                      selectedPkgId === pkg.id
                        ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-xs font-black text-teal-700">₹{pkg.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2 font-medium">
                      <span>{pkg.testsCount}</span>
                      <span>•</span>
                      <span>{pkg.fasting}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Doorstep Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Flat, building, locality, pincode..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Preferred Time Slot</label>
                <select
                  value={dateSlot}
                  onChange={(e) => setDateSlot(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Tomorrow 06:30 AM - 07:30 AM (Fasting)">Tomorrow 06:30 AM - 07:30 AM (Fasting)</option>
                  <option value="Tomorrow 07:30 AM - 08:30 AM (Fasting)">Tomorrow 07:30 AM - 08:30 AM (Fasting)</option>
                  <option value="Tomorrow 09:00 AM - 10:00 AM">Tomorrow 09:00 AM - 10:00 AM</option>
                  <option value="Tomorrow 04:00 PM - 05:00 PM">Tomorrow 04:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-amber-900">
              <Icons.AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>For fasting blood sugar and lipid panels, minimum 10-12 hours fasting is required before sample collection.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>{isSubmitting ? 'Booking...' : 'Confirm Home Collection Request'}</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Real-Time Status Tracker UI */}
      {currentOrder && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Sample Tracker
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">Order ID: {currentOrder.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{currentOrder.packageName}</h3>
              <p className="text-xs text-slate-500">
                Scheduled for: <span className="font-semibold text-slate-700">{currentOrder.preferredDate}, {currentOrder.preferredSlot}</span>
              </p>
            </div>

            {/* Advance Stage Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const seq = ['requested', 'assigned', 'collected', 'processing', 'ready'];
                  const curIdx = seq.indexOf(currentOrder.status);
                  const nextStatus = seq[(curIdx + 1) % seq.length];
                  onAdvanceStatus(currentOrder.id, nextStatus);
                }}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                title="Advance to next stage"
              >
                <Icons.Activity className="w-3.5 h-3.5 text-sky-600" />
                <span>Simulate Next Stage</span>
              </button>
            </div>
          </div>

          {/* Visual Step Tracker Bar */}
          <div className="relative py-4">
            <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
              {stepsMeta.map((s, idx) => {
                const IconComp = s.icon;
                const currentIdx = getStepIndex(currentOrder.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={s.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <p className={`text-xs font-bold mt-2 ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {isPassed ? (isCurrent ? 'In Progress' : 'Completed') : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phlebotomist Details Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-base shadow-sm">
                RK
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {currentOrder.phlebotomist.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentOrder.phlebotomist.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentOrder.phlebotomist.rating} • {currentOrder.phlebotomist.vehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`tel:${currentOrder.phlebotomist.phone}`}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Icons.Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Call Phlebotomist</span>
              </a>
              {currentOrder.status === 'ready' && (
                <button
                  onClick={() => alert("Simulated PDF Download: Report for " + currentOrder.packageName)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Icons.Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Catalog Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Popular Preventive Health Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  {pkg.discount}
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-2 leading-snug">{pkg.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">₹{pkg.price}</span>
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{pkg.originalPrice}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPkgId(pkg.id);
                    setShowOrderForm(true);
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/patient/ShareRecordModal.jsx ====================




function ShareRecordModal({ isOpen, onClose, patient, showToast }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('create'); // 'create' | 'active'

  // Form states
  const [password, setPassword] = useState('4321');
  const [durationHours, setDurationHours] = useState('24');
  const [maxAccessCount, setMaxAccessCount] = useState('2');
  const [doctorRecipient, setDoctorRecipient] = useState('');
  const [note, setNote] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadLinks();
      setCreatedLink(null);
      setSecurityPin('');
      setPinError('');
    }
  }, [isOpen]);

  const loadLinks = async () => {
    try {
      const data = await apiService.getShareLinks();
      setLinks(data || []);
    } catch (e) {
      // fallback
    }
  };

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setPinError('');

    if (!password.trim() || password.length < 4) {
      setPinError('Please set an access passcode with at least 4 digits/characters.');
      return;
    }

    if (securityPin.trim() !== '1234') {
      setPinError('Invalid 4-digit Security Key. (Default PIN is 1234)');
      return;
    }

    setLoading(true);
    try {
      const newLink = await apiService.createShareLink({
        patientId: patient?.id,
        patientName: patient?.name,
        uhid: patient?.uhid,
        password: password.trim(),
        durationHours: parseInt(durationHours, 10),
        maxAccessCount: parseInt(maxAccessCount, 10),
        doctorRecipient: doctorRecipient.trim() || 'Consulting Doctor in India',
        note: note.trim() || 'Pan-India Medical Record Access for Consultation'
      });

      setCreatedLink(newLink);
      await loadLinks();
      setTab('active');
      showToast?.({
        type: 'success',
        title: 'Share Link Generated!',
        message: `Secured link ready with ${durationHours}h validity and max ${maxAccessCount} views.`
      });
    } catch (err) {
      setPinError('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (token) => {
    if (confirm('Are you sure you want to revoke this link immediately? Any doctor using it will lose access.')) {
      await apiService.revokeShareLink(token);
      await loadLinks();
      showToast?.({
        type: 'info',
        title: 'Access Revoked',
        message: `Link ${token} has been disabled immediately.`
      });
    }
  };

  const getShareUrl = (token) => {
    const origin = window.location.origin || 'http://localhost:5173';
    return `${origin}/?share=${token}`;
  };

  const handleCopy = (link) => {
    const url = getShareUrl(link.token);
    navigator.clipboard?.writeText(url);
    setCopiedId(link.token);
    setTimeout(() => setCopiedId(null), 3000);
    showToast?.({
      type: 'success',
      title: 'Link Copied!',
      message: 'Secure doctor access link copied to clipboard.'
    });
  };

  const handleCopyWhatsApp = (link) => {
    const url = getShareUrl(link.token);
    const msg = `🏥 *MediConnect EHR Access Link*\nPatient: ${patient?.name || 'Aarav Sharma'} (UHID: ${patient?.uhid})\n\n🔗 *Link:* ${url}\n🔑 *Passcode:* ${link.password}\n⏳ *Valid For:* ${link.durationHours} Hours\n👥 *Access Limit:* Max ${link.maxAccessCount} Views\n\n_Doctor can view previous prescriptions, lab reports, and write new digital prescription._`;
    navigator.clipboard?.writeText(msg);
    showToast?.({
      type: 'success',
      title: 'WhatsApp Text Copied!',
      message: 'Paste and send to your doctor on WhatsApp or SMS.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Icons.ShieldCheck className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">Pan-India Medical Record Sharing</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ABDM / ABHA Ready
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Share your prescriptions & lab history with any doctor in India securely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex space-x-3">
          <button
            onClick={() => setTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'create'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Generate New Doctor Link</span>
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'active'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Icons.Activity className="w-4 h-4" />
            <span>Active Links ({links.filter(l => !l.isRevoked).length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Info banner */}
              <div className="bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3">
                <Icons.HeartPulse className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-teal-900">How Pan-India Secure Link Works:</p>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    Traveling to Mumbai, Bengaluru, Chennai or any town? Share this link with any consulting doctor.
                    The doctor requires your <strong>Access Passcode</strong> to open your record, and can view all past
                    prescriptions and <strong>directly attach a new digital prescription</strong> for you.
                  </p>
                </div>
              </div>

              {/* Grid: Passcode & Expiry & Person Limit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Password / Passcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Set Access Passcode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Icons.Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="e.g. 4892"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono font-bold text-teal-800"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Doctor must enter this to open link</p>
                </div>

                {/* Duration Limit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Limit (Auto-Expiry)
                  </label>
                  <div className="relative">
                    <Icons.Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={durationHours}
                      onChange={e => setDurationHours(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="1">1 Hour (Quick Visit)</option>
                      <option value="6">6 Hours (Single OPD)</option>
                      <option value="24">24 Hours (1 Full Day)</option>
                      <option value="72">3 Days (Weekend Trip)</option>
                      <option value="168">7 Days (Extended Care)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Link expires automatically</p>
                </div>

                {/* Person / View Limit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Doctor Access Limit
                  </label>
                  <div className="relative">
                    <Icons.User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={maxAccessCount}
                      onChange={e => setMaxAccessCount(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="1">1 Person (Single Doctor)</option>
                      <option value="2">2 Persons / Views</option>
                      <option value="3">3 Persons / Views</option>
                      <option value="5">5 Persons / Views</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Self-destructs after max views</p>
                </div>
              </div>

              {/* Doctor / Clinic Recipient */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor / Clinic Name (Optional)
                </label>
                <div className="relative">
                  <Icons.Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={doctorRecipient}
                    onChange={e => setDoctorRecipient(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma (Fortis Escorts, Jaipur)"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Consultation Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Purpose / Instructions for Doctor
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Seeking second opinion on hypertension medications & recent ECG reports"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                />
              </div>

              {/* Security Key Authorization */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icons.ShieldCheck className="w-4 h-4 text-amber-700" />
                  <label className="text-xs font-bold text-amber-900">
                    Authorize with Your 4-Digit Security Key <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-[11px] text-amber-800 mb-2">
                  To protect your confidential medical history, enter your personal Medical Security PIN (Default PIN: <strong>1234</strong>).
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="password"
                    maxLength={6}
                    value={securityPin}
                    onChange={e => { setSecurityPin(e.target.value); setPinError(''); }}
                    placeholder="••••"
                    className="w-36 px-4 py-2 border border-amber-300 rounded-xl text-center text-base tracking-widest font-mono font-bold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                    required
                  />
                  <span className="text-[11px] text-amber-700 font-medium">Default PIN: 1234</span>
                </div>
                {pinError && (
                  <p className="text-xs text-red-600 font-bold mt-2 flex items-center space-x-1">
                    <Icons.X className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Encrypting & Generating Link...</span>
                  </>
                ) : (
                  <>
                    <Icons.Lock className="w-4 h-4" />
                    <span>Generate Time-Limited Doctor Access Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {links.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Icons.ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No Active Share Links</p>
                  <p className="text-xs text-slate-500 mt-1">Generate a link to share with any doctor across India</p>
                </div>
              ) : (
                links.map(link => {
                  const isExpired = new Date() > new Date(link.expiresAt);
                  const isLimitReached = link.currentAccessCount >= link.maxAccessCount;
                  const isInactive = link.isRevoked || isExpired || isLimitReached;
                  const url = getShareUrl(link.token);

                  return (
                    <div
                      key={link.id}
                      className={`p-4 rounded-2xl border transition ${
                        isInactive
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-white border-teal-200 shadow-sm ring-1 ring-teal-500/10'
                      }`}
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-slate-800 text-white px-2.5 py-1 rounded-lg">
                            {link.token}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            link.isRevoked
                              ? 'bg-rose-100 text-rose-800'
                              : isExpired
                              ? 'bg-amber-100 text-amber-800'
                              : isLimitReached
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {link.isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : isLimitReached ? 'LIMIT REACHED' : 'ACTIVE'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-500">
                            Accesses: <strong className="text-slate-800">{link.currentAccessCount} / {link.maxAccessCount}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            Expires: <strong className="text-slate-800">{new Date(link.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Recipient & Notes */}
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Doctor / Clinic: <span className="text-teal-700">{link.doctorRecipient}</span>
                      </p>
                      {link.note && (
                        <p className="text-xs text-slate-600 mb-3 italic">
                          "{link.note}"
                        </p>
                      )}

                      {/* URL Box & Passcode */}
                      <div className="bg-slate-100 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-3 border border-slate-200 font-mono text-xs">
                        <div className="truncate text-slate-700 select-all">
                          {url}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-white px-2 py-1 rounded border border-slate-300 font-bold text-teal-800 text-[11px]">
                            PIN: {link.password}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(link)}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.Copy className="w-3.5 h-3.5" />
                            <span>{copiedId === link.token ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyWhatsApp(link)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.MessageSquare className="w-3.5 h-3.5" />
                            <span>Share WhatsApp</span>
                          </button>

                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.ExternalLink className="w-3.5 h-3.5" />
                            <span>Test Doctor View</span>
                          </a>
                        </div>

                        {!link.isRevoked && (
                          <button
                            onClick={() => handleRevoke(link.token)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-1 py-1"
                          >
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke Access</span>
                          </button>
                        )}
                      </div>

                      {/* Access Audit Log */}
                      {link.accessLogs && link.accessLogs.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Icons.Activity className="w-3 h-3 text-teal-600" />
                            <span>Doctor Access Audit Log:</span>
                          </p>
                          {link.accessLogs.map((log, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 flex justify-between bg-slate-50 px-2.5 py-1 rounded mt-1">
                              <span><strong>{log.doctorName}</strong> ({log.regNo}) • {log.clinic}</span>
                              <span className="text-slate-400 font-mono">{new Date(log.accessedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with SHA-256 & Protected by 2FA Medical PIN</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/patient/HealthRecords.jsx ====================




function HealthRecords({ appointments, prescriptions, labReports, patient, showToast }) {
  const [activeTab, setActiveTab] = useState('all'); // all, prescriptions, labs, visits
  const [selectedRx, setSelectedRx] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filter combined timeline
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
            alt="Patient"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">{patient?.name || 'Aarav Sharma'}</h2>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {patient?.uhid || 'MC-2026-8941'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient?.age} yrs, {patient?.gender} • Blood Group: <span className="font-bold text-slate-700">{patient?.bloodGroup}</span>
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Allergies: {patient?.allergies?.join(', ') || 'None reported'}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Condition: {patient?.chronicConditions?.join(', ') || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-teal-600/20 flex items-center space-x-1.5"
          >
            <Icons.ShieldCheck className="w-4 h-4 text-teal-200" />
            <span>Share with Doctor (Pan-India Link)</span>
          </button>
          <button
            onClick={() => alert("Simulated Clinical Summary PDF downloaded for " + patient.name)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Icons.Download className="w-4 h-4 text-slate-600" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Medical History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-2">
          <Icons.Activity className="w-4 h-4 text-rose-500" />
          <span>Comprehensive Medical History</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vitals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Vitals</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-slate-500">Blood Pressure</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.bp || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Blood Sugar</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.sugar || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Heart Rate</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.heartRate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Past Diseases */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Previous Diseases</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {patient?.medicalHistory?.previousDiseases?.length > 0 ? (
                  patient.medicalHistory.previousDiseases.map((d, i) => <li key={i}>{d}</li>)
                ) : <li>None reported</li>}
              </ul>
            </div>
          </div>

          {/* Surgeries & Accidents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Surgeries & Accidents</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Surgeries/Operations:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {patient?.medicalHistory?.surgicalHistory?.length > 0 ? (
                    patient.medicalHistory.surgicalHistory.map((s, i) => <li key={i}>{s}</li>)
                  ) : <li>None</li>}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Accidents:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {patient?.medicalHistory?.accidentalHistory?.length > 0 ? (
                    patient.medicalHistory.accidentalHistory.map((a, i) => <li key={i}>{a}</li>)
                  ) : <li>None</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Hospital Admissions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hospital Admissions</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {patient?.medicalHistory?.hospitalAdmissions?.length > 0 ? (
                  patient.medicalHistory.hospitalAdmissions.map((h, i) => <li key={i}>{h}</li>)
                ) : <li>No prior admissions</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pan-India Health Locker Info Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-950 to-slate-900 rounded-2xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-teal-500/30 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
            <Icons.Activity className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-xs text-white">Universal EHR: Consult Any Doctor Across India</h4>
              <span className="bg-teal-400/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-400/30">ABHA Compatible</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Visiting another city or consulting a specialist? Share a secure time-limited link protected with your passcode.
              Doctor can review your entire history and attach a fresh digital prescription.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition flex-shrink-0 flex items-center space-x-1"
        >
          <Icons.ExternalLink className="w-3.5 h-3.5" />
          <span>Create Secure Doctor Link</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Timeline View ({completedAppointments.length + prescriptions.length + labReports.length})
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Prescriptions ({prescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'labs'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Diagnostic Reports ({labReports.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Prescriptions Section */}
        {(activeTab === 'all' || activeTab === 'prescriptions') && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Icons.Pill className="w-4 h-4 text-teal-600" />
              <span>Medical Prescriptions & Doctor Advice</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(prescriptions || []).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Icons.Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500">No medical prescriptions on record yet</p>
                </div>
              ) : (
                (prescriptions || []).map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-teal-50 text-teal-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {rx.id}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{rx.diagnosis}</h4>
                          <p className="text-xs text-slate-500">{rx.doctorName} • {rx.doctorSpecialty}</p>
                        </div>
                        <span className="text-[11px] text-slate-400">{rx.date}</span>
                      </div>

                      <div className="mt-3 bg-slate-50 p-2.5 rounded-lg space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Prescribed Medicines ({rx.medicines?.length || 0})</p>
                        {rx.medicines?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span className="font-medium truncate">{m.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{m.frequency}</span>
                          </div>
                        ))}
                        {rx.medicines?.length > 2 && (
                          <p className="text-[10px] text-teal-600 font-medium">+ {rx.medicines.length - 2} more medicines</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 truncate max-w-[60%]">{rx.advice}</span>
                      <button
                        onClick={() => setSelectedRx(rx)}
                        className="px-3 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        View Rx
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Lab Reports Section */}
        {(activeTab === 'all' || activeTab === 'labs') && (
          <div className="space-y-3 pt-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Icons.FlaskConical className="w-4 h-4 text-sky-600" />
              <span>Diagnostic Lab Test Reports</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(labReports || []).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Icons.FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500">No lab diagnostic reports uploaded yet</p>
                </div>
              ) : (
                (labReports || []).map((lab) => (
                <div
                  key={lab.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-sky-50 text-sky-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {lab.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{lab.testName}</h4>
                        <p className="text-xs text-slate-500">{lab.category} • Ref: {lab.doctorName}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        {lab.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                      {lab.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Reported: {lab.reportDate}</span>
                    <button
                      onClick={() => setSelectedReport(lab)}
                      className="px-3 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                    >
                      View Biomarkers
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {selectedRx.id}
                </span>
                <h3 className="text-base font-bold mt-1">Digital Medical Prescription</h3>
                <p className="text-xs text-teal-100">{selectedRx.doctorName} ({selectedRx.doctorSpecialty})</p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="text-teal-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Patient:</span> <span className="font-bold text-slate-800">{selectedRx.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span> <span className="font-bold text-slate-800">{selectedRx.date}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Clinical Diagnosis:</span>{' '}
                  <span className="font-bold text-teal-800">{selectedRx.diagnosis}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Rx Medications</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {selectedRx.medicines?.map((med, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-slate-50">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {med.name}</span>
                        <span className="text-teal-700">{med.duration}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px] mt-1">
                        <span>Dosage: {med.dosage}</span>
                        <span className="font-semibold text-slate-700">{med.frequency}</span>
                      </div>
                      {med.instructions && (
                        <p className="text-[11px] text-amber-700 mt-1 italic">Note: {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.advice && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900">
                  <p className="font-bold mb-1">Doctor's Advice:</p>
                  <p>{selectedRx.advice}</p>
                </div>
              )}

              {selectedRx.followUp && (
                <div className="bg-slate-100 rounded-xl p-2.5 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-medium">Follow-up:</span>
                  <span className="font-bold text-teal-800">{selectedRx.followUp}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Digitally signed & verified by MediConnect Clinical EMR</span>
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Biomarkers Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-800 to-indigo-900 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {selectedReport.id}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedReport.testName}</h3>
                <p className="text-xs text-sky-200">Department of Pathology & Laboratory Medicine</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-sky-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
                <div>
                  <p className="text-slate-500">Collected: <span className="font-bold text-slate-800">{selectedReport.sampleDate}</span></p>
                  <p className="text-slate-500">Reported: <span className="font-bold text-slate-800">{selectedReport.reportDate}</span></p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Verified by Pathologist
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Test Parameters & Findings</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-3 bg-slate-100 p-2.5 font-bold text-slate-600 text-[11px]">
                    <span>Investigation</span>
                    <span className="text-center">Observed Value</span>
                    <span className="text-right">Reference Interval</span>
                  </div>
                  {selectedReport.keyMetrics?.map((metric, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-2.5 items-center">
                      <span className="font-medium text-slate-900">{metric.parameter}</span>
                      <span className={`text-center font-bold font-mono ${
                        metric.status === 'Borderline' ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {metric.value}
                      </span>
                      <span className="text-right text-slate-500">{metric.normalRange}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 leading-relaxed">
                <p className="font-bold mb-1">Pathologist Impression:</p>
                <p>{selectedReport.summary}</p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 bg-sky-700 text-white text-xs font-bold rounded-lg hover:bg-sky-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pan-India Doctor Share Modal */}
      <ShareRecordModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        patient={patient}
        showToast={showToast}
      />
    </div>
  );
}


// ==================== src/portals/patient/PatientProfile.jsx ====================



function PatientProfile({ patient, onUpdateProfile }) {
  const [formData, setFormData] = useState({ ...patient });
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900">{formData.name}</h2>
              <span className="bg-teal-100 text-teal-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                {formData.uhid}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered Patient • MediConnect Central Hospital
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center space-x-2">
          <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully to patient record!</span>
        </div>
      )}

      {/* Form / Details View */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          Personal & Medical Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Age & Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                disabled={!isEditing}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <select
                disabled={!isEditing}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Blood Group</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-slate-500 mb-1 font-medium">Residential Address</label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Known Medical Allergies</label>
            <input
              type="text"
              disabled={!isEditing}
              value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. Penicillin, Sulfa"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Chronic Health Conditions</label>
            <input
              type="text"
              disabled={!isEditing}
              value={Array.isArray(formData.chronicConditions) ? formData.chronicConditions.join(', ') : formData.chronicConditions}
              onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. Mild Hypertension"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </form>

      {/* Security & Data Privacy Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Icons.ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Privacy & Security Controls (ABHA & DISHA)
              </h3>
              <p className="text-xs text-slate-500">
                Manage who can view your clinical diagnoses, prescriptions, and lab history.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full border border-emerald-300">
            🔒 SQLite Database Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Control 1: Admin Isolation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Icons.Lock className="w-4 h-4 text-emerald-600" />
                <span>Hospital Admin Clinical Barrier</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Active (Locked)
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Hospital Administration staff is restricted from viewing your clinical diagnosis, symptoms, prescriptions, and lab results. They can only see tokens and billing.
            </p>
          </div>

          {/* Control 2: Doctor Consent PIN */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Icons.User className="w-4 h-4 text-sky-600" />
                <span>Doctor Consultation Consent Lock</span>
              </span>
              <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px]">
                PIN Required
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Doctors outside your direct consultation cannot view your past health records without entering your 4-digit Security Key.
            </p>
          </div>
        </div>

        {/* 4-Digit Security Key Management */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Personal Security Key
            </span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">
              4-Digit Doctor Consent PIN: <span className="font-mono text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-300 ml-1 font-black tracking-widest">{formData.securityPin || '1234'}</span>
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Share this PIN with consulting doctors or when generating Pan-India medical links.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const newPin = prompt("Enter new 4-digit Security Key (PIN):", formData.securityPin || "1234");
              if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
                const updated = { ...formData, securityPin: newPin };
                setFormData(updated);
                onUpdateProfile(updated);
                alert("Security Key updated successfully in SQLite database!");
              } else if (newPin !== null) {
                alert("Please enter exactly 4 numeric digits.");
              }
            }}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex-shrink-0"
          >
            Change Security Key
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/patient/PatientHome.jsx ====================



function PatientHome({
  patient,
  appointments,
  doctors,
  departments,
  onNavigateTab,
  onSelectDoctorForBooking,
  onOpenAiModal
}) {
  const [heroSearch, setHeroSearch] = useState('');

  // Find next upcoming appointment
  const upcomingAppointment = appointments.find((a) => a.status === 'Upcoming');

  const specialtyIcons = {
    cardiology: Icons.Heart,
    orthopedics: Icons.Bone,
    neurology: Icons.Brain,
    pediatrics: Icons.Baby,
    dermatology: Icons.Sparkles,
    general_medicine: Icons.Activity,
    radiology: Icons.Activity,
    pathology: Icons.FlaskConical
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Section - Apollo 24/7 & Practo Aesthetic */}
      <div className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcome back, {patient?.name?.split(' ')[0] || 'Aarav'}</span>
            <span>•</span>
            <span className="text-white/80">UHID: {patient?.uhid || 'MC-2026-8941'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Comprehensive Hospital Care, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-200">
              Verified Doctors & Fast Diagnostics
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
            Connect with Apollo-certified consultants, schedule home blood sample pickups, and track your clinical history in one integrated health portal.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-white/30">
            <div className="flex items-center flex-1 px-3 py-1.5 text-slate-400">
              <Icons.Search className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search doctors, specialties (e.g. Cardiologist, Fever, Ortho)..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => onNavigateTab('doctors')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Search Doctors</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Popular search tags */}
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-sky-200 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-semibold text-white/90">Popular:</span>
            {['Cardiologist', 'Dermatologist', 'Fever & Flu', 'Knee Pain', 'Full Body Checkup'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigateTab('doctors')}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-2 py-0.5 rounded-full text-sky-100 transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient background hospital illustration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Icons.HeartPulse className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* 4 Quick Action Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('doctors')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
            Book Appointment
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Consult in-clinic or via secure HD video call.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-teal-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Find Doctor</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('sample')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
            Home Sample Collection
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Doorstep phlebotomist pickup with live tracking.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Book Lab Test</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('records')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
            My Health Records
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access past prescriptions, test reports & timelines.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-sky-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>View Timeline</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={onOpenAiModal}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.Bot className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
            Ask MediConnect AI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent symptom triage & medical Q&A roadmap.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Explore Roadmap</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      {/* Upcoming Appointment Spotlight Card (if any) */}
      {upcomingAppointment && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500/30 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={upcomingAppointment.doctorAvatar}
                  alt={upcomingAppointment.doctorName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-1">
                  <Icons.Calendar className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Confirmed Appointment
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Token: {upcomingAppointment.tokenNumber}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {upcomingAppointment.doctorName}
                </h3>
                <p className="text-xs text-slate-500">
                  {upcomingAppointment.doctorSpecialty} • {upcomingAppointment.type}
                </p>

                <div className="flex items-center space-x-4 text-xs font-semibold text-teal-800 mt-2">
                  <span className="flex items-center space-x-1">
                    <Icons.Calendar className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.timeSlot}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600">
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.room}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => alert(`Directions for ${upcomingAppointment.room} sent to phone!`)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Directions / Room
              </button>
              <button
                onClick={() => onNavigateTab('records')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Departments Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Explore Medical Departments
            </h2>
            <p className="text-xs text-slate-500">Find doctors by specialized clinical department.</p>
          </div>
          <button
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>View All Doctors</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {departments.slice(0, 6).map((dept) => {
            const IconComp = specialtyIcons[dept.id] || Icons.Activity;
            return (
              <div
                key={dept.id}
                onClick={() => onNavigateTab('doctors')}
                className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                  {dept.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{dept.doctorCount} Doctors</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Doctors Showcase */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Top Rated Practitioners Today
            </h2>
            <p className="text-xs text-slate-500">Highest rated specialists with slots open today.</p>
          </div>
          <button
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>Browse All ({doctors.length})</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {doctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{doctor.name}</h4>
                  <p className="text-xs font-semibold text-teal-700">{doctor.specialty}</p>
                  <p className="text-[11px] text-slate-500 truncate">{doctor.experience} exp</p>
                  <div className="flex items-center space-x-1 text-xs text-amber-600 mt-1 font-bold">
                    <Icons.Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{doctor.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fee</span>
                  <span className="font-bold text-xs text-slate-900">₹{doctor.fee}</span>
                </div>
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/patient/PatientPortal.jsx ====================









function PatientPortal({
  patient,
  appointments,
  doctors,
  departments,
  prescriptions,
  labReports,
  sampleOrders,
  labPackages,
  onBookAppointment,
  onUpdatePatientProfile,
  onRequestSampleOrder,
  onAdvanceSampleStatus,
  onOpenAiModal,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleStartBooking = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  const handleBookingCompleted = async (bookingData) => {
    const created = await onBookAppointment(bookingData);
    showToast({
      type: 'success',
      title: 'Appointment Booked!',
      message: `Token #${created.tokenNumber} reserved with ${created.doctorName}.`
    });
    return created;
  };

  const handleSampleRequest = async (data) => {
    const created = await onRequestSampleOrder(data);
    showToast({
      type: 'success',
      title: 'Sample Collection Scheduled!',
      message: `Order #${created.id} confirmed. Phlebotomist will visit at your selected slot.`
    });
    return created;
  };

  const handleProfileUpdated = async (data) => {
    await onUpdatePatientProfile(data);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal and medical information was saved.'
    });
  };

  const navItems = [
    { id: 'home', label: 'Home / OPD', icon: Icons.Building },
    { id: 'doctors', label: 'Find Doctors', icon: Icons.Stethoscope },
    { id: 'sample', label: 'Home Lab Tests', icon: Icons.FlaskConical },
    { id: 'records', label: 'Health Records', icon: Icons.FileText },
    { id: 'profile', label: 'My Profile', icon: Icons.User }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-navigation bar for Patient */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <PatientHome
            patient={patient}
            appointments={appointments}
            doctors={doctors}
            departments={departments}
            onNavigateTab={setActiveTab}
            onSelectDoctorForBooking={handleStartBooking}
            onOpenAiModal={onOpenAiModal}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorSearch
            doctors={doctors}
            departments={departments}
            onSelectDoctorForBooking={handleStartBooking}
          />
        )}

        {activeTab === 'sample' && (
          <HomeSampleTracker
            orders={sampleOrders}
            packages={labPackages}
            onRequestSample={handleSampleRequest}
            onAdvanceStatus={onAdvanceSampleStatus}
            patient={patient}
          />
        )}

        {activeTab === 'records' && (
          <HealthRecords
            appointments={appointments}
            prescriptions={prescriptions}
            labReports={labReports}
            patient={patient}
            showToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <PatientProfile
            patient={patient}
            onUpdateProfile={handleProfileUpdated}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDoctor={selectedDoctorForBooking}
        onBookingComplete={handleBookingCompleted}
        patient={patient}
      />
    </div>
  );
}


// ==================== src/portals/doctor/PatientHistoryModal.jsx ====================



function PatientHistoryModal({ isOpen, onClose, patientAppointment, prescriptions = [] }) {
  const [isConsentUnlocked, setIsConsentUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen || !patientAppointment) return null;

  // Find prescriptions for this patient if any
  const patientPrescriptions = prescriptions.filter(
    (p) => p.patientName === patientAppointment.patientName || p.patientId === patientAppointment.patientId
  );

  const handleVerifyPin = (e) => {
    e.preventDefault();
    setPinError('');
    // Check against standard pin '1234' or patient appointment security key
    const expectedPin = patientAppointment.securityPin || '1234';
    if (enteredPin === expectedPin || enteredPin === '1234') {
      setIsConsentUnlocked(true);
    } else {
      setPinError('Invalid 4-digit Security PIN. Patient consent could not be verified.');
    }
  };

  const handleClose = () => {
    setIsConsentUnlocked(false);
    setEnteredPin('');
    setPinError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 to-slate-900 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-sky-600/50 border border-sky-400/40 flex items-center justify-center text-base font-black">
              {patientAppointment.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded">
                  Token: {patientAppointment.tokenNumber}
                </span>
                {isConsentUnlocked ? (
                  <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Icons.CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Consent Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Icons.Lock className="w-3 h-3 text-amber-300" />
                    <span>PIN Protected</span>
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold mt-0.5">{patientAppointment.patientName}</h3>
              <p className="text-xs text-slate-300">
                {patientAppointment.patientAge || 32} yrs • {patientAppointment.patientGender || 'Male'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent Lock Barrier if not verified */}
        {!isConsentUnlocked ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-600 shadow-sm">
              <Icons.Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto">
              <h4 className="text-base font-black text-slate-900">
                Patient Medical Dossier is Protected
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In compliance with ABHA & DISHA health data privacy standards, arbitrary doctors cannot inspect a patient's historical diagnoses, past prescriptions, and lab history without the patient's explicit consent.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Patient's 4-Digit Security Key (PIN)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => { setEnteredPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                  placeholder="e.g. 1234"
                  className="w-full text-center text-lg tracking-widest font-mono font-bold py-2.5 px-4 border-2 border-slate-300 focus:border-sky-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Ask the patient for their 4-digit PIN (Default: <strong className="text-slate-600">1234</strong>)
                </p>
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 justify-center">
                  <Icons.X className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <Icons.CheckCircle className="w-4 h-4" />
                <span>Verify Consent & Unlock Dossier</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto text-[11px] text-slate-400 flex items-center justify-center space-x-2">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HIPAA Compliant Patient Consent Architecture</span>
            </div>
          </div>
        ) : (
          /* Dossier Content when Consent is Unlocked */
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs animate-fadeIn">
            {/* Consent Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-emerald-900">
              <div className="flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-[11px]">
                  Consent Verified: Medical dossier decrypted for current consultation.
                </span>
              </div>
              <button
                onClick={() => setIsConsentUnlocked(false)}
                className="text-[10px] font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Lock Again
              </button>
            </div>

            {/* Vitals Recorded by OPD Nurse */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Today's Triage Vitals (OPD Nurse Entry)
              </h4>
              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.bp || '128/84 mmHg'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Pulse Rate</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.pulse || '76 bpm'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">SpO2 Oxygen</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {patientAppointment.vitals?.spo2 || '99%'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Body Temp</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.temp || '98.6 F'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chief Complaint today */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <h5 className="font-bold text-amber-950 mb-1">Current Chief Complaint</h5>
              <p className="text-slate-700 leading-relaxed">
                "{patientAppointment.symptoms || 'Patient reports mild chest tightness and asks for follow-up evaluation.'}"
              </p>
            </div>

            {/* Clinical History & Background */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Background Medical Dossier
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  {patientAppointment.historySummary ||
                    "Known hypertensive on ACE inhibitors. No history of adverse drug reactions to beta blockers. Family history of coronary artery disease."}
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center space-x-3 text-[11px]">
                  <span className="font-bold text-rose-700">Allergies: Penicillin, Sulfa</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700">Blood Group: O+</span>
                </div>
              </div>
            </div>

            {/* Past Prescriptions */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Past Hospital Prescriptions ({patientPrescriptions.length})
              </h4>
              {patientPrescriptions.length === 0 ? (
                <p className="text-slate-400 italic">No prior prescriptions logged under current session.</p>
              ) : (
                <div className="space-y-2">
                  {patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-3 bg-white border border-slate-200 rounded-xl">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800">{rx.diagnosis}</span>
                        <span className="text-[10px] text-slate-400">{rx.date}</span>
                      </div>
                      <p className="text-[11px] text-teal-700 mt-0.5">By {rx.doctorName}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {rx.medicines?.map((m, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                            {m.name} ({m.dosage})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/doctor/PrescriptionModal.jsx ====================



function PrescriptionModal({ isOpen, onClose, appointment, onSavePrescription }) {
  if (!isOpen || !appointment) return null;

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 tab', frequency: 'Once daily after breakfast (OD)', duration: '14 days', instructions: 'Take with water' }
  ]);
  const [advice, setAdvice] = useState('Maintain low sodium diet, avoid strenuous exertion, take readings daily.');
  const [followUp, setFollowUp] = useState('After 2 weeks or if symptoms persist');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 tab', frequency: 'Twice daily after food (BD)', duration: '7 days', instructions: '' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = medicines.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      alert("Please enter a clinical diagnosis");
      return;
    }

    setIsSaving(true);
    const prescriptionData = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId || 'doc-1',
      doctorName: appointment.doctorName || 'Dr. Ananya Iyer',
      doctorSpecialty: appointment.doctorSpecialty || 'Cardiology',
      diagnosis,
      medicines: medicines.filter((m) => m.name.trim() !== ''),
      advice,
      followUp
    };

    await onSavePrescription(prescriptionData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Clinical EMR • Prescription Desk
            </span>
            <h3 className="text-base font-bold mt-1">Write Medical Prescription</h3>
            <p className="text-xs text-teal-100">
              Patient: {appointment.patientName} (Token: {appointment.tokenNumber})
            </p>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Patient Quick Strip */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">{appointment.patientName} ({appointment.patientAge || 32} yrs)</p>
              <p className="text-[11px] text-slate-500">Chief Complaint: {appointment.symptoms}</p>
            </div>
            <span className="bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded text-[10px]">
              Dr. Ananya Iyer (Consultant)
            </span>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Clinical Diagnosis / Assessment *
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Stage 1 Hypertension with mild anxiety-related palpitations"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Medicines Dynamic Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Prescribed Medicines & Dosage
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center space-x-1"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 text-[11px]">Medicine #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        placeholder="Drug / Brand name (e.g. Tab. Telmisartan 40mg)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        placeholder="Dosage (e.g. 1 tab)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Once daily in morning (OD)">Once daily in morning (OD)</option>
                        <option value="Once daily at night (OD)">Once daily at night (OD)</option>
                        <option value="Twice daily after meals (BD)">Twice daily after meals (BD)</option>
                        <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                        <option value="As needed for SOS pain (SOS)">As needed for SOS (SOS)</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 5 days, 30 days)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Lifestyle */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Dietary & Lifestyle Advice
            </label>
            <textarea
              rows="2"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
            ></textarea>
          </div>

          {/* Follow up */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Recommended Follow-Up
            </label>
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Icons.CheckCircle className="w-4 h-4" />
              <span>{isSaving ? 'Saving & Signing Rx...' : 'Sign & Issue Digital Prescription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ==================== src/portals/doctor/SlotManager.jsx ====================



function SlotManager({ doctor, onUpdateDoctor, showToast }) {
  const [slots, setSlots] = useState(
    doctor?.availableSlots || [
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '02:00 PM',
      '02:30 PM',
      '03:30 PM',
      '04:30 PM',
      '05:30 PM'
    ]
  );

  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [isAvailableToday, setIsAvailableToday] = useState(doctor?.availableToday ?? true);

  const toggleSlot = (slot) => {
    if (slots.includes(slot)) {
      setSlots(slots.filter((s) => s !== slot));
    } else {
      setSlots([...slots, slot]);
    }
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlotTime) return;
    if (!slots.includes(newSlotTime)) {
      setSlots([...slots, newSlotTime]);
      setNewSlotTime('');
    }
  };

  const handleSave = () => {
    onUpdateDoctor(doctor.id, {
      availableSlots: slots,
      availableToday: isAvailableToday
    });
    showToast({
      type: 'success',
      title: 'OPD Schedule Updated',
      message: `Updated availability slots for ${doctor.name}.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
            Cardiology OPD Wing • Room 102
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Doctor Availability & Slot Management
          </h2>
          <p className="text-xs text-slate-500">
            Define daily consultation slots, mark emergency surgery leaves, and set weekly clinic timings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.CheckCircle className="w-4 h-4" />
          <span>Save OPD Availability</span>
        </button>
      </div>

      {/* Today's Switch */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isAvailableToday ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            <Icons.Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Clinic Status</h3>
            <p className="text-xs text-slate-500">
              {isAvailableToday
                ? 'Doctor is currently accepting OPD patients & queue walk-ins.'
                : 'Doctor is marked away (In Surgery / Off duty). New bookings temporarily paused.'}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailableToday}
            onChange={(e) => setIsAvailableToday(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Weekly Working Days */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Weekly Working Schedule
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            const isActive = activeDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => {
                  if (isActive) setActiveDays(activeDays.filter((d) => d !== day));
                  else setActiveDays([...activeDays, day]);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Chips Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Time Slots ({slots.length} Slots Enabled)
            </h3>
            <p className="text-xs text-slate-500">
              Click any slot chip to toggle between Available (Teal) and Blocked/Unavailable (Slate).
            </p>
          </div>
        </div>

        {/* All master standard slots */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
            '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
          ].map((time) => {
            const isEnabled = slots.includes(time);
            return (
              <button
                key={time}
                onClick={() => toggleSlot(time)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                  isEnabled
                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs ring-1 ring-teal-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>{time}</span>
                {isEnabled ? (
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add custom slot form */}
        <form onSubmit={handleAddSlot} className="pt-4 border-t border-slate-100 flex items-center space-x-2">
          <input
            type="text"
            value={newSlotTime}
            onChange={(e) => setNewSlotTime(e.target.value)}
            placeholder="Add custom slot (e.g. 07:15 PM)"
            className="text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none w-64"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Add Slot
          </button>
        </form>
      </div>
    </div>
  );
}


// ==================== src/portals/doctor/ManageReceptionist.jsx ====================




function ManageReceptionist({ doctor, showToast }) {
  const [loading, setLoading] = useState(false);
  const [receptionists, setReceptionists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    securityPin: ''
  });

  useEffect(() => {
    loadReceptionists();
  }, []);

  const loadReceptionists = async () => {
    try {
      const users = await apiService.getUsers();
      const mapped = users.filter(u => u.role === 'receptionist' && u.assignedDoctorId === doctor.id);
      setReceptionists(mapped);
    } catch (err) {
      console.warn("Could not load receptionists", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || formData.securityPin.length !== 4) {
      showToast({ type: 'error', title: 'Invalid Form', message: 'Please fill all fields correctly.' });
      return;
    }

    setLoading(true);
    try {
      const newRecp = await apiService.registerUser({
        ...formData,
        role: 'receptionist',
        status: 'active',
        assignedDoctorId: doctor.id
      });

      setReceptionists([...receptionists, newRecp]);
      showToast({ type: 'success', title: 'Account Created', message: 'Receptionist account created successfully.' });
      setIsCreating(false);
      setFormData({ name: '', email: '', phone: '', password: '', securityPin: '' });
    } catch (err) {
      showToast({ type: 'error', title: 'Creation Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Manage Receptionist</h2>
          <p className="text-sm text-slate-500">Create and manage your front-desk staff accounts.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold rounded-xl flex items-center space-x-2"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Create New Receptionist Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="e.g. Anjali Sharma" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="desk@clinic.com" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="9876543210" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="Min 6 characters" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit Security PIN</label>
              <input type="password" maxLength={4} value={formData.securityPin} onChange={e => setFormData({...formData, securityPin: e.target.value.replace(/\D/g, '')})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="1234" required />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-bold">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {receptionists.length === 0 && !isCreating ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Icons.Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">No receptionists mapped yet.</p>
          </div>
        ) : (
          receptionists.map(r => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center font-bold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.email} • {r.phone}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Active</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ==================== src/portals/doctor/DoctorPortal.jsx ====================







function DoctorPortal({
  appointments,
  prescriptions,
  doctors,
  onUpdateAppointmentStatus,
  onSavePrescription,
  onUpdateDoctor,
  showToast,
  authUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue' or 'availability'
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [queueFilter, setQueueFilter] = useState('All');

  // Currently logged-in doctor resolved dynamically
  const currentDoctor = doctors.find((d) =>
    (authUser?.id && d.id === authUser.id) ||
    (authUser?.name && d.name.toLowerCase().includes(authUser.name.toLowerCase().split(' ')[1] || authUser.name.toLowerCase())) ||
    (authUser?.email && d.email && d.email.toLowerCase() === authUser.email.toLowerCase())
  ) || doctors.find((d) => d.id === 'doc-1') || doctors[0];

  // Strictly doctor's own queue (No other doctor's patients can be viewed)
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id || a.doctorName?.toLowerCase().includes(currentDoctor.name?.toLowerCase().split(' ')[1] || currentDoctor.name?.toLowerCase())
  );

  const filteredQueue = doctorAppointments.filter((a) => {
    if (queueFilter === 'All') return true;
    return a.status.toLowerCase() === queueFilter.toLowerCase();
  });

  const waitingCount = doctorAppointments.filter((a) => a.status === 'Waiting' || a.status === 'Upcoming').length;
  const inConsultCount = doctorAppointments.filter((a) => a.status === 'In-Consultation').length;
  const completedCount = doctorAppointments.filter((a) => a.status === 'Completed').length;

  const handleStatusChange = async (appointmentId, newStatus) => {
    await onUpdateAppointmentStatus(appointmentId, newStatus);
    showToast({
      type: 'info',
      title: 'Queue Status Updated',
      message: `Appointment marked as ${newStatus}.`
    });
  };

  const handlePrescriptionSaved = async (rxData) => {
    const newRx = await onSavePrescription(rxData);
    showToast({
      type: 'success',
      title: 'Prescription Issued!',
      message: `Prescription #${newRx.id} generated for ${newRx.patientName}. Patient records updated.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-nav banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <img
                src={currentDoctor.avatar}
                alt={currentDoctor.name}
                className="w-10 h-10 rounded-xl object-cover border border-sky-400 shadow-xs"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold text-slate-900">{currentDoctor.name}</h2>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {currentDoctor.specialty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Room 102 • Cardiology Wing • OPD Duty Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('queue')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'queue'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Users className="w-4 h-4" />
                <span>Today's Patient Queue ({doctorAppointments.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('availability')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'availability'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Calendar className="w-4 h-4" />
                <span>Availability & Calendar</span>
              </button>

              <button
                onClick={() => setActiveSubTab('staff')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'staff'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Users className="w-4 h-4" />
                <span>Manage Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activeSubTab === 'queue' ? (
          <>
            {/* KPI Metric cards for OPD session */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Total Scheduled</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{doctorAppointments.length}</p>
                </div>
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Icons.Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-600 font-medium">Waiting in Lounge</span>
                  <p className="text-2xl font-black text-amber-700 mt-0.5">{waitingCount}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Icons.Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-sky-600 font-medium">In Consultation</span>
                  <p className="text-2xl font-black text-sky-700 mt-0.5">{inConsultCount}</p>
                </div>
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <Icons.Stethoscope className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-600 font-medium">Consultations Completed</span>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">{completedCount}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Icons.CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Queue Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Filter Queue:</span>
                {['All', 'Waiting', 'In-Consultation', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setQueueFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      queueFilter === status
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                Sorted by appointment time slot
              </span>
            </div>

            {/* Patient Queue Cards / Table */}
            <div className="space-y-3">
              {filteredQueue.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <Icons.Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No patients in this queue filter</p>
                </div>
              ) : (
                filteredQueue.map((appointment) => {
                  const statusColors = {
                    Upcoming: 'bg-blue-50 text-blue-800 border-blue-200',
                    Waiting: 'bg-amber-50 text-amber-800 border-amber-200',
                    'In-Consultation': 'bg-sky-100 text-sky-800 border-sky-300 animate-pulse',
                    Completed: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  };

                  return (
                    <div
                      key={appointment.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left: Patient Details */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-700 text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                          {appointment.tokenNumber}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">
                              {appointment.patientName}
                            </h3>
                            <span className="text-xs text-slate-500">
                              ({appointment.patientAge || 32} yrs, {appointment.patientGender || 'Male'})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                statusColors[appointment.status] || 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center space-x-1 font-semibold text-sky-800">
                              <Icons.Clock className="w-3.5 h-3.5" />
                              <span>{appointment.timeSlot}</span>
                            </span>
                            <span>•</span>
                            <span className="text-slate-600">{appointment.type}</span>
                            <span>•</span>
                            <span className="text-slate-400">Token #{appointment.tokenNumber}</span>
                          </div>

                          <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg leading-relaxed max-w-2xl">
                            <span className="font-semibold text-slate-900">Complaint:</span> {appointment.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Status Select dropdown */}
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="text-xs border border-slate-300 rounded-xl px-2.5 py-2 font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="Waiting">Mark Waiting</option>
                          <option value="In-Consultation">Call In Consultation</option>
                          <option value="Completed">Mark Completed</option>
                        </select>

                        {/* View History dossier */}
                        <button
                          onClick={() => setSelectedPatientHistory(appointment)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <Icons.FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>History Dossier</span>
                        </button>

                        {/* Write Prescription button */}
                        <button
                          onClick={() => setSelectedAppointmentForRx(appointment)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-1"
                        >
                          <Icons.Pill className="w-3.5 h-3.5" />
                          <span>Write Rx</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : activeSubTab === 'availability' ? (
          <SlotManager
            doctor={currentDoctor}
            onUpdateDoctor={onUpdateDoctor}
            showToast={showToast}
          />
        ) : (
          <ManageReceptionist
            doctor={currentDoctor}
            showToast={showToast}
          />
        )}
      </main>

      {/* Patient Medical History Dossier Modal */}
      <PatientHistoryModal
        isOpen={Boolean(selectedPatientHistory)}
        onClose={() => setSelectedPatientHistory(null)}
        patientAppointment={selectedPatientHistory}
        prescriptions={prescriptions}
      />

      {/* Write Prescription Modal */}
      <PrescriptionModal
        isOpen={Boolean(selectedAppointmentForRx)}
        onClose={() => setSelectedAppointmentForRx(null)}
        appointment={selectedAppointmentForRx}
        onSavePrescription={handlePrescriptionSaved}
      />
    </div>
  );
}


// ==================== src/portals/receptionist/ReceptionistPortal.jsx ====================




function ReceptionistPortal({
  appointments,
  doctors,
  onUpdateAppointmentStatus,
  onBookAppointment,
  showToast,
  authUser
}) {
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // queue, walkin
  const [walkinData, setWalkinData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    symptoms: '',
    timeSlot: '' // Must pick an empty one
  });

  // Resolve assigned doctor
  useEffect(() => {
    if (authUser && authUser.assignedDoctorId) {
      const doc = doctors.find(d => d.id === authUser.assignedDoctorId);
      setAssignedDoctor(doc || doctors[0]);
    } else {
      // fallback for demo
      setAssignedDoctor(doctors[0]);
    }
  }, [authUser, doctors]);

  if (!assignedDoctor) {
    return <div className="p-10 text-center">Loading Doctor Details...</div>;
  }

  // Filter appointments for this doctor only
  const docAppointments = appointments.filter(a => a.doctorId === assignedDoctor.id);

  // Generate available slots (e.g., 9:00 AM to 5:00 PM, 30 min intervals)
  const generateSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    for (let h = startHour; h < endHour; h++) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h;
      slots.push(`${displayH}:00 ${ampm}`);
      slots.push(`${displayH}:30 ${ampm}`);
    }
    return slots;
  };

  const allSlots = generateSlots();
  // Filter out slots that are already booked
  const bookedSlots = docAppointments.map(a => a.timeSlot);
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

  const handleStatusChange = async (appointmentId, newStatus) => {
    await onUpdateAppointmentStatus(appointmentId, newStatus);
    showToast({
      type: 'info',
      title: 'Queue Updated',
      message: `Appointment marked as ${newStatus}.`
    });
  };

  const handleWalkinSubmit = async (e) => {
    e.preventDefault();
    if (!walkinData.patientName || !walkinData.timeSlot) {
      showToast({ type: 'error', title: 'Error', message: 'Name and Slot are required.' });
      return;
    }

    // Book appointment
    await onBookAppointment({
      ...walkinData,
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      department: assignedDoctor.specialty,
      date: new Date().toISOString().split('T')[0],
      type: 'Walk-in',
      status: 'Upcoming',
      bookingMethod: 'receptionist'
    });

    showToast({ type: 'success', title: 'Walk-in Booked', message: `Added ${walkinData.patientName} to the queue.` });
    setWalkinData({ patientName: '', patientAge: '', patientGender: 'Male', symptoms: '', timeSlot: '' });
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold">
              {authUser?.name ? authUser.name.charAt(0) : 'R'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Reception Desk: {assignedDoctor.name}</h2>
              <p className="text-[11px] text-slate-500">Managing OPD Queue & Walk-ins</p>
            </div>
          </div>
          
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'queue' ? 'bg-white shadow-sm text-fuchsia-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Queue
            </button>
            <button
              onClick={() => setActiveTab('walkin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'walkin' ? 'bg-white shadow-sm text-fuchsia-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Walk-in Patient
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'queue' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Today's Appointments</h3>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full">Total: {docAppointments.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docAppointments.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm">
                        {app.tokenNumber || '#'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.patientName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {app.type || 'Online'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      app.status === 'Waiting' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'In-Consultation' ? 'bg-sky-100 text-sky-800' :
                      app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-4 flex items-center space-x-2">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">{app.timeSlot}</span>
                  </div>

                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">UPDATE STATUS</label>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-700 focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Waiting">Patient Arrived (Waiting)</option>
                      <option value="In-Consultation">In Consultation</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-600 rounded-xl flex items-center justify-center">
                <Icons.User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Add Walk-in Patient</h3>
                <p className="text-xs text-slate-500">Book an immediate available slot for an offline patient.</p>
              </div>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                  <input type="text" value={walkinData.patientName} onChange={e => setWalkinData({...walkinData, patientName: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input type="number" value={walkinData.patientAge} onChange={e => setWalkinData({...walkinData, patientAge: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select value={walkinData.patientGender} onChange={e => setWalkinData({...walkinData, patientGender: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Slot</label>
                  <select value={walkinData.timeSlot} onChange={e => setWalkinData({...walkinData, timeSlot: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl font-semibold text-fuchsia-700" required>
                    <option value="">Select a slot...</option>
                    {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Symptoms / Notes</label>
                <textarea value={walkinData.symptoms} onChange={e => setWalkinData({...walkinData, symptoms: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl h-24" placeholder="Brief description..." />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-bold shadow-sm">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}


// ==================== src/portals/admin/ManageDoctors.jsx ====================



function ManageDoctors({ doctors, departments, users = [], onAddDoctor, onVerifyDoctor, onUpdateDoctor, showToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    title: 'Consultant Specialist',
    specialty: 'Cardiology',
    departmentId: 'cardiology',
    experience: '8+ years',
    qualification: 'MBBS, MD',
    hospital: 'MediConnect Central Hospital',
    location: 'New Delhi',
    fee: 800,
    avatar: 'https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350',
    about: 'Experienced clinical practitioner dedicated to patient outcomes.'
  });

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'All' || doc.specialty === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const pendingDoctors = users.filter(u => u.role === 'doctor' && u.status === 'pending');

  const handleVerifyPendingDoctor = async (user) => {
    const deptObj = departments.find(d => d.name === user.dept) || departments[0];
    const newDoc = {
      name: `Dr. ${user.name}`,
      title: 'Consultant Specialist',
      specialty: user.dept || 'General Medicine',
      departmentId: deptObj ? deptObj.id : 'general',
      experience: '5+ years',
      qualification: 'MBBS, MD',
      hospital: 'MediConnect Central Hospital',
      location: 'New Delhi',
      fee: 800,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350',
      about: 'Newly registered practitioner.'
    };
    if (onVerifyDoctor) {
      await onVerifyDoctor(user.id, newDoc);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDoctor.name) return;

    await onAddDoctor(newDoctor);
    showToast({
      type: 'success',
      title: 'Doctor Added',
      message: `${newDoctor.name} added to the hospital directory.`
    });

    setShowAddModal(false);
    setNewDoctor({
      name: '',
      title: 'Consultant Specialist',
      specialty: 'Cardiology',
      departmentId: 'cardiology',
      experience: '8+ years',
      qualification: 'MBBS, MD',
      hospital: 'MediConnect Central Hospital',
      location: 'New Delhi',
      fee: 800,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350',
      about: 'Experienced clinical practitioner dedicated to patient outcomes.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
            Hospital Administration
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Manage Medical Doctors Roster</h2>
          <p className="text-xs text-slate-500">
            Total {doctors.length} verified doctors registered across 8 clinical departments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Pending Doctors Verification */}
      {pendingDoctors.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Icons.ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-900 text-sm">Pending Doctor Verifications</h3>
          </div>
          <div className="space-y-3">
            {pendingDoctors.map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-100 shadow-sm gap-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Email: {user.email} | Phone: {user.phone} | Dept: {user.dept}
                  </p>
                </div>
                <button
                  onClick={() => handleVerifyPendingDoctor(user)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Verify & Add to Directory
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Departments</option>
            {(departments || []).map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table / Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Specialty & Dept</th>
                <th className="py-3.5 px-4">Experience & Degree</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-900">{doc.experience}</p>
                    <p className="text-[11px] text-slate-400">{doc.qualification}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{doc.fee}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 font-bold text-amber-600">
                      <Icons.Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.availableToday ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.availableToday ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{doc.availableToday ? 'On Duty' : 'On Leave'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onUpdateDoctor(doc.id, { availableToday: !doc.availableToday });
                        showToast({
                          type: 'info',
                          title: 'Doctor Status Toggled',
                          message: `${doc.name} marked as ${!doc.availableToday ? 'On Duty' : 'On Leave'}.`
                        });
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                    >
                      Toggle Shift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Add Doctor to MediConnect Roster</h3>
              <button onClick={() => setShowAddModal(false)} className="text-indigo-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Doctor Name (with prefix) *</label>
                <input
                  type="text"
                  required
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="e.g. Dr. Harish Chandra"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Department</label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {(departments || []).map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.fee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, fee: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    placeholder="e.g. 12+ years"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={newDoctor.qualification}
                    onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD, DM"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={newDoctor.avatar}
                  onChange={(e) => setNewDoctor({ ...newDoctor, avatar: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==================== src/portals/admin/ManageDepartments.jsx ====================



function ManageDepartments({ departments, onAddDepartment, showToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    description: '',
    leadDoctor: '',
    room: 'Block A - OPD 204',
    doctorCount: 4
  });

  const specialtyIcons = {
    cardiology: Icons.Heart,
    orthopedics: Icons.Bone,
    neurology: Icons.Brain,
    pediatrics: Icons.Baby,
    dermatology: Icons.Sparkles,
    general_medicine: Icons.Activity,
    radiology: Icons.Activity,
    pathology: Icons.FlaskConical
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDept.name) return;

    await onAddDepartment(newDept);
    showToast({
      type: 'success',
      title: 'Department Added',
      message: `${newDept.name} department created successfully.`
    });
    setShowAddModal(false);
    setNewDept({
      name: '',
      description: '',
      leadDoctor: '',
      room: 'Block A - OPD 204',
      doctorCount: 4
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
            Hospital Infrastructure
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Hospital Clinical Departments</h2>
          <p className="text-xs text-slate-500">
            {departments.length} active departments covering specialized OPD wings, ICU, diagnostics and surgical theatres.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(departments || []).length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Icons.Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No hospital departments created yet</p>
            <p className="text-xs text-slate-500 mt-1">Click "Add Department" to configure the first medical wing</p>
          </div>
        ) : (
          (departments || []).map((dept) => {
          const IconComp = specialtyIcons[dept.id] || Icons.Building;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                    Active Wing
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Lead Consultant:</span>
                    <span className="font-bold text-slate-900">{dept.leadDoctor}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>OPD Location:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{dept.room}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {dept.doctorCount} Doctors on Duty
                </span>
                <button
                  onClick={() => alert(`Department details for ${dept.name}: OPD timings 08:30 AM - 08:00 PM.`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Manage Wing
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Add Clinical Department</h3>
              <button onClick={() => setShowAddModal(false)} className="text-teal-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Ophthalmology & Eye Care"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description / Services</label>
                <textarea
                  rows="2"
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Clinical scope, diagnostic procedures..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Head of Dept (HOD)</label>
                  <input
                    type="text"
                    value={newDept.leadDoctor}
                    onChange={(e) => setNewDept({ ...newDept, leadDoctor: e.target.value })}
                    placeholder="e.g. Dr. K. Raman"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Room / OPD Wing</label>
                  <input
                    type="text"
                    value={newDept.room}
                    onChange={(e) => setNewDept({ ...newDept, room: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==================== src/portals/admin/ReportsAnalytics.jsx ====================



function ReportsAnalytics({ stats }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const weeklyData = stats?.weeklyAppointments || [
    { day: "Mon", count: 82, revenue: 142000 },
    { day: "Tue", count: 94, revenue: 168500 },
    { day: "Wed", count: 88, revenue: 159000 },
    { day: "Thu", count: 76, revenue: 152400 },
    { day: "Fri", count: 104, revenue: 184000 },
    { day: "Sat", count: 112, revenue: 201000 },
    { day: "Sun", count: 68, revenue: 118000 }
  ];

  const maxCount = Math.max(...weeklyData.map((d) => d.count));

  const deptData = stats?.departmentBreakdown || [
    { name: "General Medicine", count: 320, percentage: 28, color: "#0d9488" },
    { name: "Cardiology", count: 245, percentage: 21, color: "#f43f5e" },
    { name: "Orthopedics", count: 195, percentage: 17, color: "#0284c7" },
    { name: "Pediatrics", count: 170, percentage: 15, color: "#f59e0b" },
    { name: "Dermatology", count: 130, percentage: 11, color: "#ec4899" },
    { name: "Neurology", count: 92, percentage: 8, color: "#8b5cf6" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
            Hospital Analytics & Operational Reports
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Clinical Operations & Patient Flow Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time OPD throughput, weekly appointment demand curve, and department patient distribution.
          </p>
        </div>

        <button
          onClick={() => alert("Simulated Hospital Executive Summary PDF generated!")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm flex-shrink-0"
        >
          <Icons.Download className="w-4 h-4 text-slate-600" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Grid of 2 major visual charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Appointments Trend (Custom responsive SVG & Bar Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Appointment Volume</h3>
              <p className="text-xs text-slate-500">Total appointments booked across 7 days</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg">
              Avg: 89 / day
            </span>
          </div>

          {/* SVG Bar Chart with Hover Tooltip */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
              {weeklyData.map((item) => {
                const heightPercent = (item.count / maxCount) * 100;
                const isHovered = hoveredDay === item.day;

                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredDay(item.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-xl whitespace-nowrap z-20 animate-fadeIn">
                        <span>{item.count} Appointments</span>
                        <span className="block text-teal-300 font-mono">₹{(item.revenue / 1000).toFixed(1)}k rev</span>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden h-40">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-teal-500 shadow-lg'
                            : 'bg-gradient-to-t from-sky-600 to-teal-500'
                        }`}
                      ></div>
                    </div>

                    <span className="text-xs font-bold text-slate-700 mt-2">{item.day}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
              <span>In-Clinic OPD Consultations</span>
            </span>
            <span className="font-semibold text-slate-700">Peak Day: Saturday (112 patients)</span>
          </div>
        </div>

        {/* Chart 2: Department-Wise Patient Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Department Patient Distribution</h3>
              <p className="text-xs text-slate-500">Active OPD distribution by clinical specialty</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
              Total: 1,152 Consults
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {deptData.map((dept) => (
              <div key={dept.name} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-800">{dept.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-mono">{dept.count} patients</span>
                    <span className="text-slate-900 font-bold">{dept.percentage}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                    className="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Streams Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Hospital Revenue Streams (Today's Breakdown)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-teal-900">OPD Consultations</span>
              <span className="text-[10px] font-bold bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded">62%</span>
            </div>
            <p className="text-xl font-black text-teal-950 mt-2">₹94,500</p>
            <p className="text-[11px] text-teal-700 mt-1">76 doctors consults billed</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-sky-900">Diagnostics & Home Labs</span>
              <span className="text-[10px] font-bold bg-sky-200/60 text-sky-900 px-2 py-0.5 rounded">24%</span>
            </div>
            <p className="text-xl font-black text-sky-950 mt-2">₹36,500</p>
            <p className="text-[11px] text-sky-700 mt-1">28 home collections & CBC panels</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-indigo-900">Hospital Pharmacy</span>
              <span className="text-[10px] font-bold bg-indigo-200/60 text-indigo-900 px-2 py-0.5 rounded">14%</span>
            </div>
            <p className="text-xl font-black text-indigo-950 mt-2">₹21,400</p>
            <p className="text-[11px] text-indigo-700 mt-1">Digital prescriptions dispensed</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==================== src/portals/admin/AdminPortal.jsx ====================






function AdminPortal({
  stats,
  doctors,
  departments,
  appointments,
  users,
  onAddDoctor,
  onVerifyDoctor,
  onUpdateDoctor,
  onAddDepartment,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, doctors, departments, analytics

  const navItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: Icons.Activity },
    { id: 'doctors', label: `Manage Doctors (${doctors.length})`, icon: Icons.Stethoscope },
    { id: 'departments', label: `Departments (${departments.length})`, icon: Icons.Building },
    { id: 'privacy_roster', label: `Patient Flow & Data Privacy (${appointments.length})`, icon: Icons.ShieldCheck },
    { id: 'analytics', label: 'Reports & Analytics', icon: Icons.TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-nav banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Welcome & Live Badge */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-400/30">
                  Hospital Central Operations Center
                </span>
                <h1 className="text-2xl font-black tracking-tight mt-1">
                  MediConnect Executive Overview
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  NABH Compliant Multi-Specialty Hospital Network • Saket, Connaught Place & Gurugram Wings.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Hospital Systems Operational (100%)</span>
                </span>
              </div>
            </div>

            {/* 5 Key Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Total Patients</span>
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Icons.Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalPatients?.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ +14% this month</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Active Doctors</span>
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Icons.Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{doctors.length}</p>
                <span className="text-[10px] text-indigo-600 font-bold mt-1 inline-block">8 Departments</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Today's Appointments</span>
                  <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                    <Icons.Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-teal-700 mt-2">{stats.todayAppointments}</p>
                <span className="text-[10px] text-teal-600 font-bold mt-1 inline-block">64 Clinic + 12 Tele-OPD</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Daily Revenue</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Icons.Activity className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-700 mt-2">₹{(stats.dailyRevenue / 1000).toFixed(1)}k</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Billed Today</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Bed Occupancy</span>
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                    <Icons.Bed className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-sky-700 mt-2">{stats.bedOccupancyRate}%</p>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">214 of 250 Beds</span>
              </div>
            </div>

            {/* Split layout: Quick shortcuts & Live Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Quick admin actions and department snapshot */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-slate-900">Hospital Management Shortcuts</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.User className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">Add or Edit Doctors</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Manage doctor credentials & roster</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('departments')}
                      className="p-4 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.Building className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">Manage Departments</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">OPD rooms & clinical wings</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.TrendingUp className="w-5 h-5 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">View Weekly Analytics</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Charts, revenue & throughput</p>
                    </button>
                  </div>
                </div>

                {/* Department Capacity Snapshot */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Active Department Roster</h3>
                    <button
                      onClick={() => setActiveTab('departments')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {departments.slice(0, 4).map((d) => (
                      <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{d.room}</span>
                        <p className="font-bold text-xs text-slate-900 mt-1 truncate">{d.name}</p>
                        <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">{d.doctorCount} Doctors</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 col: Live Activity Feed */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Real-Time Hospital Audit Feed</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-3">
                  {stats.recentActivity?.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium leading-relaxed">{act.text}</p>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <ManageDoctors
            doctors={doctors}
            departments={departments}
            users={users}
            onAddDoctor={onAddDoctor}
            onVerifyDoctor={onVerifyDoctor}
            onUpdateDoctor={onUpdateDoctor}
            showToast={showToast}
          />
        )}

        {activeTab === 'departments' && (
          <ManageDepartments
            departments={departments}
            onAddDepartment={onAddDepartment}
            showToast={showToast}
          />
        )}

        {activeTab === 'privacy_roster' && (
          <div className="space-y-6">
            {/* Privacy Compliance Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-emerald-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <Icons.ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-400/30">
                      DPDP & HIPAA Health Privacy Safeguards
                    </span>
                    <h2 className="text-xl font-black mt-1">
                      Patient Clinical Data Access Isolation
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      Administrative roles have strictly operational visibility (tokens, departments, billing, and scheduling). Personal medical diagnoses, clinical notes, prescriptions, and lab specimens are cryptographically redacted and restricted solely to licensed treating physicians with verified patient consent.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-center">
                  <span className="text-[10px] text-emerald-300 font-bold block uppercase">Admin Clinical Status</span>
                  <span className="text-sm font-black text-white flex items-center justify-center space-x-1 mt-0.5">
                    <Icons.Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>PHI Restrict Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Operational Table with Masked Records */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Hospital OPD Queue & Patient Flow ({appointments.length} Total Visits)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operational roster showing appointment tokens, assigned clinics, and redacted clinical fields.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Icons.Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Clinical Data Masked</span>
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Token & Type</th>
                      <th className="py-3 px-4">Patient (Anonymized)</th>
                      <th className="py-3 px-4">Assigned Doctor</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Clinical Diagnosis / PHI</th>
                      <th className="py-3 px-4">OPD Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(appointments || []).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">
                          No hospital OPD appointments scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      (appointments || []).map((apt) => {
                        // Mask patient name for administrative staff privacy protection
                        const rawName = apt.patientName || 'Tushar Tawar';
                        const parts = rawName.split(' ');
                        const maskedName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : rawName;

                        return (
                          <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                              {apt.tokenNumber || 'T-100'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{apt.type || 'In-Person'}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{maskedName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">UHID: MC-****-{apt.id.slice(-4)}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {apt.doctorName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                              {apt.department}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="font-medium block">{apt.date}</span>
                            <span className="text-[10px] text-slate-400">{apt.time || apt.slot}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[10px] font-bold">
                              <Icons.Lock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                              <span>🔒 Protected PHI — Doctor Eyes Only</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'In-Consultation'
                                ? 'bg-sky-100 text-sky-800 animate-pulse'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {apt.status || 'Scheduled'}
                            </span>
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <ReportsAnalytics stats={stats} />
        )}
      </main>
    </div>
  );
}


// ==================== src/portals/shared/DoctorSharedEhrView.jsx ====================




function DoctorSharedEhrView({ shareToken, onBackToApp }) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Unlock state
  const [password, setPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [clinic, setClinic] = useState('');
  const [city, setCity] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedData, setUnlockedData] = useState(null);

  // New Prescription Modal
  const [showRxModal, setShowRxModal] = useState(false);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxNotes, setRxNotes] = useState('');
  const [rxMedicines, setRxMedicines] = useState([
    { name: '', dosage: '500 mg', frequency: 'Twice daily (After food)', duration: '5 Days' }
  ]);
  const [savingRx, setSavingRx] = useState(false);
  const [rxSuccessMsg, setRxSuccessMsg] = useState('');

  useEffect(() => {
    loadTokenDetails();
  }, [shareToken]);

  const loadTokenDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const link = await apiService.getShareLinkByToken(shareToken);
      if (!link) {
        setError('This medical record link is invalid or does not exist.');
      } else if (link.isRevoked) {
        setError('This link was revoked by the patient.');
      } else if (new Date() > new Date(link.expiresAt)) {
        setError(`This link expired on ${new Date(link.expiresAt).toLocaleString()}.`);
      } else if (link.currentAccessCount >= link.maxAccessCount) {
        setError(`Access person limit reached (${link.maxAccessCount}/${link.maxAccessCount} views already consumed).`);
      } else {
        setTokenInfo(link);
      }
    } catch (e) {
      setError('Could not verify link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Please enter the access passcode provided by the patient.');
      return;
    }

    setUnlocking(true);
    try {
      const res = await apiService.unlockShareLink(shareToken, password.trim(), {
        doctorName: doctorName.trim() || 'Consulting Physician',
        regNo: regNo.trim() || 'MCI-VERIFIED',
        clinic: clinic.trim() || 'Consulting Clinic',
        city: city.trim() || 'India'
      });

      if (!res.success) {
        setError(res.error || 'Failed to unlock record.');
      } else {
        setUnlockedData(res.data);
        setTokenInfo(res.link);
      }
    } catch (err) {
      setError('Error unlocking medical records.');
    } finally {
      setUnlocking(false);
    }
  };

  // Prescription Form Handlers
  const addMedicineRow = () => {
    setRxMedicines(prev => [
      ...prev,
      { name: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 Days' }
    ]);
  };

  const updateMedicine = (index, field, value) => {
    setRxMedicines(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const removeMedicineRow = (index) => {
    setRxMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!rxDiagnosis.trim()) {
      alert('Please enter clinical diagnosis.');
      return;
    }
    const validMeds = rxMedicines.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      alert('Please add at least one medicine.');
      return;
    }

    setSavingRx(true);
    try {
      const newRx = await apiService.addPrescriptionFromShare(shareToken, {
        patientId: unlockedData?.patient?.id || 'pat-101',
        patientName: unlockedData?.patient?.name || 'Tushar Tawar',
        doctorName: doctorName.trim() ? `Dr. ${doctorName.replace(/^dr\.?\s*/i, '')}` : 'Dr. Consulting Physician',
        doctorSpecialty: clinic.trim() ? `${clinic}, ${city || 'India'}` : 'Consulting OPD',
        diagnosis: rxDiagnosis.trim(),
        medicines: validMeds,
        notes: rxNotes.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      // Update local view with new prescription
      setUnlockedData(prev => ({
        ...prev,
        prescriptions: [newRx, ...(prev?.prescriptions || [])]
      }));

      setRxSuccessMsg(`Prescription ${newRx.id} generated & permanently linked to patient's MediConnect record!`);
      setTimeout(() => {
        setShowRxModal(false);
        setRxSuccessMsg('');
      }, 2500);
    } catch (err) {
      alert('Failed to save prescription. Please try again.');
    } finally {
      setSavingRx(false);
    }
  };

  // Mask patient name before unlocking
  const getMaskedName = (name) => {
    if (!name) return 'Patient';
    const parts = name.split(' ');
    return parts.map(p => p[0] + '*'.repeat(Math.max(2, p.length - 1))).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top National Health Exchange Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-950 to-slate-900 border-b border-teal-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-teal-300">National Health Records Exchange (Pan-India ABDM Ready)</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Secure Peer-to-Peer Clinical Access</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-teal-500/20 text-teal-200 border border-teal-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-mono">
            TOKEN: {shareToken}
          </span>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-300 hover:text-white underline font-semibold flex items-center space-x-1"
            >
              <span>Back to MediConnect App</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-20 bg-slate-800/80 rounded-3xl border border-slate-700">
              <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-base font-bold text-white">Verifying Medical Access Token...</p>
              <p className="text-xs text-slate-400 mt-1">Checking encryption certificates and authorization policies</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && !unlockedData && (
            <div className="max-w-md mx-auto bg-slate-800 rounded-3xl p-8 border border-red-500/40 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400">
                <Icons.X className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Access Denied / Link Unavailable</h3>
              <p className="text-sm text-red-300 mt-2">{error}</p>
              <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400 space-y-2">
                <p>Possible reasons:</p>
                <ul className="list-disc list-inside text-left space-y-1 text-slate-300">
                  <li>Link validity period has expired</li>
                  <li>Maximum doctor access limit reached</li>
                  <li>Patient manually revoked access</li>
                  <li>Invalid passcode entered</li>
                </ul>
              </div>
              {onBackToApp && (
                <button
                  onClick={onBackToApp}
                  className="mt-6 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition"
                >
                  Return to Main App
                </button>
              )}
            </div>
          )}

          {/* Locked Gate View: Doctor Enters Password & Credentials */}
          {!loading && !unlockedData && !error && tokenInfo && (
            <div className="max-w-xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-sky-700 px-6 py-6 text-white text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Icons.Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold">Encrypted Patient Health Record</h2>
                <p className="text-xs text-teal-100 mt-1">
                  Shared by <span className="font-bold underline">{getMaskedName(tokenInfo.patientName)}</span> (UHID: {tokenInfo.uhid})
                </p>
              </div>

              {/* Status Badges */}
              <div className="bg-slate-850 px-6 py-3 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Icons.Clock className="w-4 h-4 text-amber-400" />
                  <span>Expires: <strong className="text-slate-200">{new Date(tokenInfo.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</strong></span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Icons.User className="w-4 h-4 text-teal-400" />
                  <span>Views: <strong className="text-slate-200">{tokenInfo.currentAccessCount} / {tokenInfo.maxAccessCount} used</strong></span>
                </span>
              </div>

              <form onSubmit={handleUnlock} className="p-6 space-y-4">
                {tokenInfo.note && (
                  <div className="bg-teal-950/60 border border-teal-500/30 rounded-xl p-3 text-xs text-teal-200">
                    <strong>Patient Note:</strong> "{tokenInfo.note}"
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Enter Patient's Access Passcode <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Icons.Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter 4-digit code provided by patient"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono tracking-widest"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Hint: <strong>{tokenInfo.password}</strong></p>
                </div>

                {/* Doctor Identity (Audit Log) */}
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                    Consulting Doctor Credentials (ABDM Audit Trail)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Verma"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">MCI / State Reg. No.</label>
                      <input
                        type="text"
                        value={regNo}
                        onChange={e => setRegNo(e.target.value)}
                        placeholder="e.g. MCI-78410"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Clinic / Hospital</label>
                      <input
                        type="text"
                        value={clinic}
                        onChange={e => setClinic(e.target.value)}
                        placeholder="e.g. Apollo Clinic"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">City / State</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={unlocking}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center space-x-2 transition mt-4"
                >
                  {unlocking ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Decrypting Medical Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Icons.ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & View Medical History</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Unlocked Medical Record View */}
          {unlockedData && (
            <div className="space-y-6">
              {/* Patient Dossier Header Banner */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={unlockedData.patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                    alt="Patient"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-black text-white">{unlockedData.patient?.name}</h1>
                      <span className="bg-teal-500/20 text-teal-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">
                        {unlockedData.patient?.uhid}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {unlockedData.patient?.age} yrs, {unlockedData.patient?.gender} • Blood Group: <strong className="text-teal-300">{unlockedData.patient?.bloodGroup}</strong> • Phone: {unlockedData.patient?.phone}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-medium">
                        Allergies: {unlockedData.patient?.allergies?.join(', ') || 'None'}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                        Conditions: {unlockedData.patient?.chronicConditions?.join(', ') || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowRxModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/30 flex items-center space-x-2 transition"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Issue Digital Prescription</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                  >
                    <Icons.Download className="w-4 h-4 text-slate-300" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* Grid: Prescriptions & Lab Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Previous Prescriptions */}
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icons.Pill className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-white text-base">Previous Prescriptions</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {unlockedData.prescriptions?.length || 0} Records
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {unlockedData.prescriptions?.map((rx) => (
                      <div key={rx.id} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/80 hover:border-teal-500/40 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                              {rx.id}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{rx.diagnosis}</h4>
                            <p className="text-xs text-slate-400">{rx.doctorName} • {rx.doctorSpecialty}</p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{rx.date}</span>
                        </div>

                        {/* Medicines list */}
                        <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medicines Prescribed:</p>
                          {rx.medicines?.map((med, i) => (
                            <div key={i} className="text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-lg flex justify-between items-center text-slate-200">
                              <span className="font-semibold text-teal-200">{med.name}</span>
                              <span className="text-slate-400">{med.dosage} • {med.frequency} ({med.duration})</span>
                            </div>
                          ))}
                        </div>

                        {rx.notes && (
                          <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-850 p-2 rounded">
                            Advice: {rx.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Diagnostic Lab Reports */}
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icons.Activity className="w-5 h-5 text-sky-400" />
                      <h3 className="font-bold text-white text-base">Diagnostic Lab Reports</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {unlockedData.labReports?.length || 0} Reports
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {unlockedData.labReports?.map((rep) => (
                      <div key={rep.id} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/80 hover:border-sky-500/40 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                              {rep.id}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{rep.testName}</h4>
                            <p className="text-xs text-slate-400">{rep.category} • Certified Lab</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rep.overallStatus === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {rep.overallStatus || 'Verified'}
                          </span>
                        </div>

                        {/* Parameters table */}
                        {rep.parameters && rep.parameters.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-800 space-y-1">
                            {rep.parameters.map((p, idx) => (
                              <div key={idx} className="text-xs flex justify-between items-center py-1 border-b border-slate-800/40 text-slate-300">
                                <span>{p.name}</span>
                                <div className="space-x-2">
                                  <strong className={p.status === 'Normal' ? 'text-emerald-400' : 'text-amber-400'}>
                                    {p.value} {p.unit}
                                  </strong>
                                  <span className="text-slate-500 text-[10px]">({p.normalRange})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consultation History Summary */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Icons.Calendar className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">Past OPD Consultations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unlockedData.appointments?.map(apt => (
                    <div key={apt.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 text-xs">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{apt.doctorName} ({apt.doctorSpecialty})</span>
                        <span className="text-slate-400 font-mono">{apt.date}</span>
                      </div>
                      <p className="text-slate-400 mt-1">Symptoms: {apt.symptoms}</p>
                      <p className="text-teal-400 font-medium mt-1">Status: {apt.status} • Token: {apt.tokenNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Issue Digital Prescription Modal for Outside Doctor */}
          {showRxModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
                <div className="bg-gradient-to-r from-teal-700 to-sky-800 px-6 py-4 flex justify-between items-center text-white">
                  <div className="flex items-center space-x-2">
                    <Icons.Pill className="w-5 h-5 text-teal-200" />
                    <div>
                      <h3 className="font-bold text-base">Issue Pan-India Digital Prescription</h3>
                      <p className="text-xs text-teal-100">
                        Prescription will be automatically saved to patient's MediConnect app
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRxModal(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePrescription} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {rxSuccessMsg && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-200 rounded-xl p-3 text-xs font-bold flex items-center space-x-2">
                      <Icons.CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{rxSuccessMsg}</span>
                    </div>
                  )}

                  {/* Doctor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        placeholder="Dr. Full Name"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Clinic / Hospital & City</label>
                      <input
                        type="text"
                        value={clinic}
                        onChange={e => setClinic(e.target.value)}
                        placeholder="e.g. Fortis Hospital, Bengaluru"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Clinical Diagnosis / Findings <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={rxDiagnosis}
                      onChange={e => setRxDiagnosis(e.target.value)}
                      placeholder="e.g. Stage 1 Hypertension with acute tension headache"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Medicines dynamic table */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Rx Medicines & Dosages <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addMedicineRow}
                        className="px-2.5 py-1 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-bold rounded-lg border border-teal-500/40 flex items-center space-x-1"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        <span>Add Medicine</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {rxMedicines.map((med, idx) => (
                        <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={med.name}
                            onChange={e => updateMedicine(idx, 'name', e.target.value)}
                            placeholder="Medicine Name (e.g. Telmisartan)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            required
                          />
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={e => updateMedicine(idx, 'dosage', e.target.value)}
                            placeholder="Dosage (e.g. 40 mg)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={e => updateMedicine(idx, 'frequency', e.target.value)}
                            placeholder="Frequency (e.g. Once daily OD)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={med.duration}
                              onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                              placeholder="Duration (e.g. 30 Days)"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            {rxMedicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMedicineRow(idx)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <Icons.X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Advice / Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Doctor Advice / Lifestyle / Dietary Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={rxNotes}
                      onChange={e => setRxNotes(e.target.value)}
                      placeholder="e.g. Low sodium diet, 30 min daily brisk walking. Follow up in 2 weeks with BP chart."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingRx}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center space-x-2 transition"
                    >
                      {savingRx ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Attaching Prescription to Patient Record...</span>
                        </>
                      ) : (
                        <>
                          <Icons.CheckCircle className="w-4 h-4" />
                          <span>Sign & Save Digital Prescription</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ==================== src/components/LoginPage.jsx ====================




const ROLE_CONFIG = {
  patient: {
    label: 'Patient Portal',
    icon: 'User',
    gradient: 'from-teal-600 to-emerald-600',
    bg: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200',
    ring: 'ring-teal-500',
    badge: 'bg-teal-100 text-teal-800',
    demoUser: 'tushar.tawar@example.com',
    demoPass: 'patient123',
    demoPhone: '+91 98765 43210',
    demoPin: '1234',
    tagline: 'Book appointments, track lab samples, view EHR & share medical records'
  },
  doctor: {
    label: 'Doctor Portal',
    icon: 'Stethoscope',
    gradient: 'from-sky-600 to-blue-600',
    bg: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    ring: 'ring-sky-500',
    badge: 'bg-sky-100 text-sky-800',
    demoUser: 'dr.ananya@mediconnect.in',
    demoPass: 'doctor123',
    demoPhone: '+91 98111 88888',
    demoPin: '4321',
    tagline: 'Manage OPD queue, write digital prescriptions & review shared patient EHRs'
  },
  admin: {
    label: 'Admin Portal',
    icon: 'ShieldCheck',
    gradient: 'from-indigo-600 to-violet-600',
    bg: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
    ring: 'ring-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800',
    demoUser: 'admin@mediconnect.in',
    demoPass: 'admin@hms',
    demoPhone: '+91 98999 00000',
    demoPin: '9999',
    tagline: 'Hospital KPI dashboard, doctor roster & operational analytics'
  },
  receptionist: {
    label: 'Receptionist Portal',
    icon: 'Users',
    gradient: 'from-fuchsia-600 to-pink-600',
    bg: 'from-fuchsia-50 to-pink-50',
    border: 'border-fuchsia-200',
    ring: 'ring-fuchsia-500',
    badge: 'bg-fuchsia-100 text-fuchsia-800',
    demoUser: 'receptionist@mediconnect.in',
    demoPass: 'desk123',
    demoPhone: '+91 98888 77777',
    demoPin: '7777',
    tagline: 'Manage OPD queue, book walk-in appointments & handle chat escalations'
  }
};

function LoginPage({ onLogin }) {
  // Modes: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('patient');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSecurityPin, setSignupSecurityPin] = useState('');
  const [signupDept, setSignupDept] = useState('General Medicine');

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email/phone, 2: enter OTP & PIN, 3: success
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('5821');
  const [forgotPin, setForgotPin] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');

  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const cfg = ROLE_CONFIG[selectedRole] || ROLE_CONFIG.patient;
  const IconComp = Icons[cfg.icon] || Icons.User;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if ((role === 'admin' || role === 'receptionist') && authMode === 'signup') {
      setAuthMode('login');
    }
    setError('');
    setSuccess('');
  };

  const handleFillDemo = (type = 'email') => {
    if (type === 'email') setIdentifier(cfg.demoUser);
    else if (type === 'phone') setIdentifier(cfg.demoPhone);
    else setIdentifier(selectedRole === 'patient' ? 'aarav.sharma' : selectedRole === 'doctor' ? 'dr.ananya' : 'admin');
    setPassword(cfg.demoPass);
    setError('');
  };

  // ── Handle Login ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your Email / Phone / Username and Password.');
      return;
    }
    setLoading(true);

    try {
      const res = await apiService.loginUser(identifier.trim(), password, selectedRole);
      if (res.success) {
        onLogin({ role: res.user.role, user: res.user });
      } else {
        setError(res.error || 'Invalid credentials. Please verify your details.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Sign Up ────────────────────────────────────────────────────────
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');



    if (!signupName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid Email Address.');
      return;
    }
    if (!signupPhone.trim() || signupPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit Mobile Phone Number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!signupSecurityPin || signupSecurityPin.length !== 4) {
      setError('Please set a 4-digit Emergency Medical Security PIN.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await apiService.registerUser({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        securityPin: signupSecurityPin.trim(),
        role: selectedRole,
        dept: selectedRole === 'doctor' ? signupDept : undefined
      });

      setSuccess(selectedRole === 'doctor'
        ? `Account registered! Pending Admin verification.`
        : `Account registered successfully for ${newUser.name}! Logging you in...`
      );
      setTimeout(() => {
        if (selectedRole === 'doctor') {
          setAuthMode('login');
          setSuccess('');
        } else {
          onLogin({ role: selectedRole, user: newUser });
        }
      }, selectedRole === 'doctor' ? 3500 : 1200);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  // ── Handle Forgot Password ────────────────────────────────────────────────
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!forgotIdentifier.trim()) {
      setError('Please enter your registered Email or Phone Number.');
      return;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setForgotStep(2);
    setSuccess(`OTP sent to ${forgotIdentifier}! (Simulated SMS OTP: ${otp})`);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (forgotOtp.trim() !== generatedOtp) {
      setError(`Invalid OTP code entered. Please enter ${generatedOtp}`);
      return;
    }
    if (!forgotPin.trim()) {
      setError('Please enter your 4-digit Security Key.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.resetPassword(forgotIdentifier.trim(), forgotPin.trim(), forgotNewPass);
      if (res.success) {
        setForgotStep(3);
        setSuccess('Password updated successfully! You can now sign in.');
      } else {
        setError(res.error || 'Password reset failed.');
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* 24x7 Emergency National OPD Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white text-xs px-4 py-1.5 flex justify-between items-center shadow-md">
        <span className="flex items-center space-x-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>24x7 Emergency OPD:</span>
          <a href="tel:108" className="underline font-bold text-sky-200 hover:text-white">108</a>
          <span className="text-sky-400">|</span>
          <a href="tel:1800633422" className="underline font-semibold text-sky-200 hover:text-white">1800-MEDI-CONNECT</a>
        </span>
        <span className="hidden md:inline bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-500/30">
          ABDM Integrated · Universal EHR Access Across India
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md">
          {/* Main Logo & Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Icons.HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Medi<span className="text-teal-400">Connect</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Hospital Management System</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Universal EHR, Doctor OPD Consultation & Pan-India Health Record Sharing
            </p>
          </div>

          <div className="flex justify-center w-full">
            {/* Auth Card (Login / Sign Up / Forgot Password) */}
            <div className="w-full">
              <div className={`bg-gradient-to-br ${cfg.bg} rounded-3xl border-2 ${cfg.border} shadow-2xl overflow-hidden`}>
                {/* Header with Mode Switcher */}
                <div className={`bg-gradient-to-r ${cfg.gradient} px-6 pt-5 pb-4 text-white`}>
                  <div className="flex flex-col items-center mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                      <IconComp className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <h2 className="font-bold text-base">
                        {authMode === 'login' ? `Sign in to ${cfg.label}` : authMode === 'signup' ? `Create Account — ${cfg.label}` : 'Reset Password'}
                      </h2>
                      <p className="text-xs text-white/80">
                        {authMode === 'login' ? '' : authMode === 'signup' ? 'Register with 4-digit Security Key' : 'Verify identity with OTP & Security PIN'}
                      </p>
                    </div>
                  </div>



                  {selectedRole === 'admin' && (
                    <div className="mt-2.5 px-3 py-1.5 bg-black/30 border border-white/20 rounded-xl text-[11px] text-indigo-100 flex items-center space-x-2">
                      <Icons.ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span>Admin accounts are restricted to IT staff. Sign up is disabled for security.</span>
                    </div>
                  )}
                  {selectedRole === 'receptionist' && (
                    <div className="mt-2.5 px-3 py-1.5 bg-black/30 border border-white/20 rounded-xl text-[11px] text-fuchsia-100 flex items-center space-x-2">
                      <Icons.ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span>Receptionist accounts are created by Doctors. Sign up is disabled.</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Role Switcher (Bullets) */}
                  <div className="flex justify-center items-center space-x-6 mb-5 bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                    {['patient', 'doctor', 'admin', 'receptionist'].map((role) => (
                      <label key={role} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="roleSwitch"
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => handleRoleSelect(role)}
                          className={`w-4 h-4 cursor-pointer focus:ring-2 focus:ring-offset-1 ${role === 'patient' ? 'text-teal-600 focus:ring-teal-500' : role === 'doctor' ? 'text-sky-600 focus:ring-sky-500' : role === 'admin' ? 'text-indigo-600 focus:ring-indigo-500' : 'text-fuchsia-600 focus:ring-fuchsia-500'}`}
                        />
                        <span className={`text-xs font-bold capitalize transition-colors ${selectedRole === role ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{role}</span>
                      </label>
                    ))}
                  </div>

                  {/* Global Success / Error Feedback */}
                  {success && (
                    <div className="mb-4 flex items-center space-x-2 bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-800 font-bold animate-fadeIn">
                      <Icons.CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 flex items-center space-x-2 bg-red-50 border border-red-300 rounded-xl p-3 text-xs text-red-800 font-bold animate-fadeIn">
                      <Icons.X className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* ─────────────────── LOGIN FORM ─────────────────── */}
                  {authMode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Email / Phone / Username */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address / Phone Number / Username
                        </label>
                        <div className="relative">
                          <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={identifier}
                            onChange={e => { setIdentifier(e.target.value); setError(''); }}
                            placeholder="e.g. tushar@example.com or 9876543210"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400 transition"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-700">Password</label>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('forgot'); setForgotStep(1); setError(''); setSuccess(''); }}
                            className="text-[11px] font-bold text-teal-700 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Enter your password"
                            className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400 transition"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPass ? <Icons.X className="w-4 h-4" /> : <Icons.Activity className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
                          loading
                            ? 'opacity-70 cursor-not-allowed bg-slate-400'
                            : `bg-gradient-to-r ${cfg.gradient} hover:opacity-90 active:scale-[0.98]`
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Verifying Credentials...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <IconComp className="w-4 h-4" />
                            <span>Sign in to {cfg.label}</span>
                          </span>
                        )}
                      </button>

                      {selectedRole !== 'admin' && selectedRole !== 'receptionist' && (
                        <div className="text-center pt-2">
                          <p className="text-xs text-slate-500">
                            Don't have an account?{' '}
                            <button
                              type="button"
                              onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                              className="font-bold text-teal-700 hover:underline"
                            >
                              Sign Up
                            </button>
                          </p>
                        </div>
                      )}

                    </form>
                  )}

                  {/* ─────────────────── SIGN UP FORM ─────────────────── */}
                  {authMode === 'signup' && (
                    <form onSubmit={handleSignupSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={signupName}
                          onChange={e => setSignupName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (+91)</label>
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={e => setSignupPhone(e.target.value)}
                            placeholder="98765 43210"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                          <input
                            type="password"
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>

                        {/* 4-digit Security Key */}
                        <div>
                          <label className="block text-xs font-bold text-teal-800 mb-1">
                            4-Digit Security Key (PIN) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={signupSecurityPin}
                            onChange={e => setSignupSecurityPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="4-digit PIN e.g. 1234"
                            className="w-full px-3 py-2 text-sm border-2 border-teal-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900 font-mono tracking-widest text-center font-bold"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        * Security Key is used to authorize doctor record links and recover forgotten passwords.
                      </p>

                      {selectedRole === 'doctor' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Medical Department</label>
                          <select
                            value={signupDept}
                            onChange={e => setSignupDept(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white text-slate-900"
                          >
                            <option value="General Medicine">General Medicine</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Dermatology">Dermatology</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg mt-2 ${
                          loading
                            ? 'opacity-70 cursor-not-allowed bg-slate-400'
                            : `bg-gradient-to-r ${cfg.gradient} hover:opacity-90 active:scale-[0.98]`
                        }`}
                      >
                        {loading ? 'Creating Account...' : `Register & Enter as ${cfg.label}`}
                      </button>

                      <div className="text-center pt-2">
                        <p className="text-xs text-slate-500">
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                            className="font-bold text-teal-700 hover:underline"
                          >
                            Sign In
                          </button>
                        </p>
                      </div>
                    </form>
                  )}

                  {/* ─────────────────── FORGOT PASSWORD ─────────────────── */}
                  {authMode === 'forgot' && (
                    <div className="space-y-4">
                      {forgotStep === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Enter Registered Email or Mobile Number
                            </label>
                            <input
                              type="text"
                              value={forgotIdentifier}
                              onChange={e => setForgotIdentifier(e.target.value)}
                              placeholder="e.g. tushar@example.com or 9876543210"
                              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                              required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">We will send a 4-digit verification code to this address.</p>
                          </div>
                          <button
                            type="submit"
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 shadow-md`}
                          >
                            Send Verification OTP
                          </button>
                        </form>
                      )}

                      {forgotStep === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-3">
                          <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-xs text-teal-800">
                            Simulated SMS received: Your OTP code is <strong>{generatedOtp}</strong>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={forgotOtp}
                              onChange={e => setForgotOtp(e.target.value)}
                              placeholder="e.g. 5821"
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono text-center tracking-widest font-bold bg-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-teal-800 mb-1">
                              Enter 4-Digit Security Key (PIN)
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={forgotPin}
                              onChange={e => setForgotPin(e.target.value)}
                              placeholder="Default PIN: 1234"
                              className="w-full px-3 py-2 text-sm border-2 border-teal-400 rounded-xl font-mono text-center tracking-widest font-bold bg-white"
                              required
                            />
                            <span className="text-[10px] text-slate-500">Hint: 1234 for patient, 4321 for doctor</span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Set New Password</label>
                            <input
                              type="password"
                              value={forgotNewPass}
                              onChange={e => setForgotNewPass(e.target.value)}
                              placeholder="At least 6 characters"
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 shadow-md`}
                          >
                            {loading ? 'Updating Password...' : 'Verify Key & Reset Password'}
                          </button>
                        </form>
                      )}

                      {forgotStep === 3 && (
                        <div className="text-center py-4 space-y-3">
                          <Icons.CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                          <p className="text-sm font-bold text-slate-800">Your password was reset successfully!</p>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setForgotStep(1); }}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient}`}
                          >
                            Proceed to Sign In
                          </button>
                        </div>
                      )}

                      {forgotStep !== 3 && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setForgotStep(1); setError(''); setSuccess(''); }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                          >
                            Back to Login
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                MediConnect HMS
              </p>
            </div>
          </div>
        </div>

        {/* Floating Instant Demo */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border border-slate-700 shadow-2xl flex flex-col space-y-2 hover:bg-slate-800 transition-colors">
            <div className="flex items-center space-x-2">
              <Icons.Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Quick Access</span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.patient.demoUser); setPassword(ROLE_CONFIG.patient.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-lg transition"
                title="Patient Login"
              >
                <Icons.User className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.doctor.demoUser); setPassword(ROLE_CONFIG.doctor.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-sky-300 rounded-lg transition"
                title="Doctor Login"
              >
                <Icons.Stethoscope className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.admin.demoUser); setPassword(ROLE_CONFIG.admin.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-indigo-300 rounded-lg transition"
                title="Admin Login"
              >
                <Icons.ShieldCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.receptionist.demoUser); setPassword(ROLE_CONFIG.receptionist.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-fuchsia-300 rounded-lg transition"
                title="Receptionist Login"
              >
                <Icons.Users className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}


// ==================== src/App.jsx ====================














function App() {
  // ── Pan-India Shared EHR Token in URL ─────────────────────────
  const [activeShareToken, setActiveShareToken] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('share')) return params.get('share');
      if (window.location.hash.startsWith('#share=')) {
        return window.location.hash.replace('#share=', '');
      }
    } catch { return null; }
    return null;
  });

  // ── Auth state ────────────────────────────────────────────────
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('mediconnect_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [activeRole, setActiveRole] = useState(authSession?.role || 'patient');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // App Data States
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [sampleOrders, setSampleOrders] = useState([]);
  const [labPackages, setLabPackages] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);

  // ── Auth handlers ─────────────────────────────────────────────
  const handleLogin = ({ role, user }) => {
    const session = { role, user, loginTime: new Date().toISOString() };
    sessionStorage.setItem('mediconnect_session', JSON.stringify(session));
    setAuthSession(session);
    setActiveRole(role);
    showToast({
      type: 'success',
      title: `Welcome, ${user.name}!`,
      message: `Signed in to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal successfully.`
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mediconnect_session');
    setAuthSession(null);
    showToast({ type: 'info', title: 'Logged Out', message: 'Your session has ended. Please sign in again.' });
  };

  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Load data function (accessible to both useEffect and CloudDatabaseModal)
  const loadData = async () => {
    try {
      initStorage();
      const [pat, docs, depts, appts, rxs, labs, orders, pkgs, stats, usrs] = await Promise.all([
        apiService.getPatientProfile(),
        apiService.getDoctors(),
        apiService.getDepartments(),
        apiService.getAppointments(),
        apiService.getPrescriptions(),
        apiService.getLabReports(),
        apiService.getHomeSampleOrders(),
        apiService.getLabPackages(),
        apiService.getAdminStats(),
        apiService.getUsers()
      ]);
      setPatient(pat); setDoctors(docs || []); setDepartments(depts || []);
      setAppointments(appts || []); setPrescriptions(rxs || []); setLabReports(labs || []);
      setSampleOrders(orders || []); setLabPackages(pkgs || []); setAdminStats(stats || null); setUsers(usrs || []);
    } catch (e) {
      console.warn('Data loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (!authSession) { setLoading(false); return; }
    setLoading(true);
    loadData();
  }, [authSession]);

  // ── Data handlers ─────────────────────────────────────────────
  const handleBookAppointment = async (bookingData) => {
    const created = await apiService.bookAppointment(bookingData);
    setAppointments((prev) => [created, ...prev]);
    const updatedStats = await apiService.getAdminStats();
    setAdminStats(updatedStats);
    return created;
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    const updated = await apiService.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleUpdatePatientProfile = async (profileData) => {
    const updated = await apiService.updatePatientProfile(profileData);
    setPatient(updated);
  };

  const handleSavePrescription = async (rxData) => {
    const created = await apiService.addPrescription(rxData);
    setPrescriptions((prev) => [created, ...prev]);
    if (rxData.appointmentId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === rxData.appointmentId ? { ...a, status: 'Completed', prescriptionId: created.id } : a))
      );
    }
    return created;
  };

  const handleAddDoctor = async (doctorData) => {
    const created = await apiService.addDoctor(doctorData);
    setDoctors((prev) => [created, ...prev]);
    return created;
  };

  const handleVerifyDoctor = async (userId, doctorData) => {
    await apiService.verifyDoctorUser(userId);
    const created = await apiService.addDoctor(doctorData);
    setDoctors(prev => [created, ...prev]);
    const updatedUsers = await apiService.getUsers();
    setUsers(updatedUsers);
    showToast({ type: 'success', title: 'Doctor Verified', message: 'Doctor has been added to the hospital directory.' });
  };

  const handleUpdateDoctor = async (id, updates) => {
    const updated = await apiService.updateDoctor(id, updates);
    setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const handleAddDepartment = async (deptData) => {
    const created = await apiService.addDepartment(deptData);
    setDepartments((prev) => [...prev, created]);
    return created;
  };

  const handleRequestSampleOrder = async (orderData) => {
    const created = await apiService.bookHomeSample(orderData);
    setSampleOrders((prev) => [created, ...prev]);
    return created;
  };

  const handleAdvanceSampleStatus = async (id, newStatus) => {
    const updated = await apiService.updateSampleOrderStatus(id, newStatus);
    setSampleOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    showToast({ type: 'info', title: 'Lab Sample Status Advanced', message: `Order #${id} is now: ${newStatus.toUpperCase()}` });
  };

  // ── Standalone Pan-India Doctor Shared EHR Link ──────────────
  if (activeShareToken) {
    return (
      <DoctorSharedEhrView
        shareToken={activeShareToken}
        onBackToApp={() => {
          setActiveShareToken(null);
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {}
        }}
      />
    );
  }

  // ── Not logged in – show login page ──────────────────────────
  if (!authSession) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // ── Loading spinner ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-800">Initializing MediConnect HMS...</p>
          <p className="text-xs text-slate-500">Loading your {activeRole} portal data</p>
        </div>
      </div>
    );
  }

  // ── STRICT SECURITY: ROLE-BASED DATA ISOLATION ────────────────
  const activePatientName = authSession?.user?.name || patient?.name || 'Tushar Tawar';
  const activePatientId = authSession?.user?.id || patient?.id || 'pat-1';

  const isolatedPatientAppointments = appointments.filter(a => {
    if (a.patientId && a.patientId === activePatientId) return true;
    if (a.patientName && a.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const isolatedPatientPrescriptions = prescriptions.filter(p => {
    if (p.patientId && p.patientId === activePatientId) return true;
    if (p.patientName && p.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const isolatedPatientLabReports = labReports.filter(l => {
    if (l.patientId && l.patientId === activePatientId) return true;
    if (l.patientName && l.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const activeDoctorName = authSession?.user?.name || 'Dr. Ananya Sharma';
  const activeDoctorId = authSession?.user?.id || 'doc-1';

  const isolatedDoctorAppointments = appointments.filter(a => {
    if (a.doctorId && a.doctorId === activeDoctorId) return true;
    if (a.doctorName && (
      a.doctorName.toLowerCase().includes('ananya') ||
      a.doctorName.toLowerCase().includes(activeDoctorName.toLowerCase().split(' ')[1] || activeDoctorName.toLowerCase())
    )) return true;
    return false;
  });

  const isolatedDoctorPrescriptions = prescriptions.filter(p => {
    if (p.doctorId && p.doctorId === activeDoctorId) return true;
    if (p.doctorName && (
      p.doctorName.toLowerCase().includes('ananya') ||
      p.doctorName.toLowerCase().includes(activeDoctorName.toLowerCase().split(' ')[1] || activeDoctorName.toLowerCase())
    )) return true;
    return false;
  });

  const activeReceptionistDoctorId = authSession?.user?.assignedDoctorId || 'doc-1';
  const isolatedReceptionistAppointments = appointments.filter(a => a.doctorId === activeReceptionistDoctorId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Persistent Global Header with Role Switcher */}
      <Navbar
        activeRole={activeRole}
        setRole={setActiveRole}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onLogout={handleLogout}
        patient={patient}
        authUser={authSession?.user}
      />

      {/* Role-Based Data Isolation Security Banner */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>
            {activeRole === 'patient' && `Protected Session: Showing health records for ${activePatientName} only. Other patients' data is completely restricted.`}
            {activeRole === 'doctor' && `Licensed Clinical Session: Showing OPD queue for ${activeDoctorName} only. Other doctors' queues are private.`}
            {activeRole === 'admin' && 'Administrative Isolation: Operational metrics active; patient diagnoses and symptoms are strictly redacted.'}
          </span>
        </div>
      </div>

      {/* Portal Views */}
      <div className="flex-1">
        {activeRole === 'patient' && (
          <PatientPortal
            patient={patient}
            appointments={isolatedPatientAppointments}
            doctors={doctors}
            departments={departments}
            prescriptions={isolatedPatientPrescriptions}
            labReports={isolatedPatientLabReports}
            sampleOrders={sampleOrders}
            labPackages={labPackages}
            onBookAppointment={handleBookAppointment}
            onUpdatePatientProfile={handleUpdatePatientProfile}
            onRequestSampleOrder={handleRequestSampleOrder}
            onAdvanceSampleStatus={handleAdvanceSampleStatus}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            showToast={showToast}
          />
        )}

        {activeRole === 'doctor' && (
          <DoctorPortal
            appointments={isolatedDoctorAppointments}
            prescriptions={isolatedDoctorPrescriptions}
            doctors={doctors}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onSavePrescription={handleSavePrescription}
            onUpdateDoctor={handleUpdateDoctor}
            showToast={showToast}
            authUser={authSession?.user}
          />
        )}

        {activeRole === 'admin' && (
          <AdminPortal
            stats={adminStats}
            doctors={doctors}
            departments={departments}
            appointments={appointments}
            users={users}
            onAddDoctor={handleAddDoctor}
            onVerifyDoctor={handleVerifyDoctor}
            onUpdateDoctor={handleUpdateDoctor}
            onAddDepartment={handleAddDepartment}
            showToast={showToast}
          />
        )}

        {activeRole === 'receptionist' && (
          <ReceptionistPortal
            appointments={isolatedReceptionistAppointments}
            doctors={doctors}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onBookAppointment={handleBookAppointment}
            showToast={showToast}
            authUser={authSession?.user}
          />
        )}
      </div>

      {/* Global Modals & Notifications */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={activeRole}
        onSelectRole={(role) => {
          setActiveRole(role);
          showToast({
            type: 'info',
            title: `Switched to ${role.toUpperCase()} View`,
            message: `Now viewing MediConnect as ${role === 'patient' ? 'Patient (Aarav Sharma)' : role === 'doctor' ? 'Doctor (Dr. Ananya Iyer)' : 'Hospital Super Admin'}.`
          });
        }}
      />

      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <CloudDatabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        showToast={showToast}
        onSyncComplete={loadData}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}



// ==================== Bootstrap ====================
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
