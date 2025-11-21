import Card from "../components/layout/Card";
import { X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function MyBets() {
  const { user } = useAuth();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchBets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bets/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        console.log("Bets récupérés :", data);
        if (!res.ok) throw new Error(data.message || "Erreur API");

        setBets(data);
      } catch (error) {
        console.error("Erreur récupération des paris :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [user]);

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!bets.length)
    return <p className="text-red-600 text-center">Aucun pari enregistré.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="sr-only">Mes paris</h1>

      {bets.map((bet) => (
        <Card
          key={bet.id}
          title={`${bet.Match.homeTeam.teamName} vs ${bet.Match.awayTeam.teamName}`}
          subtitle={`Date : ${new Date(bet.Match.date).toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })} | Cote : ${bet.odds}`}
          centerHeader={false}
        >
          <div className="flex items-center justify-between mt-2">
            <p>
              <span className="font-semibold">Mon choix :</span>{" "}
              {bet.prediction === "home"
                ? bet.Match.homeTeam.teamName
                : bet.prediction === "away"
                ? bet.Match.awayTeam.teamName
                : "Match nul"}
            </p>

            {/* Résultat du pari si le match est terminé */}
            {bet.status === "won" ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : bet.status === "lost" ? (
              <X className="w-6 h-6 text-red-500" />
            ) : (
              <p className="text-gray-500 text-sm">En attente…</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default MyBets;
