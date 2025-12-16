import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import Card from "../../components/layout/Card";
import Modal from "../../components/ui/Modal";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { useLocation } from "react-router-dom";

function Teams() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    role === "admin" || user?.isAdmin === 1 || user?.role === "admin";

  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  const [editingTeam, setEditingTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // --- CONFIG FORMULAIRE ---
  const teamFields = [
    {
      name: "teamName",
      label: "Nom de l'équipe",
      type: "text",
      placeholder: "Ex: Karmine Corp",
    },
    {
      name: "game",
      label: "Jeu",
      type: "text",
      placeholder: "Ex: League of Legends",
    },
    { name: "logo", label: "Nouveau logo", type: "file" },
  ];

  // --- CHARGEMENT ---
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/teams?page=${page}&limit=6`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.error("Erreur fetch:", data);
          setLoading(false);
          return;
        }
        setTeams(data.teams || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [isLoggedIn, token, location, page]);

  // --- GESTION SUPPRESSION (MODALE) ---

  // 1. L'utilisateur clique sur la poubelle -> On ouvre la modale
  const handleRequestDelete = (team) => {
    setDeletingTeam(team);
  };

  // 2. L'utilisateur confirme DANS la modale -> On appelle l'API
  const handleConfirmDelete = async () => {
    if (!deletingTeam) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/teams/${deletingTeam.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Suppression réussie : on met à jour l'UI et on ferme la modale
        setTeams((prev) => prev.filter((t) => t.id !== deletingTeam.id));
        setDeletingTeam(null);
      } else {
        const error = await response.json();
        alert(error.message); // Fallback en cas d'erreur API
      }
    } catch (error) {
      console.error("Erreur delete:", error);
    }
  };

  // --- GESTION MODIFICATION ---
  const handleUpdateSubmit = async (formDataResult) => {
    if (!editingTeam) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("teamName", formDataResult.teamName);
      formDataToSend.append("game", formDataResult.game);
      if (formDataResult.logo && formDataResult.logo.length > 0) {
        formDataToSend.append("logo", formDataResult.logo[0]);
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/teams/${editingTeam.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }, // Pas de Content-Type pour FormData
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const updatedTeam = await response.json();
        setTeams((prev) =>
          prev.map((t) => (t.id === editingTeam.id ? updatedTeam : t))
        );
        setEditingTeam(null);
      } else {
        const error = await response.json();
        alert("Erreur modification : " + error.message);
      }
    } catch (error) {
      console.error("Erreur update:", error);
    }
  };

  if (loading)
    return <p className="text-purple-600 text-center mt-10">Chargement...</p>;

  return (
    <>
      <Card
        title="Équipes e-sport"
        subtitle="Voici la liste des équipes e-sport enregistrées sur la plateforme."
      >
        {/* GRILLE DES ÉQUIPES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.isArray(teams) &&
            teams.map((team) => (
              <div key={team.id} className="flex flex-col h-full">
                <Card
                  title={team.teamName}
                  subtitle={team.game}
                  className="flex-grow flex flex-col justify-between"
                >
                  {team.logo && (
                    <div className="flex justify-center p-4">
                      <img
                        src={`http://localhost:5000/uploads/${team.logo}`}
                        alt={`${team.teamName} logo`}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        text="Modifier"
                        color="transparent"
                        textColor="#2563EB"
                        className="hover:bg-blue-50 border border-blue-200 px-3 py-1 text-sm"
                        onClick={() => setEditingTeam(team)}
                      />
                      <Button
                        text="Supprimer"
                        color="transparent"
                        textColor="#DC2626"
                        className="hover:bg-red-50 border border-red-200 px-3 py-1 text-sm"
                        onClick={() => handleRequestDelete(team)}
                      />
                    </div>
                  )}
                </Card>
              </div>
            ))}
        </div>

        {/*PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 border-t pt-4">
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
      </Card>

      {/* MODALE DE MODIFICATION */}
      {editingTeam && (
        <Modal
          title={`Modifier ${editingTeam.teamName}`}
          onClose={() => setEditingTeam(null)}
        >
          <Form
            fields={teamFields}
            defaultValues={{
              teamName: editingTeam.teamName,
              game: editingTeam.game,
            }}
            onSubmit={handleUpdateSubmit}
            submitLabel="Sauvegarder"
          />
        </Modal>
      )}

      {/* MODALE DE SUPPRESSION */}
      {deletingTeam && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => setDeletingTeam(null)}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'équipe{" "}
              <strong>{deletingTeam.teamName}</strong> ?
            </p>

            <p className="text-sm text-gray-500 italic bg-yellow-50 p-3 rounded border border-yellow-100">
              ⚠️ Cette action archivera l'équipe. Elle ne sera plus visible,
              mais l'historique des matchs sera conservé.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              {/* Bouton Annuler */}
              <Button
                text="Annuler"
                color="#F3F4F6"
                textColor="#374151"
                onClick={() => setDeletingTeam(null)}
                className="hover:bg-gray-200"
              />

              {/* Bouton Confirmer */}
              <Button
                text="Oui, supprimer"
                color="#DC2626"
                textColor="#FFFFFF"
                onClick={handleConfirmDelete}
                className="hover:bg-red-700 shadow-sm"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Teams;
