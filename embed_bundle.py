with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('src/appBundle.jsx', 'r', encoding='utf-8') as f:
    bundle_code = f.read()

target = '<script type="text/babel" src="src/appBundle.jsx"></script>'
replacement = f'<script type="text/babel">\n{bundle_code}\n</script>'

if target in html:
    new_html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('Embedded bundle directly into index.html successfully!')
else:
    print('Target script tag not found in index.html, may already be embedded or modified.')
