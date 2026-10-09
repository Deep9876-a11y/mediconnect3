export const INITIAL_DEPARTMENTS = [
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

export const INITIAL_DOCTORS = [
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

export const CURRENT_PATIENT = {
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

export const INITIAL_APPOINTMENTS = [
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

export const INITIAL_PRESCRIPTIONS = [
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

export const INITIAL_LAB_REPORTS = [
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

export const AVAILABLE_LAB_PACKAGES = [
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

export const INITIAL_HOME_SAMPLE_ORDERS = [
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

export const INITIAL_ADMIN_STATS = {
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


export const INITIAL_PATIENTS = [
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

export const INITIAL_SHARE_LINKS = [
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

export const INITIAL_USERS = [
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
