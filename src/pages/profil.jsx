import Card from "../components/layout/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useAuthStore } from "../stores/useAuthStore";
import { useState, useEffect } from "react";

function Profile() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);

  const storeUsername = useAuthStore((state) => state.username);
  const storeEmail = useAuthStore((state) => state.email);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  // --------------------------------------------------

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  // Initialisation du formulaire (vide au départ)
  const [formData, setFormData] = useState({
    username: "",
    birthdate: "",
    avatar: "",
    favoritesGames: "",
    favoritesTeams: "",
  });

  // Récupération des données du profil au chargement
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  }, [isLoggedIn, token]);

  // Préremplissage du formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        birthdate: profile.birthdate
          ? new Date(profile.birthdate).toISOString().split("T")[0]
          : "",
        avatar: profile.avatar || "",
        favoritesGames:
          (profile.favoritesGames && profile.favoritesGames.join(", ")) || "",
        favoritesTeams:
          (profile.favoritesTeams && profile.favoritesTeams.join(", ")) || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion sauvegarde
  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        // Conversion des chaînes en tableaux pour l'envoi
        favoritesGames: formData.favoritesGames
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g),
        favoritesTeams: formData.favoritesTeams
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      const dataToSend = new FormData();

      // 1. AJOUTER LES CHAMPS TEXTE (stringifiés pour les tableaux)
      dataToSend.append("username", payload.username);
      dataToSend.append("birthdate", payload.birthdate);
      dataToSend.append(
        "favoritesGames",
        JSON.stringify(payload.favoritesGames)
      );
      dataToSend.append(
        "favoritesTeams",
        JSON.stringify(payload.favoritesTeams)
      );
      if (avatarFile) {
        dataToSend.append("avatar", avatarFile);
      }
      // Si vous permettez la modification du mot de passe
      // if (formData.password) {
      //    dataToSend.append("password", formData.password);
      // }

      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur API");

      // L'objet 'user' dans la réponse est potentiellement undefined si le contrôleur
      // ne l'enveloppe pas correctement. On utilise la sécurité pour éviter le crash.
      const updatedUser = data?.user;

      if (!updatedUser) {
        // Gérer le cas où la requête réussit mais l'objet 'user' est manquant dans le corps de réponse.
        setUpdateMessage(
          "Profil mis à jour, mais l'affichage nécessite un rafraîchissement."
        );
      } else {
        // Mise à jour de l'état local
        setProfile(updatedUser);

        // Mise à jour du store global (Header, etc.)
        setUserProfile({
          // Utilisation de l'opérateur de chaînage optionnel (?. ) et de ||
          username: updatedUser.username || storeUsername,
          email: updatedUser.email || storeEmail,
        });

        setUpdateMessage("Profil mis à jour avec succès !");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      // Met à jour le message d'erreur si disponible
      const errorMessage = error.message.includes("Erreur API")
        ? "Erreur lors de la mise à jour (vérifiez le format des données)."
        : "Impossible de contacter le serveur.";

      setUpdateMessage(errorMessage);
      alert("Impossible de mettre à jour le profil.");
    }
  };

  if (!isLoggedIn)
    return (
      <p className="text-red-600">
        Vous devez être connecté pour voir votre profil.
      </p>
    );
  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!profile)
    return <p className="text-red-600">Impossible de récupérer le profil</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="sr-only">Profil utilisateur</h1>

      <Card title="Mon profil" subtitle="Informations personnelles">
        <div className="flex flex-col gap-2 text-center">
          <img
            src={`http://localhost:5000/uploads/${profile.avatar}`}
            alt="Avatar utilisateur"
            className="w-24 h-24 rounded-full mx-auto object-cover"
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
        {updateMessage && (
          <p className="text-purple-600 mt-2 text-center">{updateMessage}</p>
        )}
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
              type="file"
              name="avatarFile"
              onChange={handleFileChange}
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
