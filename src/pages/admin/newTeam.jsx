import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation avec Yup
const schema = yup.object({
  teamName: yup.string().required("Nom de l’équipe requis"),
  game: yup.string().required("Jeu principal requis"),
  description: yup.string().required("Description requise"),
});

// Composant de la page de création d'équipe
function NewTeam() {
  const onSubmit = (data) => {
    console.log("Donnée de la nouvelle équipe :", data);
    // on gèrera la logique de connexion plus tard (API)
  };

  // Champs du formulaire
  const fields = [
    { name: "teamName", label: "Nom de l’équipe", type: "text" },
    { name: "game", label: "Jeu principal", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <>
      <Card
        title="Créez votre équipe"
        subtitle="Rejoignez la communauté e-sport en créant votre propre équipe."
      >
        <Form
          title="Informations de l’équipe"
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Créer"
          resolver={yupResolver(schema)}
        />
      </Card>
    </>
  );
}

export default NewTeam;
