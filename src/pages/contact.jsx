import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Form from "../components/ui/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Mail, Send, MessageSquare } from "lucide-react";

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
  const [status, setStatus] = useState("idle"); // 'idle', 'success', 'error'

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
        setStatus("error");
        return;
      }

      setMessage("Message envoyé avec succès ! Nous vous répondrons sous 24h.");
      setStatus("success");
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur");
      setStatus("error");
    }
  };

  const fields = [
    {
      name: "username",
      label: "Nom d'utilisateur",
      type: "text",
      placeholder: "Votre pseudo...",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "contact@exemple.com...",
    },
    {
      name: "sujet",
      label: "Sujet",
      type: "text",
      placeholder: "Problème technique, question...",
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Dites-nous tout...",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* HEADER VISUEL */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-3">
          <Mail className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />
          CONTACT US
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Un bug ? Une suggestion ? L'équipe est à votre écoute.
        </p>
      </div>

      <Card
        glow="purple"
        className="bg-slate-900/80 backdrop-blur-md border border-white/10"
      >
        <div className="p-2">
          <Form
            fields={fields}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            submitLabel={
              <div className="flex items-center gap-2">
                <span>Envoyer le message</span>
                <Send size={14} />
              </div>
            }
            resolver={yupResolver(schema)}
          />
        </div>

        {/* FEEDBACK MESSAGES (Succès / Erreur) */}
        {message && (
          <div
            className={`
                mt-6 p-4 rounded-lg flex items-center justify-center gap-3 border backdrop-blur-sm transition-all duration-500 animate-pulse-slow
                ${
                  status === "success"
                    ? "bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                }
            `}
          >
            {status === "success" ? (
              <MessageSquare size={20} />
            ) : (
              <div className="text-xl">⚠️</div>
            )}
            <span className="font-bold">{message}</span>
          </div>
        )}
      </Card>

      {/* PETIT INFO SUPP */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Vous pouvez aussi nous écrire directement sur{" "}
        <a
          href="mailto:support@esportevo.com"
          className="text-purple-400 hover:text-purple-300 hover:underline"
        >
          support@esportevo.com
        </a>
      </div>
    </div>
  );
}

export default Contact;
