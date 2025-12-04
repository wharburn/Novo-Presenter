# Slide Export Instructions

Since PowerPoint slides need to be converted to images, here are the methods:

## Method 1: Manual Export (Recommended)

### On macOS/Windows:
1. Open the PPTX file in PowerPoint
2. Go to **File** → **Export**
3. Select **File Format**: PNG or JPEG
4. Choose **Save Every Slide**
5. Select output folder
6. Rename files sequentially: slide-1.png, slide-2.png, etc.

### On Google Slides:
1. Upload PPTX to Google Drive
2. Open with Google Slides
3. Go to **File** → **Download** → **PNG image** or **JPEG image**
4. Google will download each slide as a separate image
5. Rename files sequentially

## Method 2: Using LibreOffice (Free)

```bash
# Install LibreOffice (if not installed)
# macOS: brew install libreoffice
# Linux: sudo apt-get install libreoffice

# Convert PPTX to PDF
libreoffice --headless --convert-to pdf "your-file.pptx"

# Then use imagemagick to convert PDF to images
# Install: brew install imagemagick (macOS)
convert -density 300 "your-file.pdf" "slide-%d.png"
```

## Method 3: Online Converters

Use online tools (no software installation needed):
- https://www.ilovepdf.com/powerpoint_to_image
- https://convertio.co/pptx-png/
- https://online-convert.com/

## After Conversion

Place the images in:
- English: `public/slides/en/`
- Portuguese: `public/slides/pt/`

Name them: `slide-1.png`, `slide-2.png`, `slide-3.png`, etc.

## Tips

- Export at high resolution (300 DPI or higher)
- Use PNG for better quality (JPEG for smaller files)
- Keep consistent naming: slide-1, slide-2, slide-3...
- Maintain aspect ratio (16:9 recommended)
