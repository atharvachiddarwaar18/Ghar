# 🖼️ Ghar Sajaoo — Images Folder

Place your images in this folder following the naming convention below.
The app reads images directly from `/images/` via Vite's public asset serving.

## Required Images

```
images/
├── background image.png    ← Hero section background (REQUIRED — exact filename with space)
├── logo.png                ← Brand logo (REQUIRED)
└── products/
    ├── illuminated-wall-frame.png
    ├── led-wall-art.png
    ├── canvas-painting.png
    ├── emerald-falls-canvas.png
    ├── ivory-marble-vase.png
    ├── stone-mosaic-vase.png
    ├── amber-swirl-vase.png
    ├── jute-table-runner.png
    ├── brass-diya-set.png
    ├── block-print-cushion.png
    ├── bamboo-wind-chime.png
    └── terracotta-planter.png
```

## Image Specifications

| Image            | Recommended Size    | Format |
|------------------|---------------------|--------|
| Background       | 1920×1080px min     | PNG/JPG |
| Logo             | 200×200px (square)  | PNG (transparent bg) |
| Product images   | 800×1000px          | PNG/JPG |

## Notes
- Product images use a 4:5 aspect ratio in cards (800×1000 works perfectly)
- Background image should be high-resolution for crisp display on 4K screens
- Logo should have a transparent background for the dark navbar overlay
- All images are served as static assets — no upload needed
