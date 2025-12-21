import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

// Schéma de validation
const schema = yup.object({
  name: yup.string().required("Nom du tournoi requis"),
  game: yup.string().required("Jeu requis"),
  description: yup.string(),
  startDate: yup
    .date()
    .typeError("Veuillez entrer une date valide")
    .required("Date de début requise"),
  endDate: yup
    .date()
    .typeError("Veuillez entrer une date valide")
    .min(yup.ref("startDate"), "La date de fin doit être après le début")
    .nullable(),
});

function NewTournament() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [games, setGames] = useState([]);

  // Charger la liste des jeux existants via les équipes (même logique que NewMatch)
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Données reçues de l'API Teams :", data);

        if (!response.ok) {
          console.error("Erreur lors du chargement des équipes :", data);
          return;
        }
        const teamsList = Array.isArray(data)
          ? data
          : data.teams || data.data || [];

        if (!Array.isArray(teamsList)) {
          console.error("Format de données inattendu (pas un tableau)");
          return;
        }

        // Récupérer les jeux uniques sur la liste sécurisée
        const uniqueGames = [...new Set(teamsList.map((team) => team.game))];
        setGames(uniqueGames);
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchGames();
  }, [isLoggedIn, token]);

  // Soumission formulaire
  const onSubmit = async (formData) => {
    if (!token) {
      setMessage("Vous n'êtes pas autorisé à créer un tournoi.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/tournaments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de la création du tournoi");
        return;
      }

      setMessage("Tournoi créé avec succès !");
      setTimeout(() => navigate("/tournaments"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  };

  // Champs du formulaire
  const fields = [
    {
      name: "name",
      label: "Nom du tournoi",
      type: "text",
      placeholder: "Ex: LFL Finals, MSI Group Stage...",
    },
    {
      name: "game",
      label: "Jeu",
      type: "select",
      options: games.map((g) => ({ value: g, label: g })),
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "startDate",
      label: "Date de début",
      type: "datetime-local",
    },
    {
      name: "endDate",
      label: "Date de fin (optionnel)",
      type: "datetime-local",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card
        title="Créer un nouveau tournoi"
        subtitle="Configure les informations du tournoi."
      >
        <Form
          title=""
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Créer le tournoi"
          resolver={yupResolver(schema)}
        />

        {message && (
          <p className="text-purple-600 my-2 text-center whitespace-pre-line">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

export default NewTournament;
