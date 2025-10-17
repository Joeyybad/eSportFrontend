import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "../components/ui/Form";
import Card from "../components/layout/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Connexion :", { email, password });
  };

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      required: true,
    },
    {
      label: "Mot de passe",
      name: "password",
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      required: true,
    },
  ];

  return (
    <Card title="Connexion" subtitle="Connectez-vous à votre compte.">
      <Form
        title="Connexion"
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Se connecter"
      />
      <p className="text-sm text-gray-600 text-center mt-4">
        Pas encore inscrit ?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Créez un compte ici
        </Link>
      </p>
    </Card>
  );
};

export default Login;
