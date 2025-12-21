import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import { useAuthStore } from "../stores/useAuthStore";

// Composant de la page match
function Match() {
  // Gestion d'état
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [message, setMessage] = useState("");
  const [hasBet, setHasBet] = useState(false);

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

  useEffect(() => {
    if (isLoggedIn && match) {
      const checkUserBet = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const user = await response.json();
          console.log("PROFIL REÇU DU BACKEND :", user);

          if (user.Bets && Array.isArray(user.Bets)) {
            const alreadyBet = user.Bets.some((b) => b.matchId === match.id);
            if (alreadyBet) {
              setHasBet(true);
            }
          }
        } catch (err) {
          console.error("Erreur check pari:", err);
        }
      };
      checkUserBet();
    }
  }, [isLoggedIn, match, token]);

  const handleBet = async () => {
    if (!token) {
      setMessage("Vous devez être connecté pour parier.");
      return;
    }
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
        amount: formattedAmount,
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
      setHasBet(true); // Mise à jour immédiate pour afficher le message de succès
    } catch (error) {
      console.error("Erreur lors du pari :", error);
      setMessage("Erreur lors de l’enregistrement du pari.");
    }
  };

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!match) return <p className="text-red-600">Aucun match trouvé.</p>;

  // ✅ NOUVELLE LOGIQUE DE FERMETURE
  const isBettingClosed = match.status !== "scheduled";

  const getClosedMessage = () => {
    if (match.status === "live")
      return "Le match est en cours, les paris sont fermés !";
    if (match.status === "completed") return "Le match est terminé.";
    if (match.status === "cancelled") return "Le match a été annulé.";
    return "Les paris sont fermés.";
  };

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
        {/* Info supplémentaire (Tournoi / Phase) */}
        {match.phase ? `Phase : ${match.phase}` : ""}{" "}
        {match.Tournament?.name ? ` | Tournoi : ${match.Tournament.name}` : ""}
        {/* Logos des équipes */}
        <div className="flex items-center justify-center gap-10 mb-4 mt-4">
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
              <img
                src={`http://localhost:5000/uploads/${match.awayTeam.logo}`}
                alt={`${match.awayTeam.teamName} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
        {/* LOGIQUE D'AFFICHAGE DU FORMULAIRE */}
        {isBettingClosed ? (
          // CAS 1 : Paris fermés (Live, Terminé, Annulé)
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold block mb-1">Trop tard !</strong>
            <span>{getClosedMessage()}</span>
          </div>
        ) : isLoggedIn ? (
          // CAS 2 : Utilisateur connecté et Match Ouvert
          <>
            {hasBet ? (
              // CAS 2A : A déjà parié
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                <strong className="font-bold">Déjà joué !</strong>
                <span className="block sm:inline">
                  Tu as déjà parié sur ce match. Bonne chance !
                </span>
              </div>
            ) : (
              // CAS 2B : Formulaire de pari
              <>
                <p className="mb-3 font-medium">
                  Place ton pari sur ton équipe favorite :
                </p>

                {/* Boutons de prédiction avec Styles Améliorés */}
                <div className="flex gap-3 justify-center mb-4 flex-wrap">
                  {/* DOMICILE */}
                  <button
                    onClick={() => setSelectedPrediction("home")}
                    className={`px-4 py-2 rounded-lg transition border ${
                      selectedPrediction === "home"
                        ? "bg-purple-700 text-white border-purple-700"
                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {match.homeTeam?.teamName} ({match.oddsHome})
                  </button>

                  {/* NUL - Caché si cote <= 1 */}
                  {Number(match.oddsDraw) > 1 && (
                    <button
                      onClick={() => setSelectedPrediction("draw")}
                      className={`px-4 py-2 rounded-lg transition border ${
                        selectedPrediction === "draw"
                          ? "bg-gray-600 text-white border-gray-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      Nul ({match.oddsDraw})
                    </button>
                  )}

                  {/* EXTÉRIEUR */}
                  <button
                    onClick={() => setSelectedPrediction("away")}
                    className={`px-4 py-2 rounded-lg transition border ${
                      selectedPrediction === "away"
                        ? "bg-purple-700 text-white border-purple-700"
                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {match.awayTeam?.teamName} ({match.oddsAway})
                  </button>
                </div>

                {/* Input Montant et Validation */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant à miser (€)"
                    className="border border-gray-300 rounded p-2 w-40 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    text="Valider le pari"
                    color="#9333EA"
                    onClick={handleBet}
                    // Désactive visuellement si incomplet
                    disabled={!selectedPrediction || !amount}
                    className={`transition ${
                      !selectedPrediction || !amount
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-purple-800"
                    }`}
                    style={{ color: "white" }}
                  />
                </div>

                {/* Message d'erreur API */}
                {message && (
                  <p className="text-sm mt-2 text-purple-600 font-medium">
                    {message}
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          // CAS 3 : Pas connecté
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-purple-600 font-semibold text-md">
              Connecte-toi pour placer un pari sur ce match !
            </p>
          </div>
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
