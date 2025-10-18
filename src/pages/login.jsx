import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation avec Yup
const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(6, "6 caractères minimum")
    .required("Mot de passe requis"),
});
// Composant de la page de connexion
function Login() {
  const onSubmit = (data) => {
    console.log("Connexion :", data);
    // on gèrera la logique de connexion plus tard (API)
  };
  // Champs du formulaire
  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Mot de passe", type: "password" },
  ];

  return (
    <Card title="Connexion" subtitle="Connectez-vous à votre compte.">
      <Form
        title="Connexion"
        fields={fields}
        onSubmit={onSubmit}
        submitLabel="Se connecter"
        resolver={yupResolver(schema)}
      />
      <p className="text-sm text-gray-600 text-center mt-4">
        Pas encore inscrit ?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Créez un compte ici
        </Link>
      </p>
    </Card>
  );
}

export default Login;
