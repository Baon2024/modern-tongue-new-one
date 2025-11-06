# Icons Placeholder

## Generate Icons

The `icon.svg` file is your source. You need to generate PNG files from it.

### Quick Method (Online):
1. Go to https://svgtopng.com/
2. Upload `icon.svg`
3. Download these sizes: 16, 32, 48, 96, 128
4. Save as: `icon16.png`, `icon32.png`, `icon48.png`, `icon96.png`, `icon128.png`

### Or use ImageMagick:
```bash
./scripts/generate-icons.sh
```

## Required Files:
- [ ] icon16.png (16x16)
- [ ] icon32.png (32x32)
- [ ] icon48.png (48x48)
- [ ] icon96.png (96x96)
- [ ] icon128.png (128x128)

After generating, commit them and reload the extension.
