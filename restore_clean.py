"""
restore_clean.py - Restores index.html to clean working state.
- Uses local vendor files (react, reactdom, babel)
- Removes extra clutter added by precompile.py
- Restores simple type="text/babel" tag
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove extra preconnect block added by precompile.py
html = html.replace(
    '  <!-- Performance: Preconnect to CDNs -->\n'
    '  <link rel="preconnect" href="https://unpkg.com" crossorigin>\n'
    '  <link rel="dns-prefetch" href="https://unpkg.com">\n'
    '  <link rel="preconnect" href="https://cdn.tailwindcss.com" crossorigin>\n'
    '  <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">\n'
    '\n',
    ''
)

# 2. Remove preload tags
html = html.replace(
    '  <!-- Preload React bundles -->\n'
    '  <link rel="preload" href="https://unpkg.com/react@18.3.1/umd/react.production.min.js" as="script" crossorigin>\n'
    '  <link rel="preload" href="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" as="script" crossorigin>\n',
    ''
)

# 3. Use local vendor files (fast localhost loading)
html = html.replace(
    'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    '/vendor/react.production.min.js'
)
html = html.replace(
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
    '/vendor/react-dom.production.min.js'
)
html = html.replace(
    'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
    '/vendor/babel.min.js'
)

# 4. Restore simple babel script tag (remove data-presets attribute if present)
import re
html = re.sub(
    r'<script\s+type="text/babel"\s+data-presets="react">',
    '<script type="text/babel">',
    html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('index.html restored cleanly!')
print('Size:', len(html)//1024, 'KB')

# Verify
lines = html.split('\n')
for i, l in enumerate(lines[:100], 1):
    if 'babel' in l.lower() or 'react' in l.lower() or 'tailwind' in l.lower() or 'vendor' in l.lower():
        if '<script' in l or '<link' in l:
            print(f'  Line {i}: {l.strip()}')
