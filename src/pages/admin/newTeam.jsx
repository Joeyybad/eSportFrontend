import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

// Schéma de validation avec Yup
const schema = yup.object({
  teamName: yup
    .string()
    .required("Nom de l’équipe requis")
    .min(2, "2 caractères minimum"),
  game: yup
    .string()
    .required("Jeu principal requis")
    .min(2, "2 caractères minimum"),
  description: yup
    .string()
    .required("Description requise")
    .min(10, "10 caractères minimum"),
});

// Composant de la page de création d'équipe
function NewTeam() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!isLoggedIn) return;
    console.log("Token actuel :", token);
  }, [isLoggedIn, token]);
  const onSubmit = async (formData) => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("teamName", formData.teamName);
      dataToSend.append("game", formData.game);
      dataToSend.append("description", formData.description);

      // ajout du logo
      if (formData.logo && formData.logo[0]) {
        dataToSend.append("logo", formData.logo[0]);
      }

      const response = await fetch("http://localhost:5000/api/admin/teams", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de la création de l'équipe");
        return;
      }

      setMessage(" Équipe créée avec succès !");
      setTimeout(() => navigate("/admin/teams"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  };
  // Champs du formulaire
  const fields = [
    { name: "teamName", label: "Nom de l’équipe", type: "text" },
    { name: "game", label: "Jeu principal", type: "text" },
    { name: "logo", label: "Logo de l’équipe", type: "file" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <>
      <Card
        title="Créez votre équipe"
        subtitle="Rejoignez la communauté e-sport en créant votre propre équipe."
      >
        <Form
          title="Informations de l’équipe"
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Créer"
          resolver={yupResolver(schema)}
        />
        {/* Message d'erreur ou de succès */}
        {message && (
          <p className="text-purple-600 my-2 text-center whitespace-pre-line">
            {message}
          </p>
        )}
      </Card>
    </>
  );
}

export default NewTeam;
