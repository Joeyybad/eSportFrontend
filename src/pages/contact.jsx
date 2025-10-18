import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";

function Contact() {
  const handleContact = (formData) => {
    console.log("Données de contact :", formData);
    // Ici on gèrera la logique de contact plus tard (API, etc.)
  };

  return (
    <>
      <Card
        title="Contact"
        subtitle="Nous serions ravis de vous entendre. Remplissez le formulaire ci-dessous."
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
              name: "sujet",
              label: "Sujet",
              type: "text",
              required: true,
            },
            {
              name: "texte",
              label: "Texte",
              type: "textarea",
              required: true,
            },
          ]}
          onSubmit={handleContact}
          buttonText="Envoyer"
        />
      </Card>
    </>
  );
}

export default Contact;
