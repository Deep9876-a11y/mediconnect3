import sqlite3
from datetime import datetime

conn = sqlite3.connect('mediconnect.db')
c = conn.cursor()
c.execute('''
INSERT OR REPLACE INTO users (id, name, email, phone, username, role, password, security_pin, created_at, assigned_doctor_id)
VALUES (?,?,?,?,?,?,?,?,?,?)
''', ('usr-5', 'Demo Receptionist', 'receptionist@mediconnect.in', '+91 98888 77777', 'receptionist', 'receptionist', 'desk123', '7777', datetime.now().isoformat(), 'usr-2'))
conn.commit()
conn.close()
print('Done')
