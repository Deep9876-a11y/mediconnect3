c = open('index.html', encoding='utf-8').read()

checks = [
    ('react.production.min.js',  'React (local)',          True),
    ('react-dom.production.min.js', 'ReactDOM (local)',    True),
    ('babel.min.js',             'Babel (local)',          True),
    ('cdn.tailwindcss.com',      'Tailwind CDN',           True),
    ('vendor/',                  'Local vendor path',      True),
    ('text/babel',               'Babel script tag',       True),
    ('function App()',           'App component',          True),
    ('function ChatBox',         'ChatBox',                True),
    ('function PatientPortal',   'PatientPortal',          True),
    ('function DoctorPortal',    'DoctorPortal',           True),
    ('function AdminPortal',     'AdminPortal',            True),
    ('ReactDOM.createRoot',      'React mount',            True),
    ('const chatService',        'chatService',            True),
    ('function initStorage',     'initStorage',            True),
    ('AbortSignal.timeout',      'AbortSignal bug',        False),
    ('import React',             'Leftover import',        False),
]

print('=== Final Health Check ===')
all_ok = True
for pattern, label, should_exist in checks:
    found = pattern in c
    ok = found if should_exist else not found
    if not ok:
        all_ok = False
    status = 'OK ' if ok else 'ERR'
    note = '' if ok else (' (found unexpectedly)' if not should_exist else ' (MISSING!)')
    print('  [' + status + '] ' + label + note)

print('')
print('File size: ' + str(len(c)//1024) + ' KB')
print('RESULT: ' + ('ALL GOOD - App ready to run!' if all_ok else 'ISSUES FOUND'))
