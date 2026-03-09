
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "ai";
  content: string;
};

type HistoryItem = {
  id: number;
  prompt: string;
  result: string;
};

export default function Dashboard() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🔐 Auth
useEffect(() => {
  const user = localStorage.getItem("userEmail");

  if (!user) {
    router.push("/login");
  } else {
    setUserEmail(user);
    fetchHistory();
  }
}, []);

  // 🔽 Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📜 Fetch History
  const fetchHistory = async () => {
    const email = localStorage.getItem("userEmail");

    try {
      const res = await fetch(
        "http://localhost/ai_saas/backend/routes/get-history.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email: email || "" }),
        }
      );

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    }
  };

  // 🚀 Generate
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const email = localStorage.getItem("userEmail");

      const res = await fetch(
        "http://localhost/ai_saas/backend/routes/generate-text.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            prompt: userMessage,
            email: email || "",
          }),
        }
      );

      const data = await res.text();

      setMessages((prev) => [...prev, { role: "ai", content: data }]);

      fetchHistory();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  const loadConversation = (item: HistoryItem) => {
    setMessages([
      { role: "user", content: item.prompt },
      { role: "ai", content: item.result },
    ]);
  };

  // 🗑 Delete
  const deleteConversation = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "http://localhost/ai_saas/backend/routes/delete-history.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ id: id.toString() }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Delete failed");
      }

      setActiveMenu(null);
    } catch {
      alert("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white">

      {/* SIDEBAR */}
    <aside className="w-[300px] bg-[#0b1220]/80 backdrop-blur-xl border-r border-white/5 flex flex-col">

  {/* HEADER */}
  <div className="p-6 border-b border-white/5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
        KC
      </div>

      <div>
        <h1 className="font-semibold text-lg tracking-wide">
          KeshavCore AI
        </h1>
        <p className="text-xs text-gray-400">{userEmail}</p>
      </div>
    </div>

    <button
      onClick={() => setMessages([])}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-2 rounded-lg font-medium hover:scale-[1.02] transition"
    >
      + New Chat
    </button>
  </div>


  {/* HISTORY */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3">
    {history.length === 0 && (
      <p className="text-gray-500 text-sm">No conversations</p>
    )}

    {history.map((item) => (
      <div
        key={item.id}
        className="relative bg-white/5 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition rounded-xl px-4 py-3 group cursor-pointer border border-white/5 hover:border-indigo-500/40"
      >
        <div
          onClick={() => loadConversation(item)}
          className="text-sm truncate cursor-pointer pr-6"
        >
          {item.prompt.substring(0, 35)}
        </div>

        <button
          onClick={() =>
            setActiveMenu(activeMenu === item.id ? null : item.id)
          }
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
        >
          ⋯
        </button>

        {activeMenu === item.id && (
          <div className="absolute right-2 mt-2 w-40 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50">
            <button
              onClick={() => deleteConversation(item.id)}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>


  {/* LOGOUT AT BOTTOM */}
  <div className="p-4 border-t border-white/5">
    <button
      onClick={logout}
      className="w-full bg-purple-500 hover:bg-purple-600 py-2 rounded-lg text-sm transition"
    >
      Logout
    </button>
  </div>

</aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-6 py-4 rounded-2xl max-w-[650px] shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                    : "bg-white/5 backdrop-blur-xl border border-white/10"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-6 py-4 bg-white/5 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleGenerate();
          }}
          className="border-t border-white/5 p-6 flex gap-4 bg-[#0b1220]/70 backdrop-blur-xl"
        >
          <input
            type="text"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask KeshavCore AI anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 rounded-xl font-medium hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}

