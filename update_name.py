import sqlite3

conn = sqlite3.connect('mediconnect.db')
c = conn.cursor()

# Update receptionist name - remove "Demo" word
c.execute("UPDATE users SET name='Priya Sharma' WHERE email='receptionist@mediconnect.in'")
conn.commit()
print('Updated rows:', c.rowcount)

# Verify
row = c.execute("SELECT id, name, email, role FROM users WHERE email='receptionist@mediconnect.in'").fetchone()
print('New record:', dict(row))
conn.close()
