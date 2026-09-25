with open('src/data/mockData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Aarav Sharma with Tushar Tawar
text = text.replace('Aarav Sharma', 'Tushar Tawar')
text = text.replace('Aarav', 'Tushar')
text = text.replace('aarav.sharma@example.com', 'tushar.tawar@example.com')
text = text.replace('MC-2026-8941', 'MC-2026-9082')
text = text.replace('Pooja Sharma (Spouse)', 'Sunil Tawar (Father)')
text = text.replace('age: 32', 'age: 22')

patients_code = """

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
"""

if 'INITIAL_PATIENTS' not in text:
    text += patients_code

with open('src/data/mockData.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated mockData.js with Tushar Tawar & INITIAL_PATIENTS!')
