# Ghost


## ✨ Features
- **Animated character**: CSS/SVG bot face that blinks, glows while thinking, and moves its mouth while speaking.
- **Conversational UI**: Messages, history, and a developer-friendly JSON schema.
- **Voice**:
  - **Text‑to‑speech** (Web Speech API) – Ghost can speak replies.
  - **Speech‑to‑text** (webkitSpeechRecognition) – dictate messages in Chrome.
- **Backend ready**: FastAPI with clean types; swap in your favorite LLM later.

---

## 🧩 Project Structure
```
chatbot-website/
├── backend/
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── main.js
    └── styles.css
```

---


## 🗣️ Voice Tips
- **Speech synthesis** works in most modern browsers.
- **Speech recognition** (dictation) uses `webkitSpeechRecognition` (Chrome). If unavailable, you’ll still have the text chat.

---

## 🧪 Try These Prompts
- “Hello!”
- “What’s your name?”
- “Tell me a bad developer joke.”
- “What time is it?”

---


