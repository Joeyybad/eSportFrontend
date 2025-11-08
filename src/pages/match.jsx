import { useParams } from "react-router-dom";
import Card from "../components/layout/Card";

// Données simulées pour l'exemple
const mockMatches = [
  {
    id: "1",
    homeTeam: "Team Alpha",
    awayTeam: "Team Omega",
    date: "2025-10-22 18:00",
  },
  {
    id: "2",
    homeTeam: "Red Dragons",
    awayTeam: "Blue Phoenix",
    date: "2025-10-23 20:30",
  },
];

function Match() {
  // Récupère l'ID depuis l'URL : /bet/:id
  const { id } = useParams();

  // Cherche le match correspondant
  const match = mockMatches.find((m) => m.id === id);

  // Si aucun match trouvé (mauvais id)
  if (!match) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <Card title="Match introuvable" subtitle="Vérifie l'URL ou réessaie.">
          <p>Le match que tu cherches n'existe pas ou a été supprimé.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
      <Card
        key={match.id}
        title={`${match.homeTeam} vs ${match.awayTeam}`}
        subtitle={`Match prévu le ${match.date}`}
        centerHeader={false}
      >
        <p className="mb-3">Place ton pari sur ton équipe favorite :</p>

        <div className="flex gap-3 justify-center">
          <button className="px-3 py-1.5 bg-purple-600 text-black rounded hover:bg-purple-700 transition">
            {match.homeTeam}
          </button>

          <button className="px-3 py-1.5 bg-gray-200 text-purple-600 rounded hover:bg-gray-300 transition">
            Match nul
          </button>

          <button className="px-3 py-1.5 bg-purple-600 text-black rounded hover:bg-purple-700 transition">
            {match.awayTeam}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Match;
