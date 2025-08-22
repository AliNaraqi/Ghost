
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import datetime

app = FastAPI(title="Chatbot Backend", version="1.0.0")

# Allow local dev from file:// or http://localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    timestamp: str
    
    history: List[ChatMessage]

SYSTEM_PERSONA = (
    "You are 'Ghost', a friendly, upbeat web assistant who answers succinctly and helpfully. "
    "Keep replies under 120 words unless the user asks for more detail. "
    "Use simple language and avoid jargon when possible."
)

def simple_rule_based_reply(message: str, history: List[ChatMessage]) -> str:
    """
    A tiny, dependency-free demo bot. Replace this with any LLM provider later.
    """
    msg = message.strip().lower()
    if any(greet in msg for greet in ["hello", "hi", "hey", "salam", "bonjour"]):
        return "Hey! I’m Ghost 🤖✨ How can I help you today?"
    if "name" in msg:
        return "I’m Ghost, your friend. Nice to meet you!"
    if "help" in msg or "how" in msg:
        return "Tell me what you’re trying to do, and I’ll tell you what to do."
    if "joke" in msg:
        return "Why did the developer add body-parser? To handle their feelings… and JSON. 😅"
    if "time" in msg:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        return f"It’s {now} right now where the server runs."
    # tiny context peek
    if history:
        last_user = next((m.content for m in reversed(history) if m.role == "user"), "")
        if last_user and ("price" in msg or "cost" in msg):
            return "Pricing depends on your exact needs. What’s your budget and preferred features?"
    # default
    return "Got it! Can you share a bit more detail so I can give the best answer?"

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """
    Minimal chat endpoint. Swappable with a real LLM later.
    """
    # Append the latest user message into history for simple context
    history = (req.history or []) + [ChatMessage(role="user", content=req.message)]
    reply = simple_rule_based_reply(req.message, history)
    history.append(ChatMessage(role="assistant", content=reply))
    return ChatResponse(
        reply=reply,
        timestamp=datetime.datetime.utcnow().isoformat(),
        history=history,
    )

# Optional health route
@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "ok"}
