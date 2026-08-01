# 👑 The Chennai Silks — Luxury Fashion Dress & Heritage Silk Showroom

[![Guinness World Record](https://img.shields.io/badge/Guinness_World_Record-Most_Expensive_Silk_Saree-gold.svg)](https://www.guinnessworldrecords.com/)
[![Built With](https://img.shields.io/badge/Tech_Stack-HTML5_%7C_Tailwind_CSS_%7C_ES6+_Modules-blue.svg)](#technology-stack)
[![Status](https://img.shields.io/badge/Status-Live_Localhost-brightgreen.svg)](#quick-start)

> **Maison de L'Élégance / The Chennai Silks** — A high-converting, modern, visually stunning luxury fashion dress and silk saree showroom web application. Features a hybrid navigation flow combining a featured Hero Carousel Slider, categorized scroll feed, full-screen dynamic collection detail view with image hover-zoom, bespoke measurement selector, postal shipping calculator, and slide-over Cart/Wishlist drawers.

---

## 🌟 Live Demo Access

- **Localhost URL**: [http://localhost:3000](http://localhost:3000)
- **IP Loopback**: [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## 🏛️ Brand Heritage & Guinness World Record Highlights

This web application integrates the authentic history and achievements of **The Chennai Silks**:

- **🏆 Guinness World Record Saree ($100,021 / ₹41 Lakhs)**: Woven in 2007, certified as the *most expensive silk saree in history*. Incorporates 24-karat pure gold zari hand-loom reproductions of **11 masterpiece oil paintings by Indian artist Raja Ravi Varma** (centered around *'Galaxy of Musicians'*), requiring 4,760 hours of precision artisan labor.
- **📜 Founding & Origins**: Founded by **Thiru. A. Kulandaivel Mudaliar** (1962, near Avinashi). First retail showroom opened in Tirupur in 1991 as *"Kumaran Silks"*, renamed *"The Chennai Silks"* in 2001.
- **🌍 International Exporting**: Export partner for major global retail chains across the US and Europe including **Decathlon**, **Carrefour**, and **Hanes**.
- **⚡ Industrial Expansion**: Nov 2025 partnership with the Tamil Nadu Government establishing a state-of-the-art **₹50 crore garment manufacturing unit near Mannargudi**.

---

## ✨ Key Interactive Features

### 1. Interactive Hero Runway Carousel
- Prominently showcases high-impact dresses (*Raja Ravi Varma Guinness Saree*, *Royal Crimson Kanchipuram Saree*, *Peacock Blue Zari Couture Gown*, *Midnight Silk Runway Gown*).
- Auto-plays with smooth transitions and pause-on-hover.
- Includes manual previous/next arrows, slide dots, and direct 1-click **Add to Bag**, **Add to Favourite**, and **Explore Collection** triggers.

### 2. Categorized Scroll Feed & Real-Time Search
- Filter tabs: `All Dresses`, `Guinness Record Heritage`, `Bridal Silk`, `Evening Gowns`, `Cocktail`.
- Instant search bar filtering across title, category, and fabric material.

### 3. Dynamic Detailed Collection View (Modal)
- **Image Hover-Zoom Lens (`zoom-container`)**: Multi-angle thumbnail switcher with zoom capability on hover.
- **Matching Accessories & Sub-Collections**: Recommends matching temple jewelry, silk stoles, and clutches with 1-click bundle add.
- **Interactive Size Selector**: `S`, `M`, `L`, `XL`, and a **Custom Fit** option with bespoke measurement input (Bust, Waist, Hips).
- **Color Swatch Picker**: Live color swatch selector updating active color state.
- **Postal Code Shipping Estimator**: Calculates courier timeframe and delivery costs.
- **Care Accordions**: Expandable tabs for fabric specs and handloom care.

### 4. Slide-Over Drawers & State Management
- **Wishlist Drawer (`♡`)**: Real-time counter badge with 1-click **"Move to Bag"** button for saved favorites.
- **Cart Drawer (`🛒`)**: Subtotal calculation, quantity modifiers (`+` / `-`), complimentary shipping threshold calculator ($500 / ₹40,000), and checkout trigger.

---

## 📁 Project Directory Structure

```
c:/Users/ELCOT/OneDrive/Desktop/ecommers/
├── images/                  # High-resolution saree & gown image assets
│   ├── guinness.jpg         # Guinness World Record Raja Ravi Varma Saree
│   ├── kanchipuram_red.jpg  # Royal Kanchipuram Bridal Saree
│   ├── peacock_blue.jpg     # Peacock Blue Zari Silk Couture Gown
│   ├── hero1.jpg            # Midnight Silk Runway Gown
│   ├── hero2.jpg            # Emerald Empress Satin Gown
│   ├── hero3.jpg            # Ethereal Blush Crystal Dress
│   └── card1.jpg            # Burgundy Velvet Sirene Dress
├── public/images/           # Static public image mirror
├── src/
│   ├── data/
│   │   └── dressesData.js   # Dataset (Hero slides, brand records, catalog items)
│   ├── styles/
│   │   └── index.css        # Glassmorphism design system, gold tokens & animations
│   └── app.js               # Reactive Single Page Application engine & state store
├── index.html               # Main HTML5 entry point with SEO metadata
├── package.json             # NPM package configuration
└── README.md                # Project documentation
```

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, Vanilla JavaScript ES6+ Modules (Reactive Single Page Architecture).
- **Styling & Aesthetics**: Tailwind CSS CDN + Custom CSS Glassmorphism (`src/styles/index.css`) featuring obsidian dark palette, gold gradients, and micro-animations.
- **Typography**: Google Fonts (*Playfair Display* & *Plus Jakarta Sans*).
- **Local Server**: Python `http.server` on port `3000`.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.x installed on your machine (`py --version`).

### Run Locally

1. Open PowerShell / Command Prompt and navigate to the project directory:
   ```bash
   cd c:\Users\ELCOT\OneDrive\Desktop\ecommers
   ```

2. Start the local server on port 3000:
   ```bash
   py -m http.server 3000
   ```

3. Open your browser and visit:
   **[http://localhost:3000](http://localhost:3000)**

---

## 📜 License & Copyright

© 2026 **The Chennai Silks**. All Rights Reserved. Guinness World Record Certified.