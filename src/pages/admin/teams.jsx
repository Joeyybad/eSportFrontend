import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/layout/Card";
import { useLocation } from "react-router-dom";

function Teams() {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!user?.isLoggedIn) return;

    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur fetch équipes :", data.message || data);
          setLoading(false);
          return;
        }

        setTeams(data || []); // Met à jour le state
        setLoading(false);
      } catch (error) {
        console.error("Erreur réseau :", error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user, location]);

  if (loading) return <p className="text-purple-600">Chargement...</p>;
  if (!teams.length)
    return <p className="text-red-600">Aucune équipe disponible</p>;

  return (
    <Card
      title="Équipes e-sport"
      subtitle="Voici la liste des équipes e-sport enregistrées sur la plateforme."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {teams.map((team) => (
          <Card key={team.id} title={team.teamName} subtitle={team.game}>
            {team.logo && (
              <img
                src={`http://localhost:5000/uploads/${team.logo}`}
                alt={`${team.teamName} logo`}
                className="w-20 h-20 mx-auto mt-1 mb-4 object-contain"
              />
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
}

export default Teams;
