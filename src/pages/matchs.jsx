import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";

// Composant de la page Matchs
function Matchs() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/matches?page=${page}&limit=6`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Erreur récupération des matchs :",
            data.message || data
          );
          setLoading(false);
          return;
        }

        setMatches(data.matches || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page]);

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!matches.length)
    return <p className="text-red-600">Aucun match disponible</p>;

  const sorted = [...matches].sort((a, b) => {
    const order = { live: 1, scheduled: 2, completed: 3, cancelled: 4 };
    return order[a.status] - order[b.status];
  });
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-4">
          Matchs
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Tous les matchs disponibles
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6">
        {Array.isArray(matches) &&
          sorted.map((match) => (
            <Card
              key={match.id}
              // On ajoute l'effet glow bleu ou vert selon le statut, optionnel mais cool
              glow={match.status === "live" ? "green" : "purple"}
              className="hover:scale-[1.02] transition-transform duration-300" // Petit effet zoom au survol
              title={
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  {/* LOGO HOME : Encadré dans un fond clair pour la visibilité */}
                  {match.homeTeam?.logo && (
                    <div className="bg-gray-200/20 p-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm">
                      <img
                        src={`http://localhost:5000/uploads/${match.homeTeam.logo}`}
                        alt={match.homeTeam.teamName}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                      />
                    </div>
                  )}

                  {/* NOMS DES ÉQUIPES */}
                  <div
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    <span className="font-black text-xl md:text-2xl text-white group-hover:text-purple-400 transition-colors uppercase tracking-wider text-center leading-none">
                      {match.homeTeam.teamName}
                    </span>
                    <span className="text-xs font-bold text-red-500 my-1">
                      VS
                    </span>
                    <span className="font-black text-xl md:text-2xl text-white group-hover:text-purple-400 transition-colors uppercase tracking-wider text-center leading-none">
                      {match.awayTeam.teamName}
                    </span>
                  </div>

                  {/* LOGO AWAY : Encadré aussi */}
                  {match.awayTeam?.logo && (
                    <div className="bg-gray-200/20 p-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm">
                      <img
                        src={`http://localhost:5000/uploads/${match.awayTeam.logo}`}
                        alt={match.awayTeam.teamName}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                      />
                    </div>
                  )}
                </div>
              }
              subtitle={
                <div className="flex flex-col items-center gap-2 mt-4 border-t border-white/10 pt-3">
                  <StatusBadge status={match.status} />
                  <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                    📅
                    {new Date(match.date).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              }
            >
              {/* LE BOUTON : Style "Néon" Violet */}
              <div className="flex gap-3 justify-center mt-4">
                <Link to={`/match/${match.id}`} className="w-full sm:w-auto">
                  <Button
                    text="VOIR LE MATCH"
                    // On enlève color="white" et on utilise className pour le style Dark E-sport
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transform transition-all hover:-translate-y-0.5 border border-purple-400/30"
                  />
                </Link>
              </div>
            </Card>
          ))}
      </div>
      {/*PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 border-t pt-4">
          <Button
            text="Précédent"
            color={page === 1 ? "#E5E7EB" : "#FFFFFF"}
            textColor={page === 1 ? "#9CA3AF" : "#374151"}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`border ${
              page === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          />

          <span className="text-sm text-gray-600 font-medium">
            Page {page} sur {totalPages}
          </span>

          <Button
            text="Suivant"
            color={page === totalPages ? "#E5E7EB" : "#FFFFFF"}
            textColor={page === totalPages ? "#9CA3AF" : "#374151"}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`border ${
              page === totalPages ? "cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          />
        </div>
      )}
    </>
  );
}

export default Matchs;
