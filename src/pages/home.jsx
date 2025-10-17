import { Link } from "react-router-dom";
import Card from "../components/layout/Card";

function Home() {
  return (
    <>
      <h1 className="sr-only">Accueil</h1>
      <div className="max-w-4xl mx-auto px-4">
        <Card
          title="Bienvenue E-sport Evolution"
          subtitle="Votre plateforme tout-en-un pour tout ce qui concerne l'e-sport."
        >
          <p>Votre plateforme pour tout ce qui concerne l'e-sport.</p>
        </Card>
      </div>
    </>
  );
}

export default Home;
