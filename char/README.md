# 🧬 Generative Character Creator

A lightweight, browser-based character generator that dynamically assembles unique portraits using pre-rendered, modular image components. Built entirely with **vanilla JavaScript**, it requires **no server calls or external dependencies**.

## 🎯 Objective

Create an infinite variety of *weird little people* in real-time using modular, combinable parts—like heads, hair, eyes, mouths, and torsos—all styled in a **vintage 1950s comic book** aesthetic.

This project is designed to:
- 🧩 **Combine modular parts** into cohesive characters
- 🎲 **Randomly generate** distinct faces on each click
- 🎨 **Maintain consistent layering and art style**
- ⚡ **Render instantly** in the browser with zero network calls
- 🛠️ **Enable easy expansion** with new asset packs

## 🧱 Structure

Each character is made of the following layered assets:
- `torso/`
- `head/`
- `hair/`
- `eyes/`
- `mouth/`

All assets are stored in `/assets/` as transparent `.png` or `.webp` files. Each folder contains interchangeable parts of a specific type.

## 🖥️ Tech Stack

- **HTML5 + CSS3**
- **JavaScript (ES6+)**
- No frameworks
- No dependencies

## 🚀 How It Works

1. On page load or when "RNG" is clicked:
2. A random file is selected from each part directory
3. These assets are stacked on a `<canvas>` in a consistent render order
4. The final result is a fully composed character portrait

## 📁 Directory Layout

```
/index.html
/style.css
/script.js
/assets/
  ├─ torso/
  ├─ head/
  ├─ hair/
  ├─ eyes/
  └─ mouth/
```

## 🧪 Live Demo (Optional)

> Add your hosted link here (e.g. GitHub Pages or custom domain)

## 🛠️ Future Features

- Download/export button
- Character seed or save/share feature
- Thematic asset packs (cyberpunk, sci-fi, etc.)
- Toggle for "weirdness intensity" or symmetry

## 🧼 License

This project is open-source. Attribution appreciated but not required for personal or non-commercial use.

---

**Made with love and sarcasm.**  
*“Let there be weird little people.”*
