"use client";


import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { socketEvents } from "@/lib/constant";
import { useRouter, useSearchParams } from "next/navigation";

const players = {
  one: "X",
  two: "O",
} as const;

type Score = Record<PlayerSymbol, number>;
type PlayerSymbol = (typeof players)[keyof typeof players];

export default function MultiPlayer() {
  const boxArray: string[] = new Array(9).fill("");
  const params = useSearchParams();
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<PlayerSymbol>(players.one);
  const [boxes, setBoxes] = useState<string[]>(boxArray);
  const [winner, setWinner] = useState<PlayerSymbol | "draw" | null>(null);

  const [score, setScore] = useState<Score>({
    X: 0,
    O: 0,
  });

  const [playersInfo, setPlayersInfo] = useState([]);
  const roomId = params.get("roomId");

  const winnerLabel =
    winner === players.one
      ? "Player-1"
      : winner === players.two
      ? "Player-2"
      : "draw";

  const handlePlayerClick = (index: number) => {
    if (winner) return;

    socket.emit(socketEvents.makeMove, {
      roomId,
      index,
    });
  };

  const handleReset = () => {
    socket.emit(socketEvents.resetGame, {
      roomId,
    });
  };
  const handleInvite = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Invite link copied!");
  };

  useEffect(() => {
    if (!roomId) return;

    // join room
    socket.emit(socketEvents.joinRoom, roomId);

    // listeners
    const handleJoined = (data: any) => {
      const room = data.room;
      handleGameInfo(room);
    };

    const handleRoomFull = () => {
      alert("Room is full. Please join another room.");
    };

    const handlePlayersInfo = (data: any) => {
      setPlayersInfo(data);
    };

    const handleGameInfo = ({ board, turn, winner, score }: any) => {
      setBoxes(board);
      setCurrentPlayer(turn);
      setScore(score);
      if (winner) {
        setWinner(winner);
      } else {
        setWinner(null);
      }
    };

    const handleGameReset = ({ board, turn, score }: any) => {
      console.log(score);
      setBoxes(board);
      setCurrentPlayer(turn);
      setWinner(null);
    };

    socket.on(socketEvents.joinedRoom, handleJoined);
    socket.on(socketEvents.roomFull, handleRoomFull);
    socket.on(socketEvents.playersInfo, handlePlayersInfo);
    socket.on(socketEvents.gameInfo, handleGameInfo);
    socket.on(socketEvents.resetGame, handleGameReset);

    // cleanup (IMPORTANT)
    return () => {
      socket.off(socketEvents.joinedRoom, handleJoined);
      socket.off(socketEvents.roomFull, handleRoomFull);
      socket.off(socketEvents.playersInfo, handlePlayersInfo);
      socket.off(socketEvents.gameInfo, handleGameInfo);
      socket.off(socketEvents.resetGame, handleGameReset);
    };
  }, [roomId]);

  return (
    <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center px-2 pb-6">
      {/* TOP BAR */}
      <div className="fixed left-0 right-0 gap-10 top-0 z-20 flex items-center justify-between bg-black/60 px-4 py-3 backdrop-blur md:static md:bg-transparent md:backdrop-blur-0">
        <button
          onClick={() => router.push("/")}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 transition"
        >
          ← Back
        </button>

        <button
          onClick={handleInvite}
          className="rounded-lg border border-emerald-500/40 bg-emerald-900/30 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-900/50 transition"
        >
          🔗 Invite
        </button>
      </div>

      {/* PLAYER + SCORE STRIP */}
      <div className="mt-6 flex w-full max-w-[640px] flex-col gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 sm:flex-row sm:justify-between">
        {/* Player 1 */}
        <div className="flex items-center gap-3">
          {/* Connection dot */}
          <span
            className={`h-2 w-2 rounded-full ${
              playersInfo[0] ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
            }`}
          />

          <span
            className={`text-sm ${
              currentPlayer === players.one
                ? "text-emerald-400"
                : "text-zinc-400"
            }`}
          >
            Player 1 <b className="text-xs">(YOU)</b>
          </span>

          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
            X
          </span>

          <span className="ml-auto text-lg font-bold text-white">
            {score.X}
          </span>
        </div>

        {/* Player 2 */}
        <div className="flex items-center gap-3">
          {/* Connection dot */}
          <span
            className={`h-2 w-2 rounded-full ${
              playersInfo[1] ? "bg-sky-400 animate-pulse" : "bg-zinc-500"
            }`}
          />

          <span
            className={`text-sm ${
              currentPlayer === players.two ? "text-sky-400" : "text-zinc-400"
            }`}
          >
            Player 2
          </span>

          <span className="rounded bg-sky-500/20 px-2 py-0.5 text-xs font-bold text-sky-400">
            O
          </span>

          <span className="ml-auto text-lg font-bold text-white">
            {score.O}
          </span>
        </div>
      </div>
      <div className="mt-1 text-xs text-zinc-500">
        {playersInfo.length < 2
          ? "Waiting for another player to join…"
          : "Both players connected"}
      </div>

      {/* TURN INDICATOR */}
      {!winner && (
        <div className="mt-4 text-sm text-zinc-400">
          Turn:&nbsp;
          <span
            className={`font-semibold ${
              currentPlayer === players.one
                ? "text-emerald-400"
                : "text-sky-400"
            }`}
          >
            Player {currentPlayer === players.one ? "1 (X)" : "2 (O)"}
          </span>
        </div>
      )}

      {/* BOARD (HERO) */}
      <div className="relative mt-8 flex items-center justify-center">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 blur-2xl" />

        <div
          className={`rounded-3xl border border-zinc-700 bg-zinc-900/80 p-4 shadow-2xl ${
            winner ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="main-box scale-[1.05] sm:scale-[1.1]">
            {boxes.map((value, i) => (
              <div
                key={i}
                className={`box ${
                  value === players.one ? "x" : value === players.two ? "o" : ""
                }`}
                onClick={() => handlePlayerClick(i)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WINNER OVERLAY */}
      {winner && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="animate-scaleIn w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-6 text-center shadow-2xl">
            <h2 className="mb-2 text-2xl font-bold">
              {winner === "draw" ? "Draw 🤝" : "Game Over 🎉"}
            </h2>

            {winner !== "draw" && (
              <p className="mb-3 text-lg">
                Winner:&nbsp;
                <span className="font-bold text-emerald-400">
                  {winnerLabel}
                </span>
              </p>
            )}

            <div className="mb-4 flex justify-center gap-6 text-sm text-zinc-300">
              <span>
                Player 1 (X): <b>{score.X}</b>
              </span>
              <span>
                Player 2 (O): <b>{score.O}</b>
              </span>
            </div>

            <button
              onClick={handleReset}
              className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-2 font-medium hover:scale-105 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
