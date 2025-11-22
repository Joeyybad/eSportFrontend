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
  date: yup
    .date()
    .typeError("Date invalide")
    .required("Date requise")
    .test(
      "is-later-than-original",
      "La nouvelle date doit être après la date initiale du match",
      function (value) {
        const originalDate = this.options.context?.originalDate;
        if (!value) return false; // requis
        if (!originalDate) return true; // pas de date initiale donnée, on laisse passer
        return value.getTime() > new Date(originalDate).getTime();
      }
    ),
  status: yup
    .string()
    .oneOf(["scheduled", "live", "completed", "cancelled"])
    .required("Statut requis"),
  oddsHome: yup
    .number()
    .typeError("Doit être un nombre")
    .positive("Doit être positive")
    .test("maxDecimals", "2 décimales max", (v) => /^\d+(\.\d{1,2})?$/.test(v))
    .required(),
  oddsDraw: yup
    .number()
    .typeError("Doit être un nombre")
    .positive()
    .test("maxDecimals", "2 décimales max", (v) => /^\d+(\.\d{1,2})?$/.test(v))
    .required(),
  oddsAway: yup
    .number()
    .typeError("Doit être un nombre")
    .positive()
    .test("maxDecimals", "2 décimales max", (v) => /^\d+(\.\d{1,2})?$/.test(v))
    .required(),
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
  const [teams, setTeams] = useState([]);
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

        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const dataTeams = await response.json();

        setMatch(dataMatch);
        setTeams(dataTeams);
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

  const matchFields = [
    {
      name: "homeTeamId",
      label: "Équipe domicile",
      type: "select",
      options: teams.map((t) => ({ value: String(t.id), label: t.teamName })),
      defaultValue: String(match.homeTeamId),
    },
    {
      name: "awayTeamId",
      label: "Équipe extérieure",
      type: "select",
      options: teams.map((t) => ({ value: String(t.id), label: t.teamName })),
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
        { value: "home", label: `${match.homeTeam.teamName} gagne` },
        { value: "draw", label: "Match nul" },
        { value: "away", label: `${match.awayTeam.teamName} gagne` },
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

      <Link
        to="/admin/gestion-match"
        className="block mt-4 text-purple-600 hover:underline"
      >
        ← Retour gestion des matchs
      </Link>
    </div>
  );
}

export default EditMatch;
