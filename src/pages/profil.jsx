import Card from "../components/layout/Card";
import Button from "../components/ui/Button";

// Exemple de données utilisateur (mock)
const user = {
  avatar: "/path/to/avatar.jpg",
  username: "Gamer123",
  firstName: "Jean",
  lastName: "Dupont",
  favoritesGames: ["League of Legends", "Dota 2", "CS:GO"],
  favoritesTeams: ["Team Liquid", "Fnatic", "G2 Esports"],
  email: "jean.dupont@example.com",
  betsWon: 12,
  betsTotal: 20,
};

function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="sr-only">Profil utilisateur</h1>

      <Card title="Mon profil" subtitle="Informations personnelles">
        <div className="flex flex-col gap-2 text-center">
          <img
            src={user.avatar}
            alt="Avatar utilisateur"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <p>
            <span className="font-semibold">Pseudo:</span> {user.username}
          </p>
          <p>
            <span className="font-semibold">Nom:</span> {user.lastName}
          </p>
          <p>
            <span className="font-semibold">Prénom:</span> {user.firstName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Jeux favoris:</span>{" "}
            {user.favoritesGames.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Équipes favorites:</span>{" "}
            {user.favoritesTeams.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Paris réussis:</span> {user.betsWon}{" "}
            / {user.betsTotal}
          </p>

          {/* Bouton Modifier */}
          <div className="mt-4">
            <Button
              text="Modifier le profil"
              color="#9333EA"
              onClick={() => {
                // plus tard : ouvrir popup
                console.log("Ouvrir popup de modification");
              }}
              style={{ color: "white" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
