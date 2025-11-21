import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/layout/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function GestionTournament() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  //  États pour la modale
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [message, setMessage] = useState("");

  //  Ouvrir la modale
  const openDeleteModal = (t) => {
    setTournamentToDelete(t);
    setShowDeleteModal(true);
  };

  //  Suppression confirmée
  const confirmDelete = async () => {
    if (!tournamentToDelete?.id) {
      console.error("Aucun tournoi sélectionné pour la suppression");
      return;
    }

    try {
      console.log(
        "Suppression tournoi ID :",
        tournamentToDelete.id,
        "Token :",
        user?.token
      );

      const res = await fetch(
        `http://localhost:5000/api/tournaments/${tournamentToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur API :", res.status, data);
        throw new Error(data.message || "Erreur suppression tournoi");
      }

      // Met à jour la liste seulement si la suppression a réussi
      setTournaments((prev) =>
        prev.filter((x) => x.id !== tournamentToDelete.id)
      );

      // Message de succès et fermeture de la modale
      setMessage("Tournoi supprimé avec succès.");
      setShowDeleteModal(false);
      setTournamentToDelete(null);
    } catch (err) {
      console.error("Erreur suppression tournoi :", err);
      alert("Impossible de supprimer le tournoi.");
    }
  };

  // --- Récupération des tournois
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tournaments");
        const data = await res.json();

        if (!res.ok) {
          console.error("Erreur récupération :", data.message || data);
          return;
        }

        setTournaments(data || []);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <>
      <Card
        title="Gestion des tournois"
        className="max-w-5xl mx-auto mt-10 text-center border-purple-400 border-1"
      >
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Jeu</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id} className="text-center">
                <td className="border p-2">{t.name}</td>
                <td className="border p-2">{t.game}</td>
                <td className="border p-2">
                  <StatusBadge status={t.status} />
                </td>

                <td className="border p-2 flex justify-center gap-3">
                  <Link
                    to={`/admin/tournament/${t.id}/edit`}
                    className="text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Link>

                  <button
                    onClick={() => openDeleteModal(t)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && (
          <p className="text-purple-600 mt-2 text-center whitespace-pre-line">
            {message}
          </p>
        )}
      </Card>

      {/* --- MODALE DELETE --- */}
      {showDeleteModal && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => setShowDeleteModal(false)}
        >
          <p className="mb-4 text-center">
            Voulez-vous vraiment supprimer le tournoi :
            <strong> {tournamentToDelete?.name}</strong> ?
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <Button
              text="Annuler"
              color="#e5e7eb"
              textColor="#333"
              className="px-4 py-2"
              onClick={() => setShowDeleteModal(false)}
            />

            <Button
              color="#fee2e2"
              textColor="#dc2626"
              className="px-4 py-2 border border-red-300 hover:bg-red-100"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default GestionTournament;
