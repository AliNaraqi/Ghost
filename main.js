// main.js
// Minimal front-end chat client with an animated character and voice in/out.

const API_BASE = "http://localhost:8000";
const botface = document.getElementById("botface");
const messagesEl = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");
const voiceToggle = document.getElementById("voiceToggle");

let history = []; // {role, content}
let speakEnabled = true;

function addMessage(role, content){
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "msg--user" : "msg--bot");
  div.textContent = content;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setThinking(on){
  if(on){
    botface.classList.add("thinking");
  } else {
    botface.classList.remove("thinking");
  }
}
function setSpeaking(on){
  if(on){
    botface.classList.add("speaking");
  } else {
    botface.classList.remove("speaking");
  }
}

async function sendMessage(text){
  if(!text.trim()) return;
  addMessage("user", text);
  history.push({role:"user", content:text});
  userInput.value = "";
  setThinking(true);

  try{
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history })
    });
    if(!res.ok) throw new Error("Network error");
    const data = await res.json();
    const reply = data.reply;
    history = data.history || history;
    setThinking(false);
    addMessage("assistant", reply);
    if(speakEnabled) speak(reply);
  }catch(err){
    setThinking(false);
    addMessage("assistant", "Oops, I had trouble reaching the server. Is it running?");
    console.error(err);
  }
}

chatForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  sendMessage(userInput.value);
});

// Voice output
function speak(text){
  if(!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  setSpeaking(true);
  utter.onend = () => setSpeaking(false);
  speechSynthesis.speak(utter);
}
voiceToggle.addEventListener("click", ()=>{
  speakEnabled = !speakEnabled;
  voiceToggle.textContent = speakEnabled ? "🔊 Voice" : "🔇 Voice";
});

// Speech-to-text (dictation)
let recognition = null;
if("webkitSpeechRecognition" in window){
  const Rec = window.webkitSpeechRecognition;
  recognition = new Rec();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e)=>{
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage(transcript);
  };
  recognition.onstart = ()=> { micBtn.textContent = "🛑 Stop"; setThinking(true); };
  recognition.onerror = ()=> { micBtn.textContent = "🎙️ Speak"; setThinking(false); };
  recognition.onend = ()=> { micBtn.textContent = "🎙️ Speak"; setThinking(false); };
}

micBtn.addEventListener("click", ()=>{
  if(!recognition){
    alert("Speech recognition not supported in this browser. Try Chrome.");
    return;
  }
  // Toggle
  if(micBtn.textContent.includes("Stop")){
    recognition.stop();
  } else {
    recognition.start();
  }
});

// Greet
addMessage("assistant", "Hi! I’m Ghost 🤖.");
