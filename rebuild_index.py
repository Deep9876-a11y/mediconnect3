"""
Replaces the inline <script type="text/babel" ...>...</script> block in index.html
with freshly generated appBundle.jsx content.
"""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('src/appBundle.jsx', 'r', encoding='utf-8') as f:
    bundle_code = f.read()

pattern = re.compile(r'<script\s+type="text/babel"[^>]*>', re.IGNORECASE)
match = pattern.search(html)

if not match:
    print('ERROR: Could not find <script type="text/babel"> in index.html')
    exit(1)

start_tag_end = match.end()
end_idx = html.find('</script>', start_tag_end)
if end_idx == -1:
    print('ERROR: Could not find closing </script>')
    exit(1)

new_html = html[:start_tag_end] + '\n' + bundle_code + '\n' + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('index.html updated! Size: ' + str(len(new_html) // 1024) + ' KB')
