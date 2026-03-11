import { PotdEntry } from "@/lib/types";

interface PotdHistoryProps {
  history: PotdEntry[];
}

function getTeamColor(team: string): string {
  switch (team.toLowerCase()) {
    case "titans": return "#0586FF";
    case "stalwarts": return "#34D399";
    case "underrated": return "#C084FC";
    default: return "rgba(255,255,255,0.15)";
  }
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
    <div className="flex flex-col gap-2">
      {history.map((p, i) => {
        const premiumFormatted = p.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 });
        const isNumeric = /^\d+$/.test(p.winner);
        const displayName = isNumeric ? `Advisor #${p.winner}` : p.winner;

        return (
          <div
            key={i}
            className="history-row px-4 sm:px-5 py-3.5 flex items-center gap-3 sm:gap-4"
            style={{ borderLeft: `3px solid ${getTeamColor(p.team)}` }}
          >
            {/* Date */}
            <div className="flex-shrink-0 w-[85px]">
              <span className="text-[12px] text-white/35 font-medium">{p.date}</span>
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-[14px] text-white/90">{displayName}</span>
            </div>

            {/* Team badge */}
            <div className="flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getBadgeClass(p.team)}`}>
                {p.team}
              </span>
            </div>

            {/* Premium */}
            <div className="flex-shrink-0 w-[90px] text-right">
              <span className="font-bold text-brand-gold text-[14px]">
                &#8377;{premiumFormatted}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
