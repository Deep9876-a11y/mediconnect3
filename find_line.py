import re

content = open('index.html', encoding='utf-8').read()

# Extract the babel script block
tag_match = re.search(r'<script[^>]*text/babel[^>]*>', content)
if not tag_match:
    print('No babel script found')
    exit()

tag_end = tag_match.end()
close_idx = content.find('</script>', tag_end)
script = content[tag_end:close_idx]

lines = script.split('\n')
print(f'Script has {len(lines)} lines')
print('Lines around 2630:')
for i in range(2625, min(2640, len(lines))):
    print(f'{i+1}: {lines[i][:120]}')
