# 🤖 Project Brief for AI Coding Assistant

## Your Role
You are an expert full-stack developer helping build a hackathon project called **DeepShield** — an AI-powered Deepfake & Fake Image Detector. You will be given tasks phase by phase. For every task:
- Write clean, production-quality code
- Add comments explaining what each section does
- Never leave placeholder logic — always write the actual working implementation
- If something requires an environment variable, always use `.env` and never hardcode secrets

---

## 🎯 What We Are Building
A tool that helps regular people verify whether an image is real or AI-generated/deepfake.

### Deliverable 1 — Web App
- User visits the website
- Uploads an image or pastes an image URL
- Gets back: **Verdict** (Real / Deepfake / AI-Generated) + **Confidence Score** + **Brief Explanation**

### Deliverable 2 — Chrome Extension
- User is browsing any website
- Right-clicks on any image
- Clicks "Scan with DeepShield"
- A popup appears showing the verdict + confidence score

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + CSS |
| Backend | Node.js + Express |
| Detection API | Sightengine API |
| Chrome Extension | Vanilla HTML + CSS + JS (Manifest V3) |
| Environment Variables | dotenv |

---

## 📁 Folder Structure
```
deepshield/
├── frontend/                  → React Vite app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadBox.jsx        → Drag & drop / file upload UI
│   │   │   ├── ResultCard.jsx       → Shows verdict + score
│   │   │   └── Loader.jsx           → Loading spinner
│   │   ├── App.jsx                  → Main app component
│   │   ├── App.css                  → Global styles
│   │   └── main.jsx                 → React entry point
│   ├── index.html
│   └── vite.config.js
│
├── backend/                   → Node.js Express server
│   ├── routes/
│   │   └── detect.js               → /api/detect route
│   ├── server.js                    → Express app entry point
│   ├── .env                         → API keys (never commit this)
│   ├── .env.example                 → Template for teammates
│   └── package.json
│
├── extension/                 → Chrome Extension (Manifest V3)
│   ├── manifest.json               → Extension config
│   ├── background.js               → Context menu registration
│   ├── content.js                  → Injected into web pages
│   └── popup/
│       ├── popup.html              → Extension popup UI
│       ├── popup.css               → Popup styles
│       └── popup.js                → Popup logic + API call
│
└── README.md                  → Setup instructions
```

---

## 🔌 API Details

### Sightengine API
- **Purpose**: Detects whether an image is a deepfake or AI-generated
- **Endpoint**: `https://api.sightengine.com/1.0/check.json`
- **Method**: GET (for URL-based images) / POST (for file uploads)
- **Required params**: `models=deepfake,genai`, `api_user`, `api_secret`
- **Response example**:
```json
{
  "status": "success",
  "type": {
    "deepfake": 0.97,
    "ai_generated": 0.85
  }
}
```
- **Score interpretation**:
  - `0.0 - 0.3` → Likely Real
  - `0.3 - 0.6` → Suspicious
  - `0.6 - 1.0` → Likely Fake / AI-Generated

### Environment Variables (backend/.env)
```
SIGHTENGINE_API_USER=your_api_user_here
SIGHTENGINE_API_SECRET=your_api_secret_here
PORT=5000
```

---

## 🔁 Data Flow

### Web App Flow
```
User uploads image / pastes URL
        ↓
React frontend sends POST to /api/detect
        ↓
Express backend calls Sightengine API
        ↓
Sightengine returns scores
        ↓
Backend formats response and sends to frontend
        ↓
Frontend displays Verdict + Confidence Score + Explanation
```

### Chrome Extension Flow
```
User right-clicks image on any website
        ↓
Context menu shows "Scan with DeepShield"
        ↓
background.js captures the image URL
        ↓
Sends image URL to backend /api/detect
        ↓
popup.html displays the result
```

---

## 🎨 UI/UX Guidelines
- **Color scheme**: Dark theme — Background `#0f0f0f`, Accent `#00f5a0` (green for real), `#ff4d4d` (red for fake)
- **Font**: Inter or system-ui
- **Verdict colors**:
  - ✅ Real → Green badge
  - ⚠️ Suspicious → Yellow badge
  - ❌ Fake/Deepfake → Red badge
- **Keep it minimal** — verdict + score + one line explanation is enough
- **Mobile responsive** — the web app should work on phone too

---

## ⚠️ Important Rules for Code Generation
1. **Never hardcode API keys** — always use `process.env`
2. **Always handle errors** — API failures, invalid files, network errors
3. **CORS must be enabled** on the backend so the frontend and extension can call it
4. **File uploads** should be handled with `multer` on the backend
5. **The Chrome extension** must use **Manifest V3** (not V2 — it's deprecated)
6. **Keep components small** — each React component does one thing only
7. **Add loading states** — never leave the user staring at a blank screen
8. **Pre-cache test cases** — include 2-3 hardcoded test image URLs for demo safety

---

## 📦 Key Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "multer": "^1.4.5",
  "axios": "^1.4.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^4.4.0",
  "axios": "^1.4.0"
}
```

---

## 🚀 How Tasks Will Be Given to You
You will receive tasks labeled as:

- **PHASE 1** → Backend setup
- **PHASE 2** → Frontend web app
- **PHASE 3** → Chrome extension
- **PHASE 4** → Polish + demo prep

Each phase will have sub-tasks. Complete them exactly as described. When done, summarize:
- What files you created
- What each file does
- What the developer needs to do next (e.g., "run npm install", "add your API key to .env")

---

## 🧪 Demo Script (Keep This in Mind While Building)
The live demo to judges will follow this exact flow:

1. Open the web app
2. Upload a known deepfake image → show red "FAKE" verdict
3. Upload a real photo → show green "REAL" verdict
4. Open Chrome, go to a news website with a suspicious image
5. Right-click the image → "Scan with DeepShield" → popup shows verdict

**Every part of this flow must work flawlessly and fast.**

---
*This brief was prepared by the project lead. Follow it precisely for all code generation tasks.*