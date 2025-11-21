import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/layout/Card";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/ui/Modal";

function GestionMatch() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  //  États pour la modale
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [message, setMessage] = useState("");

  //  Ouvrir la modale
  const openDeleteModal = (m) => {
    setMatchToDelete(m);
    setShowDeleteModal(true);
  };

  //  Suppression confirmée
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/match/${matchToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erreur suppression match");

      setMatches((prev) => prev.filter((x) => x.id !== matchToDelete.id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le match.");
    } finally {
      setMessage("Match supprimé avec succès.");
      setShowDeleteModal(false);
      setMatchToDelete(null);
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/matches", {
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Erreur récupération des matchs :",
            data.message || data
          );
          setLoading(false);
          return;
        }

        setMatches(data || []);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <>
      <Card
        title="Gestion des matchs"
        className="max-w-5xl mx-auto mt-10 texte-center border-purple-400 border-1"
      >
        <div className="max-w-5xl mx-auto mt-10 texte-center">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Match</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Statut</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {matches.map((m) => (
                <tr key={m.id} className="text-center">
                  <td className="border p-2">
                    {m.homeTeam?.teamName} vs {m.awayTeam?.teamName}
                  </td>
                  <td className="border p-2">
                    {new Date(m.date).toLocaleString("fr-FR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border p-2">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <Link
                      to={`/admin/match/${m.id}/edit`}
                      className="text-purple-600 hover:underline text-center flex items-center justify-center gap-1"
                    >
                      <Pencil size={16} />
                      Modifier
                    </Link>
                    <Button
                      onClick={() => openDeleteModal(m)}
                      className="text-red-600  text-center flex items-center justify-center gap-1"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <Trash2 size={16} /> Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && (
          <p className="text-purple-600 my-2 text-center whitespace-pre-line">
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
            Voulez-vous vraiment supprimer le match :
            <strong>
              {" "}
              {matchToDelete?.homeTeam?.teamName} vs{" "}
              {matchToDelete?.awayTeam?.teamName}
            </strong>{" "}
            ?
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
export default GestionMatch;
