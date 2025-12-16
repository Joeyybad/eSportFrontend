import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/layout/Card";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../stores/useAuthStore";
import Modal from "../../components/ui/Modal";

function GestionMatch() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NOUVEAUX ÉTATS POUR LA PAGINATION ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    if (!token) {
      alert("Erreur: Jeton d'authentification manquant.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/matches/${matchToDelete.id}`, // Vérifie bien si c'est /api/admin/matches ou /api/matches
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erreur suppression match");

      setMatches((prev) => prev.filter((x) => x.id !== matchToDelete.id));
      setMessage("Match supprimé avec succès.");
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le match.");
    } finally {
      setShowDeleteModal(false);
      setMatchToDelete(null);
      // On efface le message après 3 secondes
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // --- CHARGEMENT DES DONNÉES (PAGINÉ) ---
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // ✅ 1. On ajoute la pagination dans l'URL (limit=10 pour un tableau c'est bien)
        const response = await fetch(
          `http://localhost:5000/api/matches?page=${page}&limit=10`,
          {
            headers: {
              "Content-Type": "application/json",
              // Si ta route GET est protégée, décommente la ligne dessous :
              // Authorization: `Bearer ${token}`
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur fetch:", data.message || data);
          return;
        }

        // ✅ 2. On cible data.matches et on sécurise
        setMatches(data.matches || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page]); // On recharge quand la page change

  if (!isLoggedIn) {
    return (
      <p className="text-red-600 text-center py-8">
        Vous devez être connecté pour gérer les matchs.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <>
      <Card
        title="Gestion des matchs"
        className="max-w-5xl mx-auto mt-10 texte-center border-purple-400 border-1"
      >
        <div className="max-w-5xl mx-auto mt-6 overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-3 text-left">Match</th>
                <th className="border p-3 text-center">Date</th>
                <th className="border p-3 text-center">Statut</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* ✅ 3. Sécurité Array + Message si vide */}
              {Array.isArray(matches) && matches.length > 0 ? (
                matches.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="border p-3">
                      <div className="font-semibold text-gray-800">
                        {m.homeTeam?.teamName}{" "}
                        <span className="text-gray-400 text-sm">vs</span>{" "}
                        {m.awayTeam?.teamName}
                      </div>
                    </td>
                    <td className="border p-3 text-center text-sm text-gray-600">
                      {new Date(m.date).toLocaleString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border p-3 text-center">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="border p-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/match/${m.id}/edit`}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm font-medium"
                        >
                          <Pencil size={16} /> Modifier
                        </Link>
                        <button
                          onClick={() => openDeleteModal(m)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    Aucun match trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ 4. CONTRÔLES DE PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 border-t pt-4">
            <Button
              text="Précédent"
              color={page === 1 ? "#E5E7EB" : "#FFFFFF"}
              textColor={page === 1 ? "#9CA3AF" : "#374151"}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`border ${
                page === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            />

            <span className="text-sm text-gray-600 font-medium">
              Page {page} sur {totalPages}
            </span>

            <Button
              text="Suivant"
              color={page === totalPages ? "#E5E7EB" : "#FFFFFF"}
              textColor={page === totalPages ? "#9CA3AF" : "#374151"}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`border ${
                page === totalPages ? "cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            />
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-center">
            {message}
          </div>
        )}
      </Card>

      {/* --- MODALE DELETE --- */}
      {showDeleteModal && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Voulez-vous vraiment supprimer le match opposant :<br />
              <strong className="text-gray-900 text-lg block mt-2">
                {matchToDelete?.homeTeam?.teamName} vs{" "}
                {matchToDelete?.awayTeam?.teamName}
              </strong>
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                text="Annuler"
                color="#F3F4F6"
                textColor="#374151"
                className="hover:bg-gray-200 px-4 py-2"
                onClick={() => setShowDeleteModal(false)}
              />

              <Button
                text="Confirmer la suppression"
                color="#DC2626"
                textColor="#FFFFFF"
                className="hover:bg-red-700 px-4 py-2"
                onClick={confirmDelete}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default GestionMatch;
