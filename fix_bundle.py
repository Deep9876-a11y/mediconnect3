import re

files = [
    'src/data/mockData.js',
    'src/api/apiService.js',
    'src/components/Icons.jsx',
    'src/components/Navbar.jsx',
    'src/components/RoleModal.jsx',
    'src/components/AiAssistantModal.jsx',
    'src/components/Toast.jsx',
    'src/portals/patient/BookingModal.jsx',
    'src/portals/patient/DoctorSearch.jsx',
    'src/portals/patient/HomeSampleTracker.jsx',
    'src/portals/patient/HealthRecords.jsx',
    'src/portals/patient/PatientProfile.jsx',
    'src/portals/patient/PatientHome.jsx',
    'src/portals/patient/PatientPortal.jsx',
    'src/portals/doctor/PatientHistoryModal.jsx',
    'src/portals/doctor/PrescriptionModal.jsx',
    'src/portals/doctor/SlotManager.jsx',
    'src/portals/doctor/DoctorPortal.jsx',
    'src/portals/admin/ManageDoctors.jsx',
    'src/portals/admin/ManageDepartments.jsx',
    'src/portals/admin/ReportsAnalytics.jsx',
    'src/portals/admin/AdminPortal.jsx',
    'src/App.jsx'
]

combined = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()

        # Remove single or multi-line import statements
        content = re.sub(r'import\s+[\s\S]*?from\s+[\'\"][^\'\"]+[\'\"];?\n?', '', content)
        # Also remove any standalone side-effect imports like import './style.css';
        content = re.sub(r'import\s+[\'\"][^\'\"]+[\'\"];?\n?', '', content)

        # Replace export statements
        content = re.sub(r'^export\s+const\s+', 'const ', content, flags=re.MULTILINE)
        content = re.sub(r'^export\s+function\s+', 'function ', content, flags=re.MULTILINE)
        content = re.sub(r'^export\s+default\s+', '', content, flags=re.MULTILINE)

        combined.append(f'// ==================== {f} ====================\n' + content)

bootstrap = """
// ==================== Bootstrap ====================
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
"""
combined.append(bootstrap)

with open('src/appBundle.jsx', 'w', encoding='utf-8') as out:
    out.write('const { useState, useEffect, useRef } = React;\n\n' + '\n\n'.join(combined))

print('Cleaned and rebuilt src/appBundle.jsx successfully!')
