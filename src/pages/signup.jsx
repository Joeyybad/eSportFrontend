import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

// Schéma de validation avec Yup
const schema = yup.object({
  username: yup.string().required("Nom d'utilisateur requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  birthdate: yup
    .date()
    .typeError("Veuillez entrer une date valide")
    .max(new Date(), "La date de naissance doit être dans le passé")
    .required("Date de naissance requise"),
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
  isConditionChecked: yup
    .boolean()
    .oneOf(
      [true],
      "Veuillez accepter les conditions générales d'utilisation pour continuer."
    )
    .required(),
});
// Composant de la page d'inscription
function Signup() {
  const [message, setMessage] = useState(""); // État pour afficher le message de succès ou d'erreur
  const onSubmit = async (formData) => {
    try {
      // Convertir birthdate au format ISO
      const payload = {
        ...formData,
        birthdate: new Date(formData.birthdate).toISOString().split("T")[0],
      };

      console.log("Payload envoyé :", payload);

      const response = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // <-- Inclut confirmPassword
      });

      //  Lecture de la réponse JSON
      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs backend
        if (data.errors) {
          setMessage(data.errors.map((err) => err.msg).join("\n"));
        } else {
          setMessage(
            data.message || "Une erreur est survenue lors de l'inscription"
          );
        }
        return;
      }

      // Succès
      setMessage(
        data.message ||
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      console.log("Utilisateur créé :", data.user);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  };
  const fields = [
    { name: "username", label: "Nom d'utilisateur", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "birthdate", label: "Date de naissance", type: "date" },
    { name: "password", label: "Mot de passe", type: "password" },
    {
      name: "confirmPassword",
      label: "Confirmer le mot de passe",
      type: "password",
    },
    {
      name: "isConditionChecked",
      label: "J’accepte les conditions générales d’utilisation",
      type: "checkbox",
      validation: yup
        .boolean()
        .oneOf([true], "Vous devez accepter les CGU pour continuer")
        .required(),
    },
  ];

  return (
    <>
      <Card
        title="Inscription"
        subtitle="Rejoignez la communauté et créez votre profil dès maintenant."
      >
        <Form
          title=""
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="S'inscrire"
          resolver={yupResolver(schema)}
        />
        {/* Message d'erreur ou de succès */}
        {message && (
          <p className="text-purple-600 my-2 whitespace-pre-line">{message}</p>
        )}
        <p className="text-sm mt-2">
          En cochant cette case, vous acceptez nos{" "}
          <a href="/cgu" className="text-purple-600 underline">
            Conditions Générales d’Utilisation
          </a>
          .
        </p>
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
