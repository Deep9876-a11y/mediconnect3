import sqlite3
conn = sqlite3.connect('mediconnect.db')
conn.execute("UPDATE users SET assigned_doctor_id='doc-1' WHERE id='usr-5'")
conn.commit()
conn.close()
