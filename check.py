import sqlite3
conn = sqlite3.connect('mediconnect.db')
conn.row_factory = sqlite3.Row
for row in conn.execute("SELECT * FROM users WHERE role='receptionist'"):
    print(dict(row))
conn.close()
