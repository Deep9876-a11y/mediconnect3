"""
setup_vendor.py - Downloads all CDN libraries locally for fast offline loading.
Run once: python setup_vendor.py
"""
import urllib.request
import os
import sys

VENDOR_DIR = 'vendor'
os.makedirs(VENDOR_DIR, exist_ok=True)

LIBS = [
    {
        'url': 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
        'file': 'vendor/react.production.min.js',
        'name': 'React 18'
    },
    {
        'url': 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
        'file': 'vendor/react-dom.production.min.js',
        'name': 'ReactDOM 18'
    },
    {
        'url': 'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
        'file': 'vendor/babel.min.js',
        'name': 'Babel Standalone'
    },
]

print('=' * 55)
print('  MediConnect — Vendor Library Downloader')
print('=' * 55)
print()

all_ok = True
for lib in LIBS:
    path = lib['file']
    name = lib['name']
    url = lib['url']

    if os.path.exists(path) and os.path.getsize(path) > 10000:
        size_kb = os.path.getsize(path) // 1024
        print(f'  [SKIP] {name} already cached ({size_kb} KB) -> {path}')
        continue

    print(f'  [DOWNLOAD] {name} from CDN...', end=' ', flush=True)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(path, 'wb') as f:
            f.write(data)
        size_kb = len(data) // 1024
        print(f'OK ({size_kb} KB)')
    except Exception as e:
        print(f'FAILED: {e}')
        all_ok = False

print()
if all_ok:
    print('  All libraries ready in vendor/!')
    print('  Now run: python patch_local.py')
else:
    print('  Some downloads failed. Check internet and try again.')
    sys.exit(1)
