import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";

// Schéma de validation avec Yup
const schema = yup.object({
  username: yup.string().required("Nom d'utilisateur requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  sujet: yup.string().required("Sujet requis"),
  message: yup.string().required("Texte requis"),
});

// Composant de la page de contact
function Contact() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [message, setMessage] = useState("");
  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        name: formData.username,
        email: formData.email,
        sujet: formData.sujet,
        message: formData.message,
        userId: isLoggedIn ? token.userId : null,
      };
      console.log("Payload envoyé :", payload);
      const response = await fetch("http://localhost:5000/api/contact", {
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
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  // Champs du formulaire
  const fields = [
    { name: "username", label: "Nom d'utilisateur", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "sujet", label: "Sujet", type: "text" },
    { name: "message", label: "Message", type: "textarea" },
  ];

  return (
    <>
      <Card
        title="Contact"
        subtitle="Nous serions ravis de vous entendre. Remplissez le formulaire ci-dessous."
      >
        <Form
          title="Contact"
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Envoyer"
          resolver={yupResolver(schema)}
        />
        {/* Message d'erreur ou de succès */}
        {message && (
          <div className="max-w-md mx-auto mt-4 p-4 text-center text-purple-600 rounded">
            {message}
          </div>
        )}
      </Card>
    </>
  );
}

export default Contact;
