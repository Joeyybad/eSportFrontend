import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation Yup pour le match
const matchSchema = yup.object({
  homeTeamId: yup.string().required("Équipe à domicile requise"),
  awayTeamId: yup
    .string()
    .required("Équipe extérieure requise")
    .notOneOf(
      [yup.ref("homeTeamId")],
      "Une équipe ne peut pas jouer contre elle-même"
    ),
  date: yup.date().typeError("Date invalide").required("Date requise"),
  status: yup
    .string()
    .oneOf(["scheduled", "live", "completed", "cancelled"])
    .required("Statut requis"),
  oddsHome: yup
    .number()
    .typeError("La cote doit être un nombre") // Gère si on tape du texte
    .min(1.01, "La cote doit être supérieure à 1") // Plus logique que positive()
    .required("Cote domicile requise"),

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
    .min(1.01, "La cote doit être supérieure à 1")
    .required("Cote extérieur requise"),
});

// Validation Yup pour le résultat final
const resultSchema = yup.object({
  result: yup
    .string()
    .oneOf(["home", "draw", "away"])
    .required("Résultat requis"),
});

function EditMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]); // Initialisé tableau vide
  const [loading, setLoading] = useState(true);
  const [modifMessage, setModifMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function fetchData() {
      try {
        // 1. Récupération du match (Pas de changement ici, ça renvoie un objet unique)
        const resMatch = await fetch(
          `http://localhost:5000/api/matches/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataMatch = await resMatch.json();

        // 2. ✅ CORRECTION RÉCUPÉRATION ÉQUIPES
        // On ajoute limit=100 (ou plus) pour être sûr d'avoir toutes les équipes dans le menu déroulant
        const response = await fetch(
          "http://localhost:5000/api/admin/teams?limit=100",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataTeams = await response.json();

        setMatch(dataMatch);

        // ✅ CIBLE LE TABLEAU DANS L'OBJET PAGINÉ
        setTeams(dataTeams.teams || []);
      } catch (err) {
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, token]);

  // Handler mise à jour match
  const handleUpdate = async (values) => {
    try {
      const res = await fetch(`http://localhost:5000/api/matches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setModifMessage("Match modifié avec succès !");
      setTimeout(() => navigate("/admin/gestion-match"), 1500);
    } catch (err) {
      console.error(err);
      setModifMessage("Erreur lors de la modification du match");
    }
  };

  // Handler résultat final
  const handleResultSubmit = async (values) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/matches/${id}/result`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setResultMessage("Résultat final enregistré et gains calculés !");
      setTimeout(() => navigate("/admin/gestion-match"), 1500);
    } catch (err) {
      console.error(err);
      setResultMessage("Erreur lors de l'enregistrement du résultat");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-red-600 text-center py-8">
        Vous devez être connecté pour modifier un match.
      </p>
    );
  }

  if (loading) return <p className="mt-10 text-center">Chargement...</p>;
  if (!match)
    return <p className="text-red-600 text-center">Match introuvable</p>;

  // ✅ SÉCURISATION DU MAP POUR LES OPTIONS
  // On s'assure que 'teams' est bien un tableau avant de faire le .map
  const teamOptions = Array.isArray(teams)
    ? teams.map((t) => ({ value: String(t.id), label: t.teamName }))
    : [];

  const matchFields = [
    {
      name: "homeTeamId",
      label: "Équipe domicile",
      type: "select",
      options: teamOptions, // Utilisation de la variable sécurisée
      defaultValue: String(match.homeTeamId),
    },
    {
      name: "awayTeamId",
      label: "Équipe extérieure",
      type: "select",
      options: teamOptions, // Utilisation de la variable sécurisée
      defaultValue: String(match.awayTeamId),
    },
    {
      name: "date",
      label: "Date du match",
      type: "datetime-local",
      defaultValue: match.date
        ? new Date(match.date).toISOString().slice(0, 16)
        : "",
    },
    {
      name: "oddsHome",
      label: "Cote équipe domicile",
      type: "number",
      step: "0.01",
      defaultValue: match.oddsHome,
    },
    {
      name: "oddsDraw",
      label: "Cote match nul",
      type: "number",
      step: "0.01",
      defaultValue: match.oddsDraw,
    },
    {
      name: "oddsAway",
      label: "Cote équipe extérieure",
      type: "number",
      step: "0.01",
      defaultValue: match.oddsAway,
    },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: ["scheduled", "live", "completed", "cancelled"].map((s) => ({
        value: s,
        label: s,
      })),
      defaultValue: match.status,
    },
  ];

  const resultFields = [
    {
      name: "result",
      label: "Résultat",
      type: "select",
      options: [
        {
          value: "home",
          label: `${match.homeTeam?.teamName || "Domicile"} gagne`,
        },
        { value: "draw", label: "Match nul" },
        {
          value: "away",
          label: `${match.awayTeam?.teamName || "Extérieur"} gagne`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col gap-6">
      <Card title="Modifier le match">
        <Form
          fields={matchFields}
          onSubmit={handleUpdate}
          submitLabel="Enregistrer"
          resolver={yupResolver(matchSchema)}
          defaultValues={{
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            date: match.date
              ? new Date(match.date).toISOString().slice(0, 16)
              : "",
            oddsHome: match.oddsHome,
            oddsDraw: match.oddsDraw,
            oddsAway: match.oddsAway,
            status: match.status,
          }}
        />
        {modifMessage && (
          <p className="text-purple-600 mt-2 text-center">{modifMessage}</p>
        )}
      </Card>

      <Link
        to="/admin/gestion-match"
        className="block mt-4 text-purple-600 hover:underline"
      >
        ← Retour gestion des matchs
      </Link>

      <Card title="Déclarer le résultat final">
        <Form
          fields={resultFields}
          onSubmit={handleResultSubmit}
          submitLabel="Valider le résultat"
          resolver={yupResolver(resultSchema)}
        />
        {resultMessage && (
          <p className="text-purple-600 mt-2 text-center">{resultMessage}</p>
        )}
      </Card>
    </div>
  );
}

export default EditMatch;
