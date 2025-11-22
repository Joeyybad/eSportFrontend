import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../stores/useAuthStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Schéma de validation pour le tournoi
const tournamentSchema = yup.object({
  name: yup.string().required("Nom du tournoi requis"),
  description: yup.string(),
  game: yup.string().required("Jeu requis"),
  startDate: yup.date().required("Date de début requise"),
  endDate: yup
    .date()
    .required("Date de fin requise")
    .min(
      yup.ref("startDate"),
      "La date de fin doit être après la date de début"
    ),
  status: yup
    .string()
    .oneOf(["scheduled", "live", "completed"])
    .required("Statut requis"),
});

function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage("Vous devez être connecté pour accéder à cette page.");
      return;
    }
    const fetchTournament = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");
        setTournament(data);
      } catch (err) {
        console.error(err);
        setMessage("Impossible de charger le tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id, token]);

  // Handler mise à jour
  const handleUpdate = async (values) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage("Tournoi modifié avec succès !");
      setTimeout(() => navigate("/admin/gestion-tournament"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la modification du tournoi");
    }
  };

  // Handler suppression
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce tournoi ? Cette action est irréversible."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      alert("Tournoi supprimé avec succès !");
      navigate("/admin/gestion-tournoi");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression du tournoi");
    }
  };
  if (!isLoggedIn) {
    return (
      <p className="text-red-600 text-center py-8">
        Vous devez être connecté pour modifier un tournoi.
      </p>
    );
  }
  if (loading) return <p className="mt-10 text-center">Chargement...</p>;
  if (!tournament)
    return <p className="text-red-600 text-center">Tournoi introuvable</p>;

  const fields = [
    {
      name: "name",
      label: "Nom du tournoi",
      type: "text",
      defaultValue: tournament.name,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: tournament.description || "",
    },
    { name: "game", label: "Jeu", type: "text", defaultValue: tournament.game },
    {
      name: "startDate",
      label: "Date de début",
      type: "datetime-local",
      defaultValue: tournament.startDate
        ? new Date(tournament.startDate).toISOString().slice(0, 16)
        : "",
    },
    {
      name: "endDate",
      label: "Date de fin",
      type: "datetime-local",
      defaultValue: tournament.endDate
        ? new Date(tournament.endDate).toISOString().slice(0, 16)
        : "",
    },
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: [
        { value: "scheduled", label: "À venir" },
        { value: "live", label: "En direct" },
        { value: "completed", label: "Terminé" },
      ],
      defaultValue: tournament.status,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col gap-6">
      <Card title="Modifier le tournoi">
        <Form
          fields={fields}
          onSubmit={handleUpdate}
          submitLabel="Enregistrer"
          resolver={yupResolver(tournamentSchema)}
          defaultValues={{
            name: tournament.name,
            description: tournament.description || "",
            game: tournament.game,
            startDate: tournament.startDate
              ? new Date(tournament.startDate).toISOString().slice(0, 16)
              : "",
            endDate: tournament.endDate
              ? new Date(tournament.endDate).toISOString().slice(0, 16)
              : "",
            status: tournament.status,
          }}
        />
        {message && (
          <p className="text-purple-600 mt-2 text-center">{message}</p>
        )}
      </Card>

      <div className="flex justify-between mt-4">
        <Button
          text="Supprimer le tournoi"
          color="#E11D48"
          textColor="#fff"
          onClick={handleDelete}
        />
        <Link
          to="/admin/gestion-tournoi"
          className="text-purple-600 hover:underline self-center"
        >
          ← Retour gestion des tournois
        </Link>
      </div>
    </div>
  );
}

export default EditTournament;
