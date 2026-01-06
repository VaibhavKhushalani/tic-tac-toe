```md
# ♟️ Multiplayer Tic Tac Toe (Next.js + Socket.IO)

An **open-source**, real-time multiplayer Tic Tac Toe game built with **Next.js**, **Socket.IO**, and a **server-authoritative game engine**.

The project supports **2 players per room**, **invite-based rooms**, **persistent score per room**, **real-time synchronization**, and a **clean, modern UI**.  
Designed for learning real-time systems, multiplayer architecture, and open-source collaboration.

---

## 🚀 Current Features

### 🎮 Gameplay
- Real-time multiplayer Tic Tac Toe
- Exactly **2 players per room**
- Turn-based gameplay enforced on the server
- Server-side winner & draw detection
- Server-driven game reset (no client desync)

### 🏆 Score System
- Persistent score per room
- Score survives multiple rounds
- Score resets only when room is destroyed

### 🔗 Rooms & Invites
- Dynamic rooms via `roomId` (URL-based)
- Invite link copy feature
- Room auto-destroys when all players leave

### 🔒 Server Authority
- Server controls:
  - board state
  - current turn
  - winner logic
  - score updates
- Client only sends **intent** (move index, reset request)
- Invalid moves & wrong-turn moves are ignored

### ⚡ Real-time Sync
- Live board updates
- Live turn updates
- Live player connection status
- Low-latency Socket.IO communication

### 🎨 UI / UX
- Modern responsive UI
- Player connection indicators
- Turn indicator with player highlight
- Winner overlay with score summary
- Smooth animations & transitions

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Socket.IO
- HTTP Server
- In-memory game state (no database)

---

## 📁 Project Structure

```

.
├── frontend/        # Next.js application (React, Tailwind, Socket.IO Client)
├── backend/         # Node.js server (Socket.IO, Game Logic)
└── README.md        # Project documentation
````

---

## ⚙️ Environment Variables

### 🖥️ Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_BASE_URL="http://localhost:8001"
````

Used by the frontend to connect to the Socket.IO backend.

---

### 🧠 Backend (`backend/.env`)

```env
FRONTEND_URL="http://localhost:3000"
```

Used for CORS configuration to allow frontend connections.

---

## ▶️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/multiplayer-tic-tac-toe.git
cd multiplayer-tic-tac-toe
```

---

### 2️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:8001
```

---

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧠 How It Works

* Backend manages **rooms**
* Each room contains:

  * players (max 2)
  * board state
  * current turn
  * winner
  * score
* Frontend sends only **intent**

  * move index
  * reset request
* Backend validates everything and broadcasts the authoritative state
* UI always reflects server state (single source of truth)

---

## 🛡️ Game Rules Enforcement

* Only connected players can make moves
* Only the current-turn player can play
* Invalid moves are ignored
* Winner & draw logic handled entirely on server
* Score increments only on valid wins

---

## 🔮 Future Scope

Planned and possible enhancements:

* 👀 **Spectator mode** (watch games without playing)
* 🔁 **Reconnect-safe identity** (resume game after refresh)
* 🤖 **Play vs Bot / AI**
* 🏟️ **Room lobby & matchmaking**
* 🔐 **User authentication**
* 📊 **Leaderboards**
* 📜 **Match history & replay**
* 💬 **In-game chat (players & spectators)**
* 🌐 **Redis-based state for horizontal scaling**
* ⏱️ **Reconnect timeout handling**
* 📱 **Mobile-first UI improvements**
* 🎥 **Replay / highlight mode**

---

## 🤝 Contributing

This is an **open-source project** and contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Open a Pull Request

---

## 📄 License

MIT License
Free to use, modify, and distribute.

---

## ⭐ Support

If you find this project useful or learned something from it, consider giving it a ⭐️ on GitHub.

