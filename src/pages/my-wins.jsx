import Card from "../components/layout/Card";
import Button from "../components/ui/Button";

// Données mockées de gains
const wins = [
  {
    id: 1,
    match: "Team Alpha vs Team Omega",
    date: "2025-10-10 18:00",
    amount: 35.5,
    result: "Gagné",
  },
  {
    id: 2,
    match: "Red Dragons vs Blue Phoenix",
    date: "2025-10-08 20:30",
    amount: 0,
    result: "Perdu",
  },
  {
    id: 3,
    match: "Cyber Wolves vs Iron Giants",
    date: "2025-10-02 21:00",
    amount: 12.75,
    result: "Gagné",
  },
];

// Calcul du total gagné
const totalWins = wins.reduce((sum, g) => sum + g.amount, 0);

function MyWins() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
      {/* --- Résumé global --- */}
      <Card
        title="Mes Gains"
        subtitle="Bilan de vos paris récents"
        centerHeader={true}
      >
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Total des gains :{" "}
          <span className="text-purple-600">{totalWins.toFixed(2)} €</span>
        </p>
        <Button
          text="Retirer mes gains"
          color="#9333EA"
          onClick={() => alert("Fonction de retrait à venir 💸")}
        />
      </Card>

      {/* --- Historique des gains --- */}
      <Card title="Historique de mes paris" centerHeader={false}>
        <div className="flex flex-col gap-3">
          {wins.map((win) => (
            <div
              key={win.id}
              className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm"
            >
              <div className="text-left">
                <p className="font-medium text-gray-800">{win.match}</p>
                <p className="text-gray-500 text-xs">{win.date}</p>
              </div>
              <div
                className={`font-semibold ${
                  win.result === "Gagné" ? "text-green-600" : "text-red-500"
                }`}
              >
                {win.result === "Gagné" ? `+${win.amount} €` : "Perdu"}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default MyWins;
