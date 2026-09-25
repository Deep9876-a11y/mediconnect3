"""Quick diagnostic to find Babel/JSX parse errors in index.html"""
import re

with open('index.html', encoding='utf-8') as f:
    c = f.read()

# Find the babel script boundaries
start_marker = '<script type="text/babel">'
start_idx = c.find(start_marker)
if start_idx < 0:
    print('ERROR: No text/babel script found!')
    exit(1)

script_start = start_idx + len(start_marker)
end_idx = c.rfind('</script>')
script = c[script_start:end_idx]

print('Script length:', len(script), 'chars,', script.count('\n'), 'lines')

# Check for leftover import statements
imports = re.findall(r'^import\s+\S+', script, re.MULTILINE)
if imports:
    print(f'WARNING: {len(imports)} import statement(s) found - these crash Babel!')
    for imp in imports[:5]:
        print('  ', imp)
else:
    print('OK: No leftover import statements')

# Check for AbortSignal.timeout (known bug)
if 'AbortSignal.timeout' in script:
    print('ERROR: AbortSignal.timeout found - crashes in Babel!')
else:
    print('OK: No AbortSignal.timeout')

# Check balanced braces/parens roughly
p_open = script.count('(')
p_close = script.count(')')
b_open = script.count('{')
b_close = script.count('}')
print(f'Parens: open={p_open}, close={p_close}, diff={p_open-p_close}')
print(f'Braces: open={b_open}, close={b_close}, diff={b_open-b_close}')

# Look for functions defined
funcs = re.findall(r'^(?:function|const|let|var)\s+(\w+)', script, re.MULTILINE)
print(f'\nTop-level declarations: {len(funcs)}')
key_funcs = ['App', 'ChatBox', 'PatientPortal', 'DoctorPortal', 'AdminPortal', 'Navbar', 'RoleModal', 'AiAssistantModal', 'Toast', 'initStorage', 'chatService']
for kf in key_funcs:
    found = kf in script
    print(f'  {"OK " if found else "ERR"} {kf}')

print('\nFile size:', len(c)//1024, 'KB')
