import re

with open('src/appBundle.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Check for stray import keywords or leftover from keywords
leftovers = re.findall(r'(\bfrom\s+[\'"][^\'"]+[\'"])', code)
if leftovers:
    print('Found stray from statements:', leftovers)
else:
    print('No stray from statements found!')

# Check for export statements
export_leftovers = re.findall(r'(\bexport\b)', code)
if export_leftovers:
    print('Found stray export statements:', len(export_leftovers))
else:
    print('No stray export statements found!')

# Check bracket balances
brackets = {'{': '}', '(': ')', '[': ']'}
stack = []
for idx, ch in enumerate(code):
    if ch in '{([ ':
        if ch != ' ': stack.append((ch, idx))
    elif ch in '})]':
        if not stack:
            print('Extra closing bracket', ch, 'at pos', idx)
            break
        last, last_idx = stack.pop()
        if brackets[last] != ch:
            print(f'Mismatched bracket: opened {last} at {last_idx}, closed with {ch} at {idx}')
            break
if not stack:
    print('Bracket matching 100% PERFECT!')
else:
    print('Unclosed count:', len(stack))
