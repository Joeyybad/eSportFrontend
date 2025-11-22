import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

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
  const login = useAuthStore((state) => state.login);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Une erreur est survenue lors de la connexion"
        );
        return;
      }

      setMessage("Connexion réussie !");
      login(data);

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  }; // Champs du formulaire
  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Mot de passe", type: "password" },
  ];

  return (
    <Card title="Connexion" subtitle="Connectez-vous à votre compte.">
      {" "}
      <Form
        title=""
        fields={fields}
        onSubmit={onSubmit}
        submitLabel="Se connecter"
        resolver={yupResolver(schema)}
      />
      {/* Message d'erreur ou de succès */}{" "}
      {message && (
        <p className="text-purple-600 text-center my-2 whitespace-pre-line">
          {message}{" "}
        </p>
      )}{" "}
      <p className="text-sm text-gray-600 text-center mt-4">
        Pas encore inscrit ?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Créez un compte ici{" "}
        </Link>{" "}
      </p>{" "}
    </Card>
  );
}

export default Login;
