// src/pages/admin/NewMatch.jsx
import React, { useState } from "react";
import Card from "../../components/layout/Card";
import Form from "../../components/ui/Form";

function NewMatch() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [oddsHome, setOddsHome] = useState("");
  const [oddsDraw, setOddsDraw] = useState("");
  const [oddsAway, setOddsAway] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nouveau match :", {
      homeTeam,
      awayTeam,
      matchDate,
      oddsHome,
      oddsDraw,
      oddsAway,
    });
    // Ici tu pourras plus tard faire un fetch POST vers la table matches
  };

  const fields = [
    {
      label: "Équipe à domicile",
      name: "homeTeam",
      value: homeTeam,
      onChange: (e) => setHomeTeam(e.target.value),
      required: true,
    },
    {
      label: "Équipe à l'extérieur",
      name: "awayTeam",
      value: awayTeam,
      onChange: (e) => setAwayTeam(e.target.value),
      required: true,
    },
    {
      label: "Date et heure du match",
      name: "matchDate",
      type: "datetime-local",
      value: matchDate,
      onChange: (e) => setMatchDate(e.target.value),
      required: true,
    },
    {
      label: "Cote équipe domicile",
      name: "oddsHome",
      value: oddsHome,
      onChange: (e) => setOddsHome(e.target.value),
      required: true,
    },
    {
      label: "Cote match nul",
      name: "oddsDraw",
      value: oddsDraw,
      onChange: (e) => setOddsDraw(e.target.value),
      required: true,
    },
    {
      label: "Cote équipe extérieure",
      name: "oddsAway",
      value: oddsAway,
      onChange: (e) => setOddsAway(e.target.value),
      required: true,
    },
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
          onSubmit={handleSubmit}
          submitLabel="Créer le match"
        />
      </Card>
    </div>
  );
}

export default NewMatch;
