import Card from "../components/layout/Card";
import { X, Check } from "lucide-react";

// Exemple de données mock
const bets = [
  {
    id: 1,
    homeTeam: "Team Alpha",
    awayTeam: "Team Omega",
    odds: 1.8,
    date: "2025-10-20 18:00",
    choice: "Team Alpha",
    result: "win", // "win" ou "lose"
  },
  {
    id: 2,
    homeTeam: "Red Dragons",
    awayTeam: "Blue Phoenix",
    odds: 2.1,
    date: "2025-10-21 20:00",
    choice: "Blue Phoenix",
    result: "lose",
  },
  {
    id: 3,
    homeTeam: "Night Hawks",
    awayTeam: "Storm Wolves",
    odds: 1.5,
    date: "2025-10-22 16:30",
    choice: "Storm Wolves",
    result: "win",
  },
];

function MyBets() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="sr-only">Mes paris</h1>

      {bets.map((bet) => (
        <Card
          key={bet.id}
          title={`${bet.homeTeam} vs ${bet.awayTeam}`}
          subtitle={`Date: ${bet.date} | Cote: ${bet.odds}`}
          centerHeader={false}
        >
          <div className="flex items-center justify-between mt-2">
            <p>
              <span className="font-semibold">Mon choix:</span> {bet.choice}
            </p>
            {bet.result === "win" ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : (
              <X className="w-6 h-6 text-red-500" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default MyBets;
