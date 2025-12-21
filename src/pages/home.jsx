import { useEffect, useState } from "react";
import Card from "../components/layout/Card";
import { Link } from "react-router-dom";
import StatusBadge from "../components/ui/StatusBadge";

//composant page d'accueil
function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/matches?limit=20",
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setMatches(data.matches || []);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  const safeMatches = Array.isArray(matches) ? matches : [];

  //Séparation des matchs selon le statut
  const liveMatches = safeMatches.filter((m) => m.status === "live");
  const scheduledMatches = safeMatches.filter((m) => m.status === "scheduled");

  return (
    <div className="min-h-screen bg-[url('/bg-pattern.png')] bg-fixed bg-cover">
      {" "}
      {/* Ajout possible d'une image de fond */}
      {/* Header Hero Section */}
      <div className="relative max-w-4xl mx-auto px-4 mt-12 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg mb-4 italic">
          WELCOME TO THE ARENA
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          La plateforme ultime pour suivre tes compétitions favorites.
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {/* --- MATCHS EN COURS (Effet Vert / Live) --- */}
        <div className="relative group">
          {/* Effet de flou arrière (Glow global) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <Card
            title="En Direct"
            glow="green" // On active le prop glow qu'on a créé dans Card
            className="relative h-full bg-slate-900"
          >
            {liveMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <span className="text-4xl mb-2">😴</span>
                <p>Aucun match en direct.</p>
              </div>
            ) : (
              liveMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="block bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-lg p-4 mb-3 transition-all hover:translate-x-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">
                      {match.homeTeam.teamName}
                    </span>
                    <span className="text-xs text-red-500 font-bold animate-pulse px-2 border border-red-500 rounded">
                      VS
                    </span>
                    <span className="font-bold text-lg text-white">
                      {match.awayTeam.teamName}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <StatusBadge status={match.status} />
                  </div>
                </Link>
              ))
            )}
          </Card>
        </div>

        {/* --- MATCHS PRÉVUS (Effet Bleu / Futur) --- */}
        <div className="relative group">
          {/* Effet de flou arrière Bleu */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <Card
            title="A venir"
            glow="blue"
            className="relative h-full bg-slate-900"
          >
            {scheduledMatches.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Aucun match prévu.
              </p>
            ) : (
              scheduledMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="flex justify-between items-center bg-slate-800/30 hover:bg-slate-800 border-b border-white/5 last:border-0 p-4 transition-colors group/item"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-200 group-hover/item:text-purple-400 transition-colors">
                      {match.homeTeam.teamName} vs {match.awayTeam.teamName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      })}
                      {" à "}
                      <span className="text-white font-mono">
                        {new Date(match.date).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </div>
                  <div className="opacity-50 group-hover/item:opacity-100 transition-opacity">
                    {/* Petite flèche ou icône */}
                    👉
                  </div>
                </Link>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
