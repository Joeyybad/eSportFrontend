import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/layout/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { Link } from "react-router-dom";

function Tournament() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournoi
        const tRes = await fetch(`http://localhost:5000/api/tournaments/${id}`);
        const tData = await tRes.json();
        console.log("Tournoi :", tData);

        if (!tRes.ok) {
          throw new Error(tData.message || "Erreur chargement tournoi");
        }

        setTournament(tData);

        // Fetch matchs
        const mRes = await fetch(
          `http://localhost:5000/api/tournaments/${id}/matches`
        );
        const mData = await mRes.json();
        console.log("Matchs du tournoi :", mData);

        if (!mRes.ok) {
          throw new Error(mData.message || "Erreur chargement matchs");
        }

        setMatches(mData);
      } catch (error) {
        console.error("Erreur API :", error);
      }
    };

    fetchData();
  }, [id]);

  if (!tournament) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* --- Infos tournoi --- */}
      <Card
        title={tournament.name}
        subtitle={
          tournament.description ||
          "Aucune description disponible pour ce tournoi."
        }
      >
        <div className="text-sm text-gray-600 mt-2">
          <p>
            <strong>Date :</strong>{" "}
            {new Date(tournament.startDate).toLocaleDateString()} —{" "}
            {new Date(tournament.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Jeu :</strong> {tournament.game}
          </p>
          <p>
            <strong>Status :</strong> <StatusBadge status={tournament.status} />
          </p>
        </div>
      </Card>

      {/* --- Liste des matchs --- */}
      <h2 className="text-lg font-bold">Matchs du tournoi</h2>

      <div className="flex flex-col gap-4">
        {matches.map((match) => (
          <Card
            key={match.id}
            title={`${match.homeTeam.teamName} vs ${match.awayTeam.teamName}`}
            subtitle={new Date(match.date).toLocaleString()}
            compact
          >
            <div className="flex items-center justify-between gap-4">
              {/* --- Team Home --- */}
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5000${match.homeTeam.logo}`}
                  alt=""
                  className="w-14 h-14 md:w-16 md:h-16 object-contain rounded"
                />
                <span className="font-semibold">{match.homeTeam.teamName}</span>
              </div>

              <span className="font-bold text-lg text-gray-700">VS</span>

              {/* --- Team Away --- */}
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5000${match.awayTeam.logo}`}
                  alt=""
                  className="w-14 h-14 md:w-16 md:h-16 object-contain rounded"
                />
                <span className="font-semibold">{match.awayTeam.teamName}</span>
              </div>
            </div>
          </Card>
        ))}

        <Link
          to="/tournaments"
          className="block mt-4 text-purple-600 hover:underline"
        >
          ← Retour aux tournois
        </Link>
      </div>
    </div>
  );
}

export default Tournament;
