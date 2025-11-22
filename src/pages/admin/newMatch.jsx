import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

// Schéma de validation
const schema = yup.object({
  game: yup.string().required("Jeu requis"),
  homeTeamId: yup.string().required("Équipe à domicile requise"),
  awayTeamId: yup
    .string()
    .required("Équipe à l'extérieur requise")
    .notOneOf(
      [yup.ref("homeTeamId")],
      "Une équipe ne peut pas jouer contre elle-même"
    ),
  matchDate: yup
    .date()
    .typeError("Veuillez entrer une date valide")
    .min(new Date(), "La date du match doit être dans le futur")
    .required("Date et heure du match requises"),
  oddsHome: yup
    .number()
    .typeError("La cote doit être un nombre decimal")
    .positive("La cote doit être positive")
    .test("maxDecimals", "La cote ne peut avoir que 2 décimales", (value) =>
      /^\d+(\.\d{1,2})?$/.test(value)
    )
    .required("Cote équipe domicile requise"),
  oddsDraw: yup
    .number()
    .typeError("La cote doit être un nombre decimal")
    .positive()
    .test("maxDecimals", "La cote ne peut avoir que 2 décimales", (value) =>
      /^\d+(\.\d{1,2})?$/.test(value)
    )
    .required("Cote match nul requise"),

  oddsAway: yup
    .number()
    .typeError("La cote doit être un nombre decimal")
    .positive("La cote doit être positive")
    .test("maxDecimals", "La cote ne peut avoir que 2 décimales", (value) =>
      /^\d+(\.\d{1,2})?$/.test(value)
    )
    .required("Cote équipe extérieure requise"),
});

function NewMatch() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [games, setGames] = useState([]);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState("");
  const [selectedGame, setSelectedGame] = useState("");

  // Charger les tournois correspondant au jeu sélectionné
  useEffect(() => {
    if (!selectedGame || !token) return;

    const fetchTournaments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tournaments?game=${encodeURIComponent(
            selectedGame
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setTournaments(data || []);
        else console.error("Erreur chargement tournois :", data);
      } catch (err) {
        console.error("Erreur réseau :", err);
      }
    };

    fetchTournaments();
  }, [selectedGame, token]);

  // Charger la liste des jeux disponibles à partir des équipes
  useEffect(() => {
    if (!token) return;

    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("4. Erreur fetch équipes :", data.message || data);
          return;
        }
        const uniqueGames = [...new Set((data || []).map((team) => team.game))];

        setGames(uniqueGames);
      } catch (error) {
        console.error("5. Échec du FETCH ou du JSON.parse (catch) :", error); // 👈 Point E
      }
    };

    fetchGames();
  }, [token]);

  // Charger les équipes correspondant au jeu sélectionné
  useEffect(() => {
    if (!selectedGame || !token) return;

    const fetchTeams = async () => {
      try {
        console.log("1. Début du fetch /api/admin/teams");
        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const filteredTeams = data.filter(
            (team) => team.game === selectedGame
          );
          setTeams(filteredTeams);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchTeams();
  }, [selectedGame, token]);

  // Soumission du formulaire match
  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        date: formData.matchDate
          ? new Date(formData.matchDate).toISOString()
          : null,
        awayTeamId: parseInt(formData.awayTeamId),
        homeTeamId: parseInt(formData.homeTeamId),
        oddsHome: parseFloat(formData.oddsHome),
        oddsDraw: parseFloat(formData.oddsDraw),
        oddsAway: parseFloat(formData.oddsAway),
        tournamentId: selectedTournament ? parseInt(selectedTournament) : null,
      };
      console.log("Payload corrigé envoyé :", payload);

      const response = await fetch(
        "http://localhost:5000/api/matches/create/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // ✅ LIRE LE CORPS UNE SEULE FOIS, QUEL QUE SOIT LE STATUT !
      // Si le body-parser du Back-end a échoué (très rare), response.json() peut planter
      // Pour être sûr, on utilise text() puis JSON.parse().
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        // Maintenant, 'data' est déjà le corps JSON, car il a été lu au-dessus

        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => `[${err.field}] : ${err.message}`)
            .join("\n");

          console.error("Erreurs de validation (du serveur) :", data.errors);
          setMessage(errorMessages);
        } else {
          console.error("Erreur serveur non formatée :", data.message || data);
          setMessage(data.message || "Erreur inconnue lors de la création.");
        }
        return;
      }

      // Si response.ok est VRAI (Succès 200/201)
      setMessage("Match créé avec succès !");
      setTimeout(() => navigate("/matchs"), 1500);
    } catch (error) {
      console.error("Erreur réseau ou JSON.parse :", error);
      setMessage("Erreur de connexion ou de traitement des données.");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-red-600 text-center py-8">
        Vous devez être connecté pour créer un match.
      </p>
    );
  }

  // Définition dynamique des champs du formulaire
  const fields = [
    {
      name: "game",
      label: "Jeu",
      type: "select",
      options: games.map((g) => ({ value: g, label: g })),
      onChange: (e) => setSelectedGame(e.target.value),
    },
    ...(selectedGame
      ? [
          {
            name: "tournamentId",
            label: "Tournoi",
            type: "select",
            options: tournaments.map((t) => ({
              value: t.id,
              label: t.name,
            })),
            onChange: (e) => setSelectedTournament(e.target.value),
          },
          {
            name: "phase",
            label: "Phase du tournoi",
            type: "text",
            placeholder: "Ex: Phase de groupes, Quart de finale...",
          },
          {
            name: "homeTeamId",
            label: "Équipe à domicile",
            type: "select",
            options: teams.map((team) => ({
              value: team.id,
              label: team.teamName,
            })),
            onChange: (e) => setSelectedHomeTeam(e.target.value),
          },
          {
            name: "awayTeamId",
            label: "Équipe à l'extérieur",
            type: "select",
            options: teams
              .filter((team) => team.id !== parseInt(selectedHomeTeam))
              .map((team) => ({
                value: team.id,
                label: team.teamName,
              })),
          },
          {
            name: "oddsHome",
            label: "Cote équipe domicile",
            type: "number",
            step: "0.01",
          },
          {
            name: "oddsDraw",
            label: "Cote match nul",
            type: "decimal",
          },
          {
            name: "oddsAway",
            label: "Cote équipe extérieure",
            type: "number",
            step: "0.01",
          },
          {
            name: "matchDate",
            label: "Date du match",
            type: "datetime-local",
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card
        title="Créer un nouveau match"
        subtitle="Choisis d’abord le jeu, puis les équipes correspondantes."
      >
        {games.length === 0 ? (
          <p className="text-red-600">
            ⚠️ Aucun jeu disponible. Créez d’abord des équipes (elles doivent
            être liées à un jeu).
          </p>
        ) : (
          <Form
            title="Informations du match"
            fields={fields}
            onSubmit={onSubmit}
            submitLabel="Créer le match"
            resolver={yupResolver(schema)}
          />
        )}
        {message && (
          <p className="text-purple-600 my-2 text-center whitespace-pre-line">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

export default NewMatch;
