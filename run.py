import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import json
import urllib.parse
import backend_db

# Fix Windows console encoding for emoji support
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

class MediConnectHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Suppress noisy 200/304 request logs
        if args and len(args) >= 2 and str(args[1]).startswith(('4', '5')):
            super().log_message(format, *args)

    def send_json(self, status_code, data):
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role')
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role')
        self.end_headers()

    def end_headers(self):
        # Prevent caching for frontend files
        if self.path == '/' or self.path.endswith('.html') or self.path.endswith('.jsx') or self.path.endswith('.js') or self.path.endswith('.css'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def get_role_header(self):
        return self.headers.get('X-User-Role', 'patient')

    def read_json_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length == 0:
                return {}
            raw = self.rfile.read(length).decode('utf-8')
            return json.loads(raw)
        except Exception:
            return {}

    # ── GET API Handlers ──────────────────────────────────────────────────────
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        role = self.get_role_header()

        if not path.startswith('/api'):
            return super().do_GET()

        try:
            if path == '/api/health':
                return self.send_json(200, {'status': 'ok', 'database': 'mediconnect.db', 'type': 'sqlite3'})

            elif path == '/api/departments':
                return self.send_json(200, backend_db.api_get_departments())

            elif path == '/api/doctors':
                return self.send_json(200, backend_db.api_get_doctors())

            elif path.startswith('/api/patient'):
                # Extract optional ID: /api/patient/pat-1
                parts = path.strip('/').split('/')
                patient_id = parts[2] if len(parts) > 2 else 'pat-1'
                pat = backend_db.api_get_patient(patient_id)
                if pat:
                    return self.send_json(200, pat)
                return self.send_json(404, {'error': 'Patient not found'})

            elif path == '/api/appointments':
                # Pass role for clinical PHI privacy filtering
                appts = backend_db.api_get_appointments(role=role)
                return self.send_json(200, appts)

            elif path == '/api/prescriptions':
                # SECURITY RULE: Admin role cannot access prescriptions
                rxs = backend_db.api_get_prescriptions(role=role)
                return self.send_json(200, rxs)

            elif path in ['/api/lab-reports', '/api/lab/reports']:
                # SECURITY RULE: Admin role cannot access lab reports
                reports = backend_db.api_get_lab_reports(role=role)
                return self.send_json(200, reports)

            elif path == '/api/admin/stats':
                return self.send_json(200, {
                    "totalPatients": 1284,
                    "todayAppointments": 76,
                    "dailyRevenue": 158400,
                    "bedOccupancyRate": 85.6,
                    "activeDoctors": 14,
                    "recentActivity": [
                        {"id": 1, "text": "Patient OPD token C-101 verified via PIN", "time": "Just now"},
                        {"id": 2, "text": "Online Cloud Firestore dual-sync active (asia-south1)", "time": "3 mins ago"}
                    ]
                })

            elif path == '/api/cloud/status':
                return self.send_json(200, {
                    "status": "online",
                    "provider": "Google Cloud Firestore",
                    "projectId": "mediconnect-hms-india",
                    "region": "asia-south1 (Mumbai, India)",
                    "dualSync": True
                })

            elif path == '/api/share-links':
                links = backend_db.api_get_share_links('pat-1')
                return self.send_json(200, links)

            elif path == '/api/users':
                return self.send_json(200, backend_db.api_get_users())

            else:
                return self.send_json(404, {'error': f'Route not found: {path}'})

        except Exception as e:
            return self.send_json(500, {'error': str(e)})

    # ── POST API Handlers ─────────────────────────────────────────────────────
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if not path.startswith('/api'):
            self.send_error(404)
            return

        body = self.read_json_body()

        try:
            if path == '/api/auth/login':
                res = backend_db.api_login_user(
                    body.get('identifier', ''),
                    body.get('password', ''),
                    body.get('role', 'patient')
                )
                status = 200 if res.get('success') else 401
                return self.send_json(status, res)

            elif path == '/api/auth/signup':
                # CRITICAL SECURITY RULE: Admin signup is blocked at database layer
                if body.get('role') == 'admin':
                    return self.send_json(403, {
                        'success': False,
                        'error': 'Sign up for Admin role is disabled for hospital cybersecurity compliance.'
                    })
                res = backend_db.api_register_user(body)
                status = 201 if res.get('success') else 400
                return self.send_json(status, res)

            elif path == '/api/auth/forgot-password':
                res = backend_db.api_reset_password(
                    body.get('identifier', ''),
                    body.get('otp', ''),
                    body.get('securityPin', ''),
                    body.get('newPassword', '')
                )
                status = 200 if res.get('success') else 400
                return self.send_json(status, res)

            elif path == '/api/departments':
                dept = backend_db.api_add_department(body)
                return self.send_json(201, dept)

            elif path == '/api/doctors':
                doc = backend_db.api_add_doctor(body)
                return self.send_json(201, doc)

            elif path == '/api/appointments':
                apt = backend_db.api_create_appointment(body)
                return self.send_json(201, apt)

            elif path == '/api/prescriptions':
                rx = backend_db.api_create_prescription(body)
                return self.send_json(201, rx)

            elif path == '/api/lab-reports':
                lr = backend_db.api_create_lab_report(body)
                return self.send_json(201, lr)

            elif path == '/api/share-links':
                sl = backend_db.api_create_share_link(body)
                return self.send_json(201, sl)

            elif path == '/api/share-links/verify':
                res = backend_db.api_verify_share_link(body.get('token', ''), body.get('password', ''))
                status = 200 if res.get('success') else 401
                return self.send_json(status, res)

            else:
                return self.send_json(404, {'error': f'POST route not found: {path}'})

        except Exception as e:
            return self.send_json(500, {'error': str(e)})

    # ── PUT Handlers ──────────────────────────────────────────────────────────
    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        try:
            if path.startswith('/api/doctors/'):
                doc_id = path.split('/')[-1]
                updated = backend_db.api_update_doctor(doc_id, body)
                return self.send_json(200, updated)

            elif path.startswith('/api/patient'):
                parts = path.strip('/').split('/')
                patient_id = parts[2] if len(parts) > 2 else 'pat-1'
                updated = backend_db.api_update_patient(patient_id, body)
                return self.send_json(200, updated)

            else:
                return self.send_json(404, {'error': f'PUT route not found: {path}'})

        except Exception as e:
            return self.send_json(500, {'error': str(e)})

    # ── PATCH Handlers ────────────────────────────────────────────────────────
    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        try:
            if path.startswith('/api/appointments/'):
                apt_id = path.split('/')[-1]
                status = body.get('status', 'Completed')
                res = backend_db.api_update_appointment_status(apt_id, status)
                return self.send_json(200, res)
            else:
                return self.send_json(404, {'error': f'PATCH route not found: {path}'})

        except Exception as e:
            return self.send_json(500, {'error': str(e)})

    # ── DELETE Handlers ───────────────────────────────────────────────────────
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        try:
            if path.startswith('/api/share-links/'):
                link_id = path.split('/')[-1]
                res = backend_db.api_delete_share_link(link_id)
                return self.send_json(200, res)
            else:
                return self.send_json(404, {'error': f'DELETE route not found: {path}'})

        except Exception as e:
            return self.send_json(500, {'error': str(e)})

def main():
    print("=" * 60)
    print("  MediConnect - Hospital Management System (v2.5)")
    print("  SQLite Database Layer: mediconnect.db")
    print("=" * 60)

    server = None
    target_port = PORT

    for p in [5173, 5174, 3000, 8080]:
        try:
            socketserver.TCPServer.allow_reuse_address = True
            server = socketserver.TCPServer(("", p), MediConnectHandler)
            target_port = p
            break
        except OSError:
            continue

    if server is None:
        print("  ERROR: Could not bind to any port (5173, 5174, 3000, 8080)")
        sys.exit(1)

    url = f"http://localhost:{target_port}"
    print(f"  Web & Database API Live : {url}")
    print(f"  SQLite Database         : {backend_db.DB_FILE}")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
