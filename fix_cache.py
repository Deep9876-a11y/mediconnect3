import re

content = open('index.html', encoding='utf-8').read()

# Find the babel script tag
match = re.search(r'<script\s+type="text/babel"[^>]*>', content)
if match:
    print('Found script tag:', repr(match.group()))
else:
    print('No babel script tag found!')

# Check if the roleBadge fix is actually in there
rb_idx = content.find('receptionist: { label:')
print('Receptionist badge at index:', rb_idx)

# Check total file size
print('index.html size:', len(content), 'bytes')

# Now let's do a definitive test - find what's at line 2630 (as error says)
lines = content.split('\n')
print('Total lines:', len(lines))
if len(lines) >= 2630:
    print('Line 2630:', lines[2629][:200])
    print('Line 2629:', lines[2628][:200])
    print('Line 2628:', lines[2627][:200])
