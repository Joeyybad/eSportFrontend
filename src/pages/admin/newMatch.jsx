import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Schéma de validation avec Yup
const schema = yup.object({
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
  oddsAway: yup
    .number()
    .typeError("La cote doit être un nombre")
    .positive("La cote doit être positive")
    .required("Cote équipe extérieure requise"),
});

// Composant de la page de création de match
function NewMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur lors du chargement des équipes :", data);
          return;
        }

        setTeams(data || []);
        console.log("Équipes chargées :", data);
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchTeams();
  }, [user]);

  const onSubmit = async (formData) => {
    try {
      // Convertir matchDate au format ISO
      const payload = {
        ...formData,
        matchDate: new Date(formData.matchDate).toISOString(),
      };
      console.log("Payload envoyé :", payload);

      const response = await fetch("http://localhost:5000/api/create/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      //  Lecture de la réponse JSON
      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs backend
        if (data.errors) {
          setMessage(data.errors.map((err) => err.msg).join("\n"));
        } else {
          setMessage(
            data.message ||
              "Une erreur est survenue lors de la création du match"
          );
        }
        return;
      }

      // Succès
      setMessage(data.message || "Match créé avec succès !");
      console.log("Match créé :", data.match);
      setTimeout(() => navigate("/admin/matches"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  };

  const homeTeamOptions = teams.map((team) => ({
    value: team.id,
    label: team.teamName,
  }));
  const awayTeamOptions = teams.map((team) => ({
    value: team.id,
    label: team.teamName,
  }));

  const fields = [
    {
      name: "homeTeamId",
      label: "Équipe à domicile",
      type: "select",
      options: homeTeamOptions,
    },
    {
      name: "awayTeamId",
      label: "Équipe à l'extérieur",
      type: "select",
      options: awayTeamOptions,
    },
    {
      name: "matchDate",
      label: "Date et heure du match",
      type: "datetime-local",
    },
    { name: "oddsHome", label: "Cote équipe domicile", type: "number" },
    { name: "oddsAway", label: "Cote équipe extérieure", type: "number" },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card
        title="Créer un nouveau match"
        subtitle="Configure un match pour que les utilisateurs puissent parier dessus."
      >
        {teams.length === 0 ? (
          <p className="text-red-600">
            ⚠️ Aucune équipe disponible. Créez d’abord des équipes avant de
            créer un match.
          </p>
        ) : (
          <>
            <Form
              title="Informations du match"
              fields={fields}
              onSubmit={onSubmit}
              submitLabel="Créer le match"
              resolver={yupResolver(schema)}
            />
            {message && (
              <p className="text-purple-600 my-2 whitespace-pre-line">
                {message}
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default NewMatch;
