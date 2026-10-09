import re

files = [
    'src/data/mockData.js',
    'src/api/firebaseService.js',
    'src/api/apiService.js',
    'src/components/Icons.jsx',
    'src/components/Navbar.jsx',
    'src/components/RoleModal.jsx',
    'src/components/Toast.jsx',
    'src/components/AiAssistantModal.jsx',
    'src/components/CloudDatabaseModal.jsx',
    'src/portals/patient/BookingModal.jsx',
    'src/portals/patient/DoctorSearch.jsx',
    'src/portals/patient/HomeSampleTracker.jsx',
    'src/portals/patient/ShareRecordModal.jsx',
    'src/portals/patient/HealthRecords.jsx',
    'src/portals/patient/PatientProfile.jsx',
    'src/portals/patient/PatientHome.jsx',
    'src/portals/patient/PatientPortal.jsx',
    'src/portals/doctor/PatientHistoryModal.jsx',
    'src/portals/doctor/PrescriptionModal.jsx',
    'src/portals/doctor/SlotManager.jsx',
    'src/portals/doctor/ManageReceptionist.jsx',
    'src/portals/doctor/DoctorPortal.jsx',
    'src/portals/receptionist/ReceptionistPortal.jsx',
    'src/portals/admin/ManageDoctors.jsx',
    'src/portals/admin/ManageDepartments.jsx',
    'src/portals/admin/ReportsAnalytics.jsx',
    'src/portals/admin/AdminPortal.jsx',
    'src/portals/shared/DoctorSharedEhrView.jsx',
    'src/components/LoginPage.jsx',
    'src/App.jsx'
]

combined = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()

    # Strip all import statements (single-line or multi-line)
    content = re.sub(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', '', content)
    content = re.sub(r'import\s+[\'"][^\'"]+[\'"];?', '', content)

    lines = content.split('\n')
    filtered_lines = []
    for line in lines:
        if line.startswith('export const '):
            line = 'const ' + line[len('export const '):]
        elif line.startswith('export function '):
            line = 'function ' + line[len('export function '):]
        elif line.startswith('export default '):
            line = line[len('export default '):]
        filtered_lines.append(line)
    combined.append('// ==================== ' + f + ' ====================\n' + '\n'.join(filtered_lines))

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
    out.write('const { useState, useEffect, useRef, useCallback } = React;\n\n' + '\n\n'.join(combined))

print('appBundle.jsx generated successfully!')
