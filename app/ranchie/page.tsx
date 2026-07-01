"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBlock } from "@/components/ChatBlocks";
import { ChainRail } from "@/components/ChainRail";
import { Ranchie } from "@/components/Wing";
import type { MessageBlock } from "@/lib/domain/types";

interface Turn {
  role: "guest" | "ranchie";
  blocks: MessageBlock[];
}

const GREETING: Turn = {
  role: "ranchie",
  blocks: [
    {
      type: "text",
      text: "Hey Maya — Ranchie here. Already squared away that bottled-water credit earlier. What's up with your order?",
      fallback: "Hi Maya, it's Ranchie. What's going on with your order?",
    },
  ],
};

const STARTERS = [
  "My 10pc Lemon Pepper was missing from my order",
  "My wings showed up cold",
  "How many points do I have?",
  "Can I talk to a person?",
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function RanchiePage() {
  const [turns, setTurns] = useState<Turn[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionId = useRef<string>(uid());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || busy) return;
      setBusy(true);
      setTurns((t) => [...t, { role: "guest", blocks: [{ type: "text", text, fallback: text }] }]);
      // Open a fresh ranchie turn we'll stream into.
      let ranchieIdx = -1;
      setTurns((t) => {
        ranchieIdx = t.length;
        return [...t, { role: "ranchie", blocks: [] }];
      });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId.current, message: text }),
        });
        if (!res.body) throw new Error("no stream");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let textBlockOpen = false;

        const appendDelta = (delta: string) => {
          setTurns((t) => {
            const copy = [...t];
            const turn = { ...copy[ranchieIdx], blocks: [...copy[ranchieIdx].blocks] };
            const last = turn.blocks[turn.blocks.length - 1];
            if (textBlockOpen && last && last.type === "text") {
              turn.blocks[turn.blocks.length - 1] = { ...last, text: last.text + delta, fallback: last.text + delta };
            } else {
              turn.blocks.push({ type: "text", text: delta, fallback: delta });
              textBlockOpen = true;
            }
            copy[ranchieIdx] = turn;
            return copy;
          });
        };

        const pushBlocks = (blocks: MessageBlock[]) => {
          textBlockOpen = false; // a rich block ends the current prose run
          setTurns((t) => {
            const copy = [...t];
            const turn = { ...copy[ranchieIdx], blocks: [...copy[ranchieIdx].blocks, ...blocks] };
            copy[ranchieIdx] = turn;
            return copy;
          });
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line) continue;
            const evt = JSON.parse(line) as
              | { type: "text"; text: string }
              | { type: "blocks"; blocks: MessageBlock[] }
              | { type: "error"; message: string }
              | { type: "done" };
            if (evt.type === "text") appendDelta(evt.text);
            else if (evt.type === "blocks") pushBlocks(evt.blocks);
            else if (evt.type === "error")
              pushBlocks([{ type: "text", text: `Hmm — ${evt.message}`, fallback: evt.message }]);
          }
        }
      } catch (err) {
        setTurns((t) => {
          const copy = [...t];
          if (copy[ranchieIdx]) {
            copy[ranchieIdx] = {
              role: "ranchie",
              blocks: [
                {
                  type: "text",
                  text: "Sorry — I had trouble connecting. Try again in a moment.",
                  fallback: "Connection error.",
                },
              ],
            };
          }
          return copy;
        });
        console.error(err);
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  return (
    <main className="bg-bg-tint min-h-screen">
      <ChainRail active="chat" />
      <div className="mx-auto grid max-w-[1100px] gap-8 px-5 py-10 lg:grid-cols-[340px_1fr]">
        {/* Phone */}
        <div className="justify-self-center">
          <div className="w-[340px] overflow-hidden rounded-[38px] border-[9px] border-[#0E1A12] bg-white shadow-[var(--sh3)]">
            <div className="h-[30px] bg-hunter" />
            <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-3">
              <Ranchie size={32} />
              <div>
                <div className="font-display text-sm font-bold uppercase tracking-[0.02em] text-ink">Lil Ranchie</div>
                <div className="font-mono text-[10px] text-pos">● Ranch is in · here for your order</div>
              </div>
            </div>
            <div ref={scrollRef} className="flex h-[520px] flex-col gap-2.5 overflow-y-auto bg-[#FAFBFA] p-3.5">
              {turns.map((turn, ti) =>
                turn.role === "guest" ? (
                  <div key={ti} className="msg-user">
                    {turn.blocks.map((b) => (b.type === "text" ? b.text : b.fallback)).join(" ")}
                  </div>
                ) : (
                  turn.blocks.map((b, bi) => (
                    <ChatBlock key={`${ti}-${bi}`} block={b} onReply={send} disabled={busy} />
                  ))
                ),
              )}
              {busy && (
                <div className="msg-bot flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>
            <form
              className="flex items-center gap-2 border-t border-line bg-white p-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                const v = input;
                setInput("");
                send(v);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Lil Ranchie…"
                className="min-w-0 flex-1 rounded-full border border-line-strong bg-white px-3.5 py-2 text-sm text-ink placeholder:text-[#A6B0A4]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-full bg-crave px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-crave-hi disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {STARTERS.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => send(s)}
                className="rounded-full border border-line-strong bg-white px-3 py-1.5 text-[11px] text-ink-mid transition-colors hover:border-hunter hover:text-hunter disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Explainer */}
        <div className="max-w-xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-hunter">…which means Ranchie</div>
          <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] text-ink">
            Not a stranger
            <br />
            <span className="text-crave">at the hiccup.</span>
          </h1>
          <div className="mt-5 h-1.5 w-20 rounded bg-gold" />
          <p className="mt-5 max-w-md text-[15px] text-ink-mid">
            Because the relationship started at the order, support is a continuation, not a cold queue. Ranchie handles the
            conversation; it decides <strong className="text-ink">nothing</strong> about money — every fix runs through the same
            refund matrix your call center uses, so the amount is the same whether you talk to Ranchie or a person. Try a missing
            item or a quality issue and watch it land in the GX Command Center.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-mid">
            {[
              ["Identity assumed", "Maya is signed in — Lil Ranchie never asks for an order number."],
              ["Policy-enforced", "The dollar amounts come from the refund matrix, not the model's guess (the Air Canada lesson)."],
              ["Loyalty-aware", "Points are a first-class resolution, wired to the loyalty balance."],
              ["Closed loop", "Every resolution logs a ticket + sentiment that appears in the GX Command Center within seconds."],
              ["Human, one tap", "Ask for a person any time — the handoff carries the full transcript."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-xl border border-line border-l-[3px] border-l-crave bg-white p-3.5 shadow-[var(--sh1)]">
                <b className="text-ink">{t}.</b> <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
