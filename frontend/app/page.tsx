"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className="relative w-[360px] rounded-2xl p-8 shadow-2xl "
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--foreground)",
          color: "var(--foreground)",
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-2xl blur-xl -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--bot-accent) 0%, var(--human-accent) 100%)",
            opacity: 0.12,
          }}
        />

        {/* Title */}
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Tic Tac Toe
        </h1>
        <p
          className="text-center text-sm mt-2"
          style={{ color: "var(--muted-text)" }}
        >
          Choose how you want to play
        </p>

        {/* Options */}
        <div className="mt-8 space-y-4">
          {/* Bot */}
          <button
            onClick={() => router.push("/play-bot")}
            className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--option-bg)]
               transition-all duration-300 hover:scale-[1.03] hover:border-[var(--bot-accent)]"
          >
            <div>
              <h3 className="font-semibold text-lg">Play Offline</h3>
              <p className="text-xs text-[var(--muted-text)]">
                Practice against AI
              </p>
            </div>
            <span className="text-2xl text-[var(--bot-accent)] transition-transform duration-300 group-hover:translate-x-1">
              🤖
            </span>
          </button>

          {/* Human */}
          <button
            onClick={() =>
              router.push(`/play-multi?roomId=${crypto.randomUUID()}`)
            }
            className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--option-bg)]
               transition-all duration-300 hover:scale-[1.03] hover:border-[var(--human-accent)]"
          >
            <div>
              <h3 className="font-semibold text-lg">Play with Human</h3>
              <p className="text-xs text-[var(--muted-text)]">
                Real-time multiplayer
              </p>
            </div>
            <span className="text-2xl text-[var(--human-accent)] transition-transform duration-300 group-hover:translate-x-1">
              👥
            </span>
          </button>
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-center text-xs"
          style={{ color: "var(--soft-text)" }}
        >
          Built with Next.js & Socket.io
        </p>
      </div>
    </main>
  );
}
