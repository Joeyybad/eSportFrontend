import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";

function Matchs() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/matches", {
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Erreur récupération des matchs :",
            data.message || data
          );
          setLoading(false);
          return;
        }

        setMatches(data || []);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!matches.length)
    return <p className="text-red-600">Aucun match disponible</p>;

  const sorted = [...matches].sort((a, b) => {
    const order = { live: 1, scheduled: 2, completed: 3, cancelled: 4 };
    return order[a.status] - order[b.status];
  });
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Matchs</h1>

      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6">
        {sorted.map((match) => (
          <Card
            key={match.id}
            title={
              <div className="flex items-center justify-center gap-3">
                {match.homeTeam?.logo && (
                  <img
                    src={`http://localhost:5000/uploads/${match.homeTeam.logo}`}
                    className="w-14 h-14 md:w-16 md:h-16 object-contain rounded"
                  />
                )}

                <span
                  className="font-semibold text-lg cursor-pointer hover:text-purple-600"
                  onClick={() => (window.location.href = `/match/${match.id}`)}
                >
                  {match.homeTeam.teamName} vs {match.awayTeam.teamName}
                </span>

                {match.awayTeam?.logo && (
                  <img
                    src={`http://localhost:5000/uploads/${match.awayTeam.logo}`}
                    className="w-14 h-14"
                  />
                )}
              </div>
            }
            subtitle={
              <div className="flex flex-col items-center gap-1">
                <StatusBadge status={match.status} />
                <span>
                  le
                  {new Date(match.date).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            }
          >
            <div className="flex gap-3 justify-center">
              <Link to={`/match/${match.id}`}>
                <Button text="Voir le match" color="white" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Matchs;
