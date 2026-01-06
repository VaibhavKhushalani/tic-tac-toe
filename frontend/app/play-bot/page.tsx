"use client";

import { useState } from "react";

const player = {
  one: "X",
  two: "O",
};

export default function Home() {
  const boxArray: string[] = Array(9).fill("");
  const [currentPlayer, setCurrentPlayer] = useState(player.two);
  const [boxes, setBoxes] = useState<string[]>(boxArray);
  const [winner, setWinner] = useState<string | null>(null);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (board: string[]) => {
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // "X" or "O"
      }
    }
    return null;
  };

  const handlePlayerClick = (index: number) => {
    if (winner) return;
    setBoxes((prev) => {
      if (prev[index]) return prev;

      const next = [...prev];
      next[index] = currentPlayer === player.one ? player.two : player.one;

      const win = checkWinner(next);
      if (win) {
        setWinner(win);
        return next;
      }
      if (next.every((cell) => cell !== "")) {
        setWinner("draw");
        return next;
      }

      return next;
    });

    setCurrentPlayer((prev) => (prev === player.one ? player.two : player.one));
  };


  return (
    <div className="relative">
      {/* Turn Indicator */}
      {!winner && (
        <h1 className="mb-4 text-center text-lg font-medium text-[var(--muted-text)]">
          Player{" "}
          <span className="font-bold text-[var(--foreground)]">
            {currentPlayer === player.one ? player.two : player.one}
          </span>{" "}
          turn
        </h1>
      )}

      {/* Board */}
      <div
        className={`main-box ${winner ? "opacity-40 pointer-events-none" : ""}`}
      >
        {boxes.map((value, i) => (
          <div
            key={i}
            className={`box ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
            onClick={() => handlePlayerClick(i)}
          >
            {value}
          </div>
        ))}
      </div>

      {/* Winner Overlay */}
      {winner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-2xl px-8 py-6 text-center shadow-2xl animate-scaleIn"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-2">
              {winner === "draw" ? "Draw 🤝" : "Game Over 🎉"}
            </h2>

            <p className="text-lg mb-4">
              {winner === "draw" ? (
                "No one wins this time"
              ) : (
                <>
                  Winner:{" "}
                  <span
                    className={`font-bold ${
                      winner === "X"
                        ? "text-[var(--x-color)]"
                        : "text-[var(--o-color)]"
                    }`}
                  >
                    {winner}
                  </span>
                </>
              )}
            </p>

            <button
              onClick={() => {
                setBoxes(boxArray);
                setWinner(null);
                setCurrentPlayer(player.one);
              }}
              className="mt-2 rounded-xl px-6 py-2 font-medium transition-all hover:scale-105"
              style={{
                background: "var(--option-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
