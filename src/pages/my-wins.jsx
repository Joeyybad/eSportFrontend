import { useEffect, useState } from "react";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";

// Composant de la page mes gains
function MyWins() {
  // Gestion d'état
  const token = useAuthStore((state) => state.token);

  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchWins = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bets/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur API");

        // 1. On ne garde que les paris GAGNÉS ("won")
        const filteredWins = data.filter((b) => b.status === "won");

        setWins(filteredWins);
      } catch (err) {
        console.error("Erreur récupération gains :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWins();
  }, [token]);

  if (loading) return <p className="text-purple-600">Chargement...</p>;

  // 2. CALCUL DU TOTAL
  // ⚠️ Important : Dans ton JSON, c'est "payout", pas "gain".
  const totalWins = wins.reduce((sum, b) => sum + (Number(b.payout) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
      {/* --- HEADER : Résumé global --- */}
      <Card title="Mes Gains" subtitle="Bilan de vos paris" centerHeader={true}>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Total des gains :
          <span className="text-purple-600 font-bold ml-2">
            {totalWins.toFixed(2)} €
          </span>
        </p>

        <Button
          text="Retirer mes gains"
          color="#9333EA"
          onClick={() => alert("Fonction de retrait à venir 💸")}
          style={{ color: "white" }}
        />
      </Card>

      {/* --- LISTE : Historique des paris gagnés --- */}
      <Card title="Historique de mes gains" centerHeader={false}>
        <div className="flex flex-col gap-3">
          {wins.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun gain pour le moment.</p>
          )}

          {wins.map((win) => {
            // Sécurité : Si le match est supprimé, on saute
            if (!win.Match) return null;

            return (
              <div
                key={win.id}
                className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm"
              >
                <div className="text-left">
                  <p className="font-medium text-gray-800">
                    {/* Utilisation de l'opérateur ?. pour éviter les crashs */}
                    {win.Match.homeTeam?.teamName} vs{" "}
                    {win.Match.awayTeam?.teamName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(win.Match.date).toLocaleString("fr-FR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="font-semibold text-green-600">
                  {/* ⚠️ ICI AUSSI : On utilise win.payout */}+
                  {Number(win.payout).toFixed(2)} €
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default MyWins;
