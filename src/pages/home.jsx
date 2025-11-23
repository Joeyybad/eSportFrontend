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
        const response = await fetch("http://localhost:5000/api/matches", {
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) setMatches(data);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p className="text-purple-600">Chargement...</p>;

  //Séparation des matchs selon le statut
  const liveMatches = matches.filter((m) => m.status === "live");
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");

  return (
    <>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <Card
          title="Bienvenue sur E-sport Evolution"
          subtitle="Votre plateforme tout-en-un pour tout ce qui concerne l'e-sport."
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matchs en cours */}
        <Card title="Matchs en cours" className="border-green-300 border-1">
          {liveMatches.length === 0 ? (
            <p className="text-gray-500">Aucun match en cours.</p>
          ) : (
            liveMatches.map((match) => (
              <div key={match.id} className="my-3 text-center">
                <Link
                  to={`/match/${match.id}`}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  {match.homeTeam.teamName} vs {match.awayTeam.teamName} ({})
                </Link>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={match.status} />
                </div>
              </div>
            ))
          )}
        </Card>

        {/* Matchs prévus */}
        <Card title="Matchs prévus" className="border-blue-300 border-1">
          {scheduledMatches.length === 0 ? (
            <p className="text-gray-500">Aucun match prévu.</p>
          ) : (
            scheduledMatches.map((match) => (
              <div key={match.id} className="my-3 text-center">
                <Link
                  to={`/match/${match.id}`}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  {match.homeTeam.teamName} vs {match.awayTeam.teamName}
                </Link>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={match.status} />
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(match.date).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </>
  );
}

export default Home;
