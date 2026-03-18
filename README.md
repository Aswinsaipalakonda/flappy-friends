# 🐦 Flappy Friends

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

**Flappy Friends** is a premium, highly-polished Flappy Bird clone where you can play as your friends! Built with a focus on smooth interactions, beautiful glassmorphic UI, and authentic 60FPS gameplay..

---

## ✨ Key Features

- 👤 **Character Selection:** Choose your hero from a pool of custom friend avatars (Aryan, Mithelesh).
- 🎮 **Authentic Gameplay:** Classic Flappy Bird mechanics with high-fidelity 8-bit assets and sound effects.
- 🌈 **Premium UI:** Glassmorphic character cards, staggered animations, and smooth screen-to-screen transitions.
- 🧘 **Relaxed Physics:** Professionally tuned "Easy Mode" with wider pipe gaps and softer gravity for a fun, casual experience.
- 📱 **Fully Responsive:** Tailored experience for both Desktop (simulated phone view) and Mobile (touch-optimized).
- 🏆 **High Score Tracking:** Your best scores are stored locally so you can compete against yourself.
- 🎵 **Authentic SFX:** Includes original wing flaps, point scoring, and collision sound effects.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Rendering:** HTML5 Canvas (high performance 60FPS)
- **Styling:** Modern Vanilla CSS with Glassmorphism
- **Storage:** LocalStorage for high score persistence
- **Assets:** Authentic 8-bit Flappy Bird sprites and audio

---

## 📂 Project Structure

```text
src/
├── assets/
│   └── characters.js    # Friend metadata
├── components/
│   ├── CharacterSelect.jsx # Glassmorphic selection screen
│   └── GameCanvas.jsx      # High-performance game engine
├── game/
│   ├── physics.js       # Constants & gravity logic
│   ├── pipes.js         # Procedural pipe generation
│   └── collision.js     # Precise Hitbox detection
├── App.jsx              # State management & transitions
└── index.css            # Premium design system
```

---

## 🚀 Local Setup

Bring your friends to life on your local machine:

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Start Development Server:**

   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🌍 Deployment

This project is optimized for **Vercel**. Simply push your repository to GitHub and connect it to Vercel for instant deployment.

---

## 📝 License

This project is created for educational and entertainment purposes. Credits to the original Flappy Bird assets creators.
