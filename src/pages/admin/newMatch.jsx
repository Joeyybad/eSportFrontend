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
    .typeError("La cote doit être un nombre")
    .positive("La cote doit être positive")
    .required("Cote équipe domicile requise"),
  oddsDraw: yup
    .number()
    .typeError("La cote doit être un nombre")
    .min(0, "La cote ne peut pas être négative")
    // Optionnel : Une règle custom pour dire "Soit 0, soit > 1.01"
    .test(
      "is-valid-odd",
      "La cote doit être 0 (impossible) ou supérieure à 1.01",
      (val) => val === 0 || val >= 1.01
    )
    .required("Cote nul requise (mettre 0 si impossible)"),
  oddsAway: yup
    .number()
    .typeError("La cote doit être un nombre")
    .positive("La cote doit être positive")
    .required("Cote équipe extérieure requise"),
});

function NewMatch() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  // Données brutes complètes
  const [allTeams, setAllTeams] = useState([]);

  // Données filtrées pour l'affichage
  const [games, setGames] = useState([]);
  const [teamsForSelectedGame, setTeamsForSelectedGame] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  // États de sélection
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedHomeTeam, setSelectedHomeTeam] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");

  // Cela nous permet de déduire la liste des jeux ET les équipes disponibles d'un coup.
  useEffect(() => {
    if (!token) return;

    const fetchAllTeams = async () => {
      try {
        // On demande une grosse limite pour avoir beaucoup d'équipes pour récupérer les jeux
        const response = await fetch(
          "http://localhost:5000/api/admin/teams?limit=200",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur fetch équipes :", data.message || data);
          return;
        }

        const teamsList = data.teams || [];
        setAllTeams(teamsList);

        // Extraction des jeux uniques
        const uniqueGames = [...new Set(teamsList.map((team) => team.game))];
        setGames(uniqueGames);
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchAllTeams();
  }, [token]);

  useEffect(() => {
    if (!selectedGame) {
      setTeamsForSelectedGame([]);
      setTournaments([]);
      return;
    }

    //Filtrage local des équipes (Pas besoin de refetch !)
    const filtered = allTeams.filter((t) => t.game === selectedGame);
    setTeamsForSelectedGame(filtered);

    const fetchTournaments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tournaments?game=${encodeURIComponent(
            selectedGame
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) setTournaments(data || []);
      } catch (err) {
        console.error("Erreur réseau tournois :", err);
      }
    };
    fetchTournaments();
  }, [selectedGame, allTeams, token]);

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

      console.log("Payload envoyé :", payload);

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

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => `[${err.field}] : ${err.message}`)
            .join("\n");
          setMessage(errorMessages);
        } else {
          setMessage(data.message || "Erreur inconnue lors de la création.");
        }
        return;
      }

      setMessage("Match créé avec succès !");
      setTimeout(() => navigate("/admin/gestion-match"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Erreur de connexion.");
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
    // On affiche la suite seulement si un jeu est sélectionné
    ...(selectedGame
      ? [
          {
            name: "tournamentId",
            label: "Tournoi (Optionnel)",
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
            placeholder: "Ex: Finale",
          },
          {
            name: "homeTeamId",
            label: "Équipe à domicile",
            type: "select",
            options: teamsForSelectedGame.map((team) => ({
              value: team.id,
              label: team.teamName,
            })),
            onChange: (e) => setSelectedHomeTeam(e.target.value),
          },
          {
            name: "awayTeamId",
            label: "Équipe à l'extérieur",
            type: "select",
            // On filtre pour ne pas pouvoir sélectionner la même équipe qu'à domicile
            options: teamsForSelectedGame
              .filter((team) => team.id !== parseInt(selectedHomeTeam))
              .map((team) => ({
                value: team.id,
                label: team.teamName,
              })),
          },
          {
            name: "oddsHome",
            label: "Cote Domicile",
            type: "number",
            step: "0.01",
          },
          {
            name: "oddsDraw",
            label: "Cote Nul",
            type: "number",
            step: "0.01",
          },
          {
            name: "oddsAway",
            label: "Cote Extérieur",
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
          <p className="text-red-600 text-center">
            ⚠️ Aucun jeu disponible. Créez d’abord des équipes.
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
          <p className="text-purple-600 mt-4 text-center whitespace-pre-line bg-purple-50 p-2 rounded">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

export default NewMatch;
