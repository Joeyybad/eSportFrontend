import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const schema = yup.object({
  username: yup.string().required("Nom d'utilisateur requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  sujet: yup.string().required("Sujet requis"),
  message: yup.string().required("Texte requis"),
});

function Contact() {
  const userId = useAuthStore((state) => state.id);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const username = useAuthStore((state) => state.username);
  const email = useAuthStore((state) => state.email);

  const [message, setMessage] = useState("");

  const defaultValues = {
    username: isLoggedIn ? username : "",
    email: isLoggedIn ? email : "",
    sujet: "",
    message: "",
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.username,
        email: formData.email,
        sujet: formData.sujet,
        message: formData.message,
        userId: isLoggedIn ? userId : null,
      };

      const response = await fetch("http://localhost:5000/api/contact/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de l'envoi du message");
        return;
      }

      setMessage("Message envoyé avec succès !");

      // Optionnel : Tu pourrais vouloir vider le formulaire ici ou rediriger
      // Mais avec ton composant Form générique, c'est parfois complexe de reset les champs sans recharger la page.
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
    }
  };

  const fields = [
    { name: "username", label: "Nom d'utilisateur", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "sujet", label: "Sujet", type: "text" },
    { name: "message", label: "Message", type: "textarea" },
  ];

  return (
    <Card
      title="Contact"
      subtitle="Nous serions ravis de vous entendre. Remplissez le formulaire ci-dessous."
    >
      <Form
        title="Contact"
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        submitLabel="Envoyer"
        resolver={yupResolver(schema)}
      />
      {message && (
        <div
          className={`max-w-md mx-auto mt-4 p-4 text-center rounded ${
            message.includes("succès")
              ? "text-purple-600 bg-purple-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          {message}
        </div>
      )}
    </Card>
  );
}

export default Contact;
