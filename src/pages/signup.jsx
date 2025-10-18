import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";

function Signup() {
  const handleSignup = (formData) => {
    console.log("Données d'inscription :", formData);
    // Ici, tu pourras gérer la logique d'inscription plus tard (API, etc.)
  };

  return (
    <>
      <Card
        title="Inscription"
        subtitle="Rejoignez la communauté et créez votre profil dès maintenant."
      >
        <Form
          fields={[
            {
              name: "username",
              label: "Nom d'utilisateur",
              type: "text",
              required: true,
            },
            {
              name: "email",
              label: "Adresse e-mail",
              type: "email",
              required: true,
            },
            {
              name: "password",
              label: "Mot de passe",
              type: "password",
              required: true,
            },
            {
              name: "confirmPassword",
              label: "Confirmer le mot de passe",
              type: "password",
              required: true,
            },
          ]}
          onSubmit={handleSignup}
          buttonText="S'inscrire"
        />

        <p className="text-sm text-gray-600 text-center mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Connectez-vous ici
          </Link>
        </p>
      </Card>
    </>
  );
}

export default Signup;
