import { PotdEntry } from "@/lib/types";

interface PotdHistoryProps {
  history: PotdEntry[];
}

function getBadgeClass(team: string): string {
  switch (team.toLowerCase()) {
    case "titans": return "badge-titans";
    case "stalwarts": return "badge-stalwarts";
    case "underrated": return "badge-underrated";
    default: return "bg-white/10 text-white/60";
  }
}

export default function PotdHistory({ history }: PotdHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-5">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Winner</th>
            <th>Team</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {history.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td className="font-semibold">{p.winner}</td>
              <td>
                <span
                  className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide ${getBadgeClass(p.team)}`}
                >
                  {p.team}
                </span>
              </td>
              <td className="font-semibold text-brand-gold">
                &#8377;{p.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
