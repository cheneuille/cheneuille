"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Trophy, Coins, Flame } from "lucide-react";

// Définition du type Player pour TypeScript
type Player = {
  uid: string;
  username: string;
  wagered?: number;
  highestMultiplier?: {
    multiplier: number;
  };
  randomAvatar?: string;
};

export default function CheneuilleUltimateCasino() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [topPlayer, setTopPlayer] = useState<Player | null>(null);
  const [jackpotFlash, setJackpotFlash] = useState<boolean>(false);
  const prizePool = 250;

  // Liste des avatars — placer les fichiers dans public/avatars/
  const avatarList = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/roobet-stats");
        const data = await res.json();

        if (Array.isArray(data)) {
          // Top 3 uniquement
          const topThree = data.slice(0, 3);

          // Attribution d’un avatar aléatoire à chaque joueur
          const topThreeWithAvatars = topThree.map(player => ({
            ...player,
            randomAvatar: avatarList[Math.floor(Math.random() * avatarList.length)],
          }));

          setPlayers(topThreeWithAvatars);

          // Flash jackpot si le top change
          if (topThreeWithAvatars[0]?.uid !== topPlayer?.uid) {
            setJackpotFlash(true);
            setTimeout(() => setJackpotFlash(false), 3000);
          }

          setTopPlayer(topThreeWithAvatars[0]);
        }
      } catch (err) {
        console.error("Erreur API", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // refresh toutes les 5 min
    return () => clearInterval(interval);
  }, [topPlayer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02140c] via-[#052e1b] to-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#16a34a33,transparent_40%),radial-gradient(circle_at_80%_80%,#22c55e22,transparent_40%)] animate-pulse" />

      {/* Floating Casino Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-6xl opacity-10">
        <div className="absolute left-10 top-20 animate-bounce">🂡</div>
        <div className="absolute right-20 top-40 animate-spin-slow">♠️</div>
        <div className="absolute bottom-20 left-1/3 animate-pulse">🎰</div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-16">
          <motion.h1
            whileHover={{ scale: 1.08 }}
            className="text-5xl font-extrabold text-green-400 drop-shadow-[0_0_20px_#22c55e]"
          >
           🃏 CHENEUILLE 🎰
          </motion.h1>

          <div className="flex gap-4">
            <a href="/api/auth/discord">
              <button className="bg-indigo-600 px-6 py-3 rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg">
                Lier Discord
              </button>
            </a>
          </div>
        </header>

        {/* PRIZE POOL */}
        <section className="text-center mb-20">
          <h2 className="text-3xl mb-4 text-green-300">Prize Pool Officiel</h2>
          <motion.div
            animate={{ scale: jackpotFlash ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-bold text-yellow-400 drop-shadow-[0_0_30px_gold]"
          >
            {prizePool}$
          </motion.div>
          <p className="mt-4 text-green-400">
            Classement automatique via API Roobet (Blackjack, Slots & House Games)
          </p>
          <p className="mt-2 italic text-green-500">
            "Même dans un marais… on peut toucher un 21 naturel." 🟢👑
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-green-400 animate-pulse">
            Chargement des statistiques...
          </div>
        )}

        {/* LEADERBOARD TOP 3 */}
        <div className="grid md:grid-cols-3 gap-10">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div
                key={player.uid}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 6 }}
                className="bg-black/60 backdrop-blur-xl border border-green-500 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/60 transition-all duration-500"
              >
                <div className="flex justify-center mb-4">
                  {index === 0 ? <Crown className="text-yellow-400" size={42} /> : <Trophy className="text-green-400" size={36} />}
                </div>

                {/* Avatar aléatoire */}
                <div className="flex justify-center mb-4">
                  <img
                    src={player.randomAvatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full border-2 border-green-400 shadow-lg"
                  />
                </div>

                {/* Pseudo masqué sauf première lettre */}
                <h3 className="text-2xl font-bold text-center text-green-300">
                  {player.username[0]}***
                </h3>

                {/* Wager visible */}
                <div className="flex items-center justify-center gap-2 mt-4 text-green-400">
                  <Coins size={18} />
                  {player.wagered?.toLocaleString()} $
                </div>

                {player.highestMultiplier && (
                  <div className="text-center mt-3 text-yellow-400 text-sm">
                    Max x{player.highestMultiplier.multiplier}
                  </div>
                )}

                {index === 0 && (
                  <div className="flex justify-center mt-4 text-red-400 animate-pulse">
                    <Flame size={20} /> TOP OGRE 🔥
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* STREAM SECTION */}
        <section className="mt-24">
          <h3 className="text-3xl text-center mb-8 text-green-400 drop-shadow-[0_0_15px_#22c55e]">
            Stream Live sur DLive
          </h3>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden border-4 border-green-600 shadow-2xl"
          >
            <iframe
              src="https://dlive.tv/embed/cheneuille"
              className="w-full h-[600px]"
              allowFullScreen
            />
          </motion.div>
        </section>

        <footer className="mt-24 text-center text-green-500">
          © {new Date().getFullYear()} Cheneuille — Ultimate Casino Leaderboard
        </footer>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}