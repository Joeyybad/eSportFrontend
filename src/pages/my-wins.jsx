import { useEffect, useState } from "react";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function MyWins() {
  const { user } = useAuth();
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les bets du user
  useEffect(() => {
    if (!user?.token) return;

    const fetchWins = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bets/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur API");

        // Garder uniquement les paris gagnés
        const filteredWins = data.filter((b) => b.status === "won");

        setWins(filteredWins);
        setLoading(false);
      } catch (err) {
        console.error("Erreur récupération gains :", err);
        setLoading(false);
      }
    };

    fetchWins();
  }, [user]);

  if (loading) return <p className="text-purple-600">Chargement...</p>;

  const totalWins = wins.reduce((sum, b) => sum + b.gain, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
      {/* --- Résumé global --- */}
      <Card title="Mes Gains" subtitle="Bilan de vos paris" centerHeader={true}>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Total des gains :
          <span className="text-purple-600"> {totalWins.toFixed(2)} €</span>
        </p>

        <Button
          text="Retirer mes gains"
          color="#9333EA"
          onClick={() => alert("Fonction de retrait à venir 💸")}
        />
      </Card>

      {/* --- Historique des paris gagnés --- */}
      <Card title="Historique de mes gains" centerHeader={false}>
        <div className="flex flex-col gap-3">
          {wins.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun gain pour le moment.</p>
          )}

          {wins.map((win) => (
            <div
              key={win.id}
              className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm"
            >
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  {win.Match.homeTeam.teamName} vs {win.Match.awayTeam.teamName}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(win.Match.date).toLocaleString()}
                </p>
              </div>

              <div className="font-semibold text-green-600">
                +{win.gain.toFixed(2)} €
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default MyWins;
