import { useState } from "react";
import Card from "../components/layout/Card";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, FileText, HelpCircle } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Comment puis-je créer un compte ?",
    answer:
      "Cliquez sur le bouton 'Inscription' en haut à droite. Remplissez simplement le formulaire avec votre pseudo, email et mot de passe pour rejoindre l'arène.",
  },
  {
    id: 2,
    question: "Comment placer un pari ?",
    answer:
      "Rendez-vous dans la section 'Matchs' ou 'Tournois'. Sélectionnez une rencontre active, choisissez l'équipe sur laquelle vous voulez miser et validez le montant. Bonne chance !",
  },
  {
    id: 3,
    question: "Puis-je retirer mes gains ?",
    answer:
      "Absolument. Une fois le match terminé et les résultats validés par nos admins, vos gains sont crédités sur votre cagnotte virtuelle. Vous pouvez gérer votre solde depuis votre Profil.",
  },
  {
    id: 4,
    question: "Est-ce de l'argent réel ?",
    answer:
      "Non, E-sport Evolution est une plateforme de simulation. Nous utilisons une monnaie virtuelle pour le fun et la compétition, sans risque financier réel.",
  },
];

function Faq() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* GROS TITRE HERO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-4">
          <HelpCircle className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />
          CENTRE D'AIDE
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Toutes les réponses pour maîtriser la plateforme.
        </p>
      </div>

      <Card
        glow="purple"
        className="bg-slate-900/80 backdrop-blur-sm"
        // On enlève le titre par défaut de la card pour le gérer nous-même plus haut
      >
        <div className="flex flex-col gap-4">
          {/* LIEN CGU STYLE BANNIÈRE */}
          <Link
            to="/conditions"
            className="group flex items-center justify-between p-4 mb-4 rounded-lg bg-purple-900/20 border border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-full text-white shadow-lg">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                  Conditions Générales
                </h3>
                <p className="text-xs text-gray-400">
                  Règlement et utilisation du site
                </p>
              </div>
            </div>
            <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
              ➔
            </div>
          </Link>

          {/* LISTE DES QUESTIONS */}
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`
                  border rounded-xl overflow-hidden transition-all duration-300
                  ${
                    isOpen
                      ? "bg-slate-800 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                      : "bg-slate-800/40 border-white/5 hover:border-white/20 hover:bg-slate-800/60"
                  }
                `}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 flex justify-between items-center text-left"
                >
                  <span
                    className={`font-bold text-lg transition-colors ${
                      isOpen ? "text-purple-400" : "text-gray-200"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Icône animée */}
                  <div
                    className={`p-1 rounded-full transition-all duration-300 ${
                      isOpen ? "bg-purple-600 rotate-180" : "bg-slate-700"
                    }`}
                  >
                    <ChevronDown className={`w-5 h-5 text-white`} />
                  </div>
                </button>

                {/* Réponse avec animation simple */}
                <div
                  className={`
                    px-5 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                    }
                  `}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* FOOTER DE SECTION */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        Une question non traitée ?{" "}
        <Link
          to="/contact"
          className="text-purple-400 font-bold hover:underline"
        >
          Contactez le support
        </Link>
      </div>
    </div>
  );
}

export default Faq;
