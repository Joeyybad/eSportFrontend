import React, { useState } from "react";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";

function NewTeam() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nouvelle équipe :", { teamName, description });
  };

  const fields = [
    {
      label: "Nom de l’équipe",
      name: "teamName",
      value: teamName,
      onChange: (e) => setTeamName(e.target.value),
      required: true,
    },
    {
      label: "Description",
      name: "description",
      value: description,
      onChange: (e) => setDescription(e.target.value),
      placeholder: "Décrivez brièvement votre équipe",
    },
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
          onSubmit={handleSubmit}
          submitLabel="Créer"
        />
      </Card>
    </>
  );
}

export default NewTeam;
