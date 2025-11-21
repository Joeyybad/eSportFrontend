import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    avatar: profile?.avatar || "",
    favoritesGames: profile?.favoritesGames?.join(", ") || "",
    favoritesTeams: profile?.favoritesTeams?.join(", ") || "",
  });

  // Récupération des données du profil au chargement
  useEffect(() => {
    if (!user?.isLoggedIn) return;

    const fetchProfile = async () => {
      try {
        // console.log("Profil demandé pour ID :", user.id);
        // console.log("User du token :", user);
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur fetch profil :", data.message || data);
          return;
        }

        setProfile(data); // data contient le user renvoyé par le backend
        setLoading(false);
      } catch (error) {
        console.error("Erreur réseau :", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Préremplissage du formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        birthdate: profile.birthdate,
        avatar: profile.avatar,
        favoritesGames: profile.favoritesGames.join(", "),
        favoritesTeams: profile.favoritesTeams.join(", "),
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // gestion sauvegarde
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          favoritesGames: formData.favoritesGames
            .split(",")
            .map((g) => g.trim()),
          favoritesTeams: formData.favoritesTeams
            .split(",")
            .map((t) => t.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur API");

      setProfile(data.user);
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Impossible de mettre à jour le profil.");
    }
  };

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!profile)
    return <p className="text-red-600">Impossible de récupérer le profil</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="sr-only">Profil utilisateur</h1>

      <Card title="Mon profil" subtitle="Informations personnelles">
        <div className="flex flex-col gap-2 text-center">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt="Avatar utilisateur"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <p>
            <span className="font-semibold">Pseudo:</span> {profile.username}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Jeux favoris:</span>{" "}
            {profile.favoritesGames.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Équipes favorites:</span>{" "}
            {profile.favoritesTeams.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Paris réussis:</span>{" "}
            {profile.betsWon} / {profile.betsTotal}
          </p>

          {/* --- Bouton Modifier --- */}
          <div className="mt-4">
            <Button
              text="Modifier le profil"
              color="#9333EA"
              onClick={() => setShowModal(true)}
              style={{ color: "white" }}
            />
          </div>
        </div>
      </Card>

      {/* --- Modal --- */}
      {showModal && (
        <Modal title="Modifier mon profil" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Pseudo"
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="URL de l'avatar"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="favoritesGames"
              value={formData.favoritesGames}
              onChange={handleChange}
              placeholder="Jeux favoris (séparés par des virgules)"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="favoritesTeams"
              value={formData.favoritesTeams}
              onChange={handleChange}
              placeholder="Équipes favorites (séparées par des virgules)"
              className="border p-2 rounded"
            />

            <Button
              text="Enregistrer"
              color="#9333EA"
              onClick={handleSave}
              style={{ color: "white" }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Profile;
