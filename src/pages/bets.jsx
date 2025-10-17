import { Link } from "react-router-dom";
import Card from "../components/layout/Card";
import Button from "../components/ui/Button";

const matches = [
  {
    id: "1",
    homeTeam: "Team Alpha",
    awayTeam: "Team Omega",
    date: "2025-10-22 18:00",
  },
  {
    id: "2",
    homeTeam: "Red Dragons",
    awayTeam: "Blue Phoenix",
    date: "2025-10-23 20:30",
  },
  {
    id: "3",
    homeTeam: "Cyber Wolves",
    awayTeam: "Iron Giants",
    date: "2025-10-24 21:00",
  },
];

function Bets() {
  return (
    <>
      <h1 className="sr-only">Paris en cours</h1>

      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 text-center">
        {matches.map((match) => (
          <Card
            key={match.id}
            title={`${match.homeTeam} vs ${match.awayTeam}`}
            subtitle={`Match prévu le ${match.date}`}
            centerHeader={false}
          >
            <p className="mb-3">
              Clique pour voir le match et placer ton pari :
            </p>
            <div className="flex gap-3 justify-center">
              <Link to={`/bet/${match.id}`}>
                <Button text="Voir le match" color="grey" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Bets;
