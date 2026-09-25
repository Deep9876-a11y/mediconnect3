"""
patch_local.py - Patches index.html to use local vendor files instead of CDN.
Run after setup_vendor.py: python patch_local.py
"""
import os

required = [
    'vendor/react.production.min.js',
    'vendor/react-dom.production.min.js',
    'vendor/babel.min.js',
]
for r in required:
    if not os.path.exists(r) or os.path.getsize(r) < 10000:
        print(f'ERROR: {r} missing! Run: python setup_vendor.py first')
        exit(1)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Patch CDN URLs to local paths
patches = [
    (
        'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
        '/vendor/react.production.min.js'
    ),
    (
        'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
        '/vendor/react-dom.production.min.js'
    ),
    (
        'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
        '/vendor/babel.min.js'
    ),
]

applied = 0
for cdn_url, local_path in patches:
    if cdn_url in html:
        html = html.replace(cdn_url, local_path)
        applied += 1
        print(f'  [OK] Patched: {cdn_url.split("/")[-1]} -> {local_path}')
    elif local_path in html:
        print(f'  [SKIP] Already local: {local_path}')
        applied += 1
    else:
        print(f'  [WARN] Not found: {cdn_url}')

# Also remove the preload tags that point to CDN (they won't work for local files the same way)
# They're harmless but clean up
html = html.replace(
    '  <link rel="preload" href="https://unpkg.com/react@18.3.1/umd/react.production.min.js" as="script" crossorigin>\n',
    ''
)
html = html.replace(
    '  <link rel="preload" href="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" as="script" crossorigin>\n',
    ''
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print()
print(f'index.html patched ({applied}/3 libraries now local)')
print('Run: python run.py  -> Page will load INSTANTLY from localhost!')
