# 🎤 10-Day Intensive Voice AI Developer Bootcamp

**Audience:** Junior developers training to become Voice AI developers.  
**Duration:** 10 days, 6–7 hours/day (2–3h study + 3–4h hands-on + 30m report).  
**Style:** Step-by-step with exact links, instructions, and deliverables.  
**Goal:** By Day 10, build both a **no-code receptionist agent** (Retell + n8n) and a **full-code agent** (LiveKit/Pipecat + STT/TTS).

---

## 📅 Day 1 — Voice AI Basics + Latency (TTFB/TTFS)

### 📖 Study

- [Intro to Voice AI Latency (Deepgram docs)](https://developers.deepgram.com/docs/measuring-streaming-latency)
- [Text-to-Speech Latency (Deepgram)](https://developers.deepgram.com/docs/text-to-speech-latency)
- [Latency Optimization (ElevenLabs)](https://elevenlabs.io/docs/best-practices/latency-optimization)
- [Deepgram 101: Streaming Speech Recognition (YouTube)](https://www.youtube.com/watch?v=U2A4UaqLW1Y)

### 🛠 Hands-On

1. Install **Python 3.11+** or **Node.js 18+**.
2. Write a script that:
   - Sends text → **ElevenLabs streaming TTS**.
   - Logs **time until first byte (TTFB)**.
   - Plays audio → measure **time until first audible syllable (TTFS)**.
3. Log results in CSV for **10 trials**.

### ✅ Deliverables

- `latency_harness.py` or `latency_harness.js`
- `latency_log.csv` (≥ 10 rows)
- 1-page write-up: _“What is TTFB/TTFS and why they matter.”_

---

## 📅 Day 2 — Retell AI (No-Code Agent)

### 📖 Study

- [Prompt Engineering Guide](https://docs.retellai.com/build/prompt-engineering-guide)
- [Conversation Flow: Custom Function](https://docs.retellai.com/build/conversation-flow/custom-function)
- [Retell ↔ n8n Workflow Example](https://n8n.io/workflows/3805-connect-retell-voice-agents-to-custom-functions/)
- [Getting Started with Retell (YouTube)](https://www.youtube.com/watch?v=3hTQlVnJmAw)

### 🛠 Hands-On

1. Sign up → [Retell](https://www.retellai.com/).
2. Create a new **agent** with:
   - Prompt: _“You are a helpful receptionist for Khatwani Motors.”_
   - Language: English.
3. Add **Custom Function** → point to **n8n Webhook**.
4. In [n8n](https://app.n8n.cloud/), build workflow:
   - Trigger: Webhook.
   - Action: Append data → Google Sheet.

### ✅ Deliverables

- Screenshot of Retell config
- Screenshot of n8n workflow
- Test call audio/video file (1–2 mins)

---

## 📅 Day 3 — Vapi (Inbound & Outbound Agents)

### 📖 Study

- [Assistants Quickstart](https://docs.vapi.ai/assistants/quickstart)
- [Phone Call Quickstart](https://docs.vapi.ai/quickstart/phone)
- [Prompting Guide](https://docs.vapi.ai/prompting-guide)
- [Build AI Voice Agents with Vapi (YouTube)](https://www.youtube.com/watch?v=yycS3RcbDBQ)

### 🛠 Hands-On

1. Create free [Vapi](https://vapi.ai/) account.
2. Build:
   - **Inbound assistant** → answers calls, asks caller name, logs to console.
   - **Outbound assistant** → dials number, says greeting.
3. Implement a **tool** (calendar lookup via webhook).

### ✅ Deliverables

- Vapi project screenshots
- `assistant_prompt.txt` (prompt text)
- Demo video of inbound + outbound calls

---

## 📅 Day 4 — ElevenLabs Conversational Realtime

### 📖 Study

- [Conversational AI WebSockets](https://elevenlabs.io/docs/conversational-ai/libraries/web-sockets)
- [Streaming API](https://elevenlabs.io/docs/api-reference/text-to-speech/stream)
- [Tutorial (YouTube)](https://www.youtube.com/watch?v=f0egQjwR8Bk)

### 🛠 Hands-On

1. Use Python or Node WebSocket client.
2. Connect to **ElevenLabs Realtime WS API**.
3. Stream mic input → get realtime audio output.
4. Experiment with chunk sizes: 50, 100, 200 chars.

### ✅ Deliverables

- Repo: `realtime_demo.py` or `.js`
- Comparison table: **chunk size vs TTFB/TTFS**

---

## 📅 Day 5 — Deepgram Streaming + Barge-In

### 📖 Study

- [Streaming STT API](https://developers.deepgram.com/reference/speech-to-text-api/listen-streaming)
- [Endpointing & Interim Results](https://developers.deepgram.com/docs/understand-endpointing-interim-results)
- [End of Speech Detection](https://developers.deepgram.com/docs/endpointing)
- [Realtime Voice Bot (YouTube)](https://www.youtube.com/watch?v=EgNerWaeZz0)

### 🛠 Hands-On

1. Build **Deepgram STT client** (WebSocket).
2. Play **TTS (ElevenLabs)** → try interrupting mid-response.
3. Tune `endpointing`: 250ms, 500ms, 1000ms → log responsiveness.

### ✅ Deliverables

- Repo: `deepgram_bargein.py`
- Latency log file (endpoint values)
- Checklist: “Best endpointing params for barge-in”

---

## 📅 Day 6 — LiveKit Agents Basics

### 📖 Study

- [Voice AI Quickstart](https://docs.livekit.io/agents/start/voice-ai/)
- [Agent Starter (Python repo)](https://github.com/livekit-examples/agent-starter-python)
- [Tutorial (YouTube)](https://www.youtube.com/watch?v=yXfN6k4pftM)

### 🛠 Hands-On

1. Clone `agent-starter-python`.
2. Run with OpenAI STT/TTS.
3. Swap in **Deepgram (STT)** + **Cartesia (TTS)**.
4. Collect logs for **per-turn timings**.

### ✅ Deliverables

- Running agent (screenshot/short recording)
- Report: “How latency changed after swapping providers”

---

## 📅 Day 7 — Pipecat + Cartesia

### 📖 Study

- [Pipecat Quickstart](https://docs.pipecat.ai/getting-started/quickstart)
- [Cartesia Realtime TTS](https://docs.cartesia.ai/api-reference/tts/tts)
- [Pipecat Examples (GitHub)](https://github.com/pipecat-ai/pipecat-examples)
- [Intro to Pipecat (YouTube)](https://www.youtube.com/watch?v=beONrYFv4gA)

### 🛠 Hands-On

1. Install Pipecat locally.
2. Build pipeline: **Deepgram STT → LLM (OpenAI/Claude) → Cartesia TTS**.
3. Implement **interruption handling**.

### ✅ Deliverables

- Repo with working code
- README: “How Cartesia was integrated”

---

## 📅 Day 8 — Ultravox (Low-Cost Alternative)

### 📖 Study

- [Ultravox Realtime Docs](https://docs.ultravox.ai/)
- [Quickstart (GitHub)](https://github.com/fixie-ai/ultravox-web-quickstart)
- [Ultravox + n8n Demo (YouTube)](https://www.youtube.com/watch?v=V5m7YtMhe3o)

### 🛠 Hands-On

1. Use **Ultravox STT** in a console app.
2. Compare **latency vs Deepgram**.
3. Compare **cost per minute**.

### ✅ Deliverables

- Code + logs
- Table: Ultravox vs Deepgram (latency, cost)

---

## 📅 Day 9 — Observability & Costing

### 📖 Study

- [Deepgram Latency Math](https://developers.deepgram.com/docs/measuring-streaming-latency)
- [ElevenLabs Latency Best Practices](https://elevenlabs.io/docs/best-practices/latency-optimization)
- [LiveKit Agent Starter w/ Metrics](https://github.com/livekit-examples/agent-starter-python)

### 🛠 Hands-On

1. Add logging wrapper:
   - STT latency
   - LLM response time
   - TTS latency
   - E2E latency
2. Log **cost/minute** using provider pricing.

### ✅ Deliverables

- CSV dashboard with metrics per turn
- 1-page doc: _“Target SLOs (goal ≤ 800ms E2E)”_

---

## 📅 Day 10 — Capstone (Receptionist Agent)

### 📖 Study

- [Integrating AI Agents with APIs (Retell blog)](https://www.retellai.com/blog/how-to-integrate-phone-ai-agents-with-your-existing-api-systems)
- [LiveKit Recipes](https://docs.livekit.io/recipes/)
- [Pipecat Telephony (Twilio ref)](https://docs.pipecat.ai/guides/telephony/twilio-websockets)

### 🛠 Hands-On

**Option A (No-Code)**

- Retell agent → _Receptionist for Khatwani Motors_.
- n8n webhook → write to Sheet → create Google Calendar event.

**Option B (Full-Code)**

- LiveKit/Pipecat agent: Deepgram STT + Cartesia TTS.
- Add **consent check** + **hangup command**.

### ✅ Deliverables

- Demo video (2–3 mins)
- Final write-up: _latency vs cost, lessons learned_

---

# 📝 Daily Report Template

**Day N: [Topic]**

- **What I studied (links)**
- **What I built (repo/screenshots)**
- **Metrics (latency, cost)**
- **Issues & fixes**
- **Next steps**

---

# 💰 Sandbox Costs (10 days, per developer)

- Retell: $10–30
- Vapi: $20–40
- ElevenLabs: $5–22 (Starter/Creator plan)
- Deepgram: $200 free credits (enough)
- LiveKit: free 1,000 min/month
- Ultravox: free 30 min, then $0.05/min
- Twilio number: $2–3 (optional)
