import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tournaments");
        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Erreur récupération des tournois :",
            data.message || data
          );
          setLoading(false);
          return;
        }

        setTournaments(data || []);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!tournaments.length)
    return <p className="text-red-600">Aucun tournoi disponible</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-4">
          Tournois
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Tous les tournois disponibles
        </p>
      </div>

      {tournaments.map((t) => (
        <Card
          key={t.id}
          title={t.name}
          subtitle={`${new Date(t.startDate).toLocaleDateString()} — ${new Date(
            t.endDate
          ).toLocaleDateString()}`}
          headerRight={
            <Link to={`/tournaments/${t.id}/matches`}>
              <Button
                text="Voir les matchs"
                color="#9333EA"
                textColor="#fff"
                className="px-4 py-2"
              />
            </Link>
          }
        >
          <p>
            <strong>Status :</strong> <StatusBadge status={t.status} />
          </p>
          <p className="text-gray-700">{t.description}</p>
        </Card>
      ))}
    </div>
  );
}

export default Tournaments;
