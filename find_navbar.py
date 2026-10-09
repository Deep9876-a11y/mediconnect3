import re

content = open('index.html', encoding='utf-8').read()

# Extract the babel script block
tag_match = re.search(r'<script[^>]*text/babel[^>]*>', content)
tag_end = tag_match.end()
close_idx = content.find('</script>', tag_end)
script = content[tag_end:close_idx]

lines = script.split('\n')

# Find the Navbar function
for i, line in enumerate(lines):
    if 'function Navbar(' in line or 'const Navbar = ' in line:
        print(f'Navbar at script line {i+1}')
        break

# Find ALL roleBadge definitions
for i, line in enumerate(lines):
    if 'const roleBadge' in line:
        print(f'roleBadge at script line {i+1}: {line.strip()[:100]}')
        # print next 10 lines
        for j in range(i, min(i+10, len(lines))):
            print(f'  {j+1}: {lines[j][:100]}')
        print()
