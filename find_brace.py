with open('index.html', encoding='utf-8') as f:
    c = f.read()

start_marker = '<script type="text/babel">'
start_idx = c.find(start_marker)
script_start = start_idx + len(start_marker)
end_idx = c.rfind('</script>')
script = c[script_start:end_idx]

lines = script.split('\n')
depth = 0
last_open_line = None
last_open_content = None

for i, line in enumerate(lines, 1):
    for ch in line:
        if ch == '{':
            depth += 1
            last_open_line = i + 127
            last_open_content = line.strip()[:60]
        elif ch == '}':
            depth -= 1
    if depth < 0:
        print(f'EXTRA CLOSE BRACE at html line ~{i+127}: {line.strip()[:80]}')
        break

print(f'Final brace depth: {depth}')
if depth > 0:
    print(f'Unclosed brace near html line {last_open_line}: {last_open_content}')

# Also show last 20 lines of script for context
print('\n--- Last 20 lines of script ---')
for i, l in enumerate(lines[-20:], len(lines)-19):
    print(f'{i+127:5}: {l}')
