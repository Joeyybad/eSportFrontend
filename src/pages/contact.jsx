import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation avec Yup
const schema = yup.object({
  username: yup.string().required("Nom d'utilisateur requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  sujet: yup.string().required("Sujet requis"),
  texte: yup.string().required("Texte requis"),
});

// Composant de la page de contact
function Contact() {
  const onSubmit = (data) => {
    console.log("Données de contact :", data);
    // on gèrera la logique de contact plus tard (API)
  };
  // Champs du formulaire
  const fields = [
    { name: "username", label: "Nom d'utilisateur", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "sujet", label: "Sujet", type: "text" },
    { name: "texte", label: "Texte", type: "textarea" },
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
      </Card>
    </>
  );
}

export default Contact;
