import { useState } from "react";
import Card from "../components/layout/Card";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: 1,
    question: "Comment puis-je créer un compte ?",
    answer:
      "Cliquez sur le bouton 'Inscription' en haut à droite et remplissez le formulaire avec vos informations.",
  },
  {
    id: 2,
    question: "Comment placer un pari ?",
    answer:
      "Allez dans la section 'Paris', choisissez un match et sélectionnez votre équipe favorite pour valider votre pari.",
  },
  {
    id: 3,
    question: "Puis-je retirer mes gains ?",
    answer:
      "Oui ! Une fois vos gains confirmés, vous pouvez les retirer depuis la page 'Mes gains'.",
  },
];

function Faq() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="sr-only">FAQ</h1>

      <Card title="FAQ" subtitle="Questions fréquentes">
        <div className="flex flex-col gap-4">
          <Link to="/conditions" className="text-purple-600 hover:underline">
            Conditions générales d'utilisation
          </Link>
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 pb-2">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left flex justify-between items-center font-medium text-gray-800 hover:text-purple-600 transition"
              >
                <span>{faq.question}</span>
                <span>{openId === faq.id ? "−" : "+"}</span>
              </button>
              {openId === faq.id && (
                <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Faq;
