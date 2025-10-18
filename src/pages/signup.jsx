import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation avec Yup
const schema = yup.object({
  username: yup.string().required("Nom d'utilisateur requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(6, "6 caractères minimum")
    .required("Mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("Confirmation du mot de passe requise"),
});
// Composant de la page d'inscription
function Signup() {
  const onSubmit = (data) => {
    console.log("Inscription :", data);
    // on gèrera la logique d'inscription plus tard (API)
  };
  const fields = [
    { name: "username", label: "Nom d'utilisateur", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Mot de passe", type: "password" },
    {
      name: "confirmPassword",
      label: "Confirmer le mot de passe",
      type: "password",
    },
  ];

  return (
    <>
      <Card
        title="Inscription"
        subtitle="Rejoignez la communauté et créez votre profil dès maintenant."
      >
        <Form
          title="Inscription"
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="S'inscrire"
          resolver={yupResolver(schema)}
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
