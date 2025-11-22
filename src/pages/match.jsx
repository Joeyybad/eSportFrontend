import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import { useAuthStore } from "../stores/useAuthStore";

function Match() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/matches/${id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erreur serveur");
        setMatch(data);
      } catch (error) {
        console.error("Erreur récupération du match :", error);
        setMessage("Impossible de charger ce match.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  const handleBet = async () => {
    if (!token) {
      setMessage("Vous devez être connecté pour parier.");
      return;
    }
    // On vérifie l'existence de amount avant de continuer
    if (!selectedPrediction || !amount) {
      setMessage("Choisis une équipe et indique un montant !");
      return;
    }

    try {
      const formattedAmount = parseFloat(amount.toString().replace(",", "."));

      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        setMessage("Veuillez entrer un montant valide.");
        return;
      }

      const payload = {
        matchId: match.id,
        amount: formattedAmount, // On envoie la version corrigée (ex: 1.2)
        prediction: selectedPrediction,
      };

      console.log("Payload envoyé :", payload);

      const response = await fetch("http://localhost:5000/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      setMessage("Pari enregistré avec succès !");
      setAmount("");
      setSelectedPrediction(null);
    } catch (error) {
      console.error("Erreur lors du pari :", error);
      setMessage("Erreur lors de l’enregistrement du pari.");
    }
  };
  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!match) return <p className="text-red-600">Aucun match trouvé.</p>;

  const isCompleted = match?.status === "completed";
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
      <Card
        key={match.id}
        title={`${match.homeTeam?.teamName || "Équipe A"} vs ${
          match.awayTeam?.teamName || "Équipe B"
        }`}
        subtitle={
          <div className="flex flex-col items-center">
            <StatusBadge status={match.status} />
            le{" "}
            {new Date(match.date).toLocaleString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        }
        centerHeader={false}
      >
        {match.phase ? `  Phase : ${match.phase}` : ""}{" "}
        {match.Tournament?.name ? ` | Tournoi : ${match.Tournament.name}` : ""}
        {/* Logos */}
        <div className="flex items-center justify-center gap-10 mb-4">
          {match.homeTeam?.logo && (
            <div className="w-20 h-20 md:w-16 md:h-16 flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/${match.homeTeam.logo}`}
                alt={`${match.homeTeam.teamName} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          <span className="text-2xl font-semibold">VS</span>

          {match.awayTeam?.logo && (
            <div className="w-20 h-20 md:w-16 md:h-16 flex items-center justify-center">
              {" "}
              <img
                src={`http://localhost:5000/uploads/${match.awayTeam.logo}`}
                alt={`${match.awayTeam.teamName} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
        {isCompleted ? ( // si le match est terminé
          <p className="text-red-600 font-semibold text-md mt-4">
            Les paris sont fermés : le match est terminé.
          </p>
        ) : isLoggedIn ? (
          <>
            <p className="mb-3">Place ton pari sur ton équipe favorite :</p>

            {/* Boutons de prédiction */}

            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={() => setSelectedPrediction("home")}
                className={`px-3 py-1.5 rounded transition ${
                  selectedPrediction === "home"
                    ? "bg-purple-700 text-black"
                    : "bg-purple-600 text-black hover:bg-purple-700"
                }`}
              >
                {match.homeTeam?.teamName} ({match.oddsHome})
              </button>

              <button
                onClick={() => setSelectedPrediction("draw")}
                className={`px-3 py-1.5 rounded transition ${
                  selectedPrediction === "draw"
                    ? "bg-gray-400 text-purple-700"
                    : "bg-gray-200 text-purple-600 hover:bg-gray-300"
                }`}
              >
                Match nul ({match.oddsDraw})
              </button>

              <button
                onClick={() => setSelectedPrediction("away")}
                className={`px-3 py-1.5 rounded transition ${
                  selectedPrediction === "away"
                    ? "bg-purple-700 text-black"
                    : "bg-purple-600 text-black hover:bg-purple-700"
                }`}
              >
                {match.awayTeam?.teamName} ({match.oddsAway})
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Montant à miser (€)"
                className="border border-gray-300 rounded p-2 w-40 text-center"
              />
              <Button
                text="Valider le pari"
                color="#9333EA"
                onClick={handleBet}
                style={{ color: "white" }}
              />
            </div>

            {message && (
              <p className="text-sm mt-2 text-purple-600">{message}</p>
            )}
          </>
        ) : (
          // Si le match n'est pas terminé mais que l'utilisateur n'est pas connecté
          <p className="text-purple-600 font-semibold text-md mt-4">
            Connecte-toi pour placer un pari sur ce match !
          </p>
        )}
        <Link
          to="/matchs"
          className="block mt-4 text-purple-600 hover:underline"
        >
          ← Retour aux matchs
        </Link>
      </Card>
    </div>
  );
}

export default Match;
