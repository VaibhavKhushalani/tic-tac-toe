import { createServer } from "http";
import { Server } from "socket.io";
import { checkWinner } from "./game-rules.js";
import { players, socketEvents } from "./utils/constant.js";

const PORT = 8000;

// Create HTTP server
// HTTP server with GET routes
const httpServer = createServer((req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        rooms: Object.keys(rooms).length,
        timestamp: Date.now(),
      })
    );
    return;
  }

  // List active rooms (optional)
  if (req.method === "GET" && req.url === "/rooms") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        rooms: Object.keys(rooms),
      })
    );
    return;
  }

  // Default
  res.writeHead(404);
  res.end("Not Found");
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://tictactoe-play.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const rooms = {};

// Socket events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on(socketEvents.joinRoom, (roomId) => {
    // initialize room if not exists
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        board: new Array(9).fill(""),
        turn: players.one,
        winner: null,
        score: { [players.one]: 0, [players.two]: 0 },
      };
    }

    const room = rooms[roomId];
    socket.data.roomId = roomId; //  IMPORTANT

    // room full
    if (room.players.length >= 2) {
      socket.emit(socketEvents.roomFull, {
        roomId,
      });
      return;
    }

    //  add player
    if (!room.players.includes(socket.id)) {
      room.players.push(socket.id);
    }
    socket.join(roomId);

    socket.emit(socketEvents.joinedRoom, {
      roomId,
      socketId: socket.id,
      playerNumber: room.players.length,
      room,
    });

    io.to(roomId).emit(socketEvents.playersInfo, room.players);
  });

  socket.on(socketEvents.makeMove, ({ roomId, index }) => {
    const room = rooms[roomId];
    if (!room) return;

    // game already finished
    if (room.winner) return;

    // identify player symbol
    const playerIndex = room.players.indexOf(socket.id);
    if (playerIndex === -1) return;

    const symbol = playerIndex === 0 ? players.one : players.two;

    // not your turn
    if (room.turn !== symbol) return;

    // invalid move
    if (room.board[index]) return;

    // apply move
    room.board[index] = symbol;

    // check winner
    const winner = checkWinner(room.board);
    if (winner) {
      room.winner = winner;
    } else if (room.board.every(Boolean)) {
      room.winner = "draw";
    } else {
      room.turn = room.turn === players.one ? players.two : players.one;
    }

    if (room.winner && room.winner !== "draw") {
      room.score[room.winner] += 1;
    }

    // broadcast updated state
    io.to(roomId).emit(socketEvents.gameInfo, {
      board: room.board,
      turn: room.turn,
      winner: room.winner,
      score: room.score,
    });
  });

  socket.on(socketEvents.resetGame, ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.board = new Array(9).fill("");
    room.turn = players.one;
    room.winner = null;

    io.to(roomId).emit(socketEvents.gameInfo, {
      board: room.board,
      turn: room.turn,
      winner: room.winner,
      score: room.score,
    });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms[roomId]) return;

    const room = rooms[roomId];

    room.players = room.players.filter((id) => id !== socket.id);

    io.to(roomId).emit(socketEvents.playersInfo, room.players);

    if (room.players.length === 0) {
      delete rooms[roomId];
    }

    console.log(`🔴 ${socket.id} left room ${roomId}`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket server running on http://localhost:${PORT}`);
});
