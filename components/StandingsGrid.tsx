import { TeamStanding } from "@/lib/types";
import TeamCard from "./TeamCard";

interface StandingsGridProps {
  standings: TeamStanding[];
}

export default function StandingsGrid({ standings }: StandingsGridProps) {
  const maxPoints = standings.length > 0 ? standings[0].total_points || 1 : 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {standings.map((team) => (
        <TeamCard key={team.name} team={team} maxPoints={maxPoints} />
      ))}
    </div>
  );
}
