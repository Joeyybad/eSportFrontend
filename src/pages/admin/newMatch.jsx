import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation avec Yup
const schema = yup.object({
  homeTeam: yup.string().required("Équipe à domicile requise"),
  awayTeam: yup.string().required("Équipe à l'extérieur requise"),
  matchDate: yup
    .date()
    .typeError("Veuillez entrer une date valide")
    .min(new Date(), "La date du match doit être dans le futur")
    .required("Date et heure du match requises"),
  oddsHome: yup
    .number()
    .typeError("La cote doit être un nombre")
    .required("Cote équipe domicile requise"),
  oddsDraw: yup
    .number()
    .typeError("La cote doit être un nombre")
    .required("Cote match nul requise"),
  oddsAway: yup
    .number()
    .typeError("La cote doit être un nombre")
    .required("Cote équipe extérieure requise"),
});

// Composant de la page de création de match
function NewMatch() {
  const onSubmit = (data) => {
    console.log("Nouveau match :", data);
    // On fera un fetch POST vers la table matches
  };

  const fields = [
    { name: "homeTeam", label: "Équipe à domicile", type: "text" },
    { name: "awayTeam", label: "Équipe à l'extérieur", type: "text" },
    {
      name: "matchDate",
      label: "Date et heure du match",
      type: "datetime-local",
    },
    { name: "oddsHome", label: "Cote équipe domicile", type: "number" },
    { name: "oddsDraw", label: "Cote match nul", type: "number" },
    { name: "oddsAway", label: "Cote équipe extérieure", type: "number" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card
        title="Créer un nouveau match"
        subtitle="Configure un match pour que les utilisateurs puissent parier dessus."
      >
        <Form
          title="Informations du match"
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Créer le match"
          resolver={yupResolver(schema)}
        />
      </Card>
    </div>
  );
}

export default NewMatch;
