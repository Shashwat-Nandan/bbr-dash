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
        return (
          <div
            key={i}
            className="history-card flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5"
            style={{ borderLeftWidth: 3, borderLeftColor: getTeamColor(p.team) }}
          >
            {/* Rank circle */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <span className="text-[11px] font-bold text-white/30">{i + 1}</span>
            </div>

            {/* Date */}
            <div className="flex-shrink-0 hidden sm:block w-[80px]">
              <span className="text-[12px] text-white/30 font-medium">{p.date}</span>
            </div>

            {/* Name + Team */}
            <div className="flex-1 min-w-0 flex items-center gap-2.5">
              <span className="font-semibold text-[14px] truncate">{p.winner}</span>
              <span
                className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide ${getBadgeClass(p.team)}`}
              >
                {p.team}
              </span>
            </div>

            {/* Date on mobile */}
            <div className="flex-shrink-0 sm:hidden">
              <span className="text-[11px] text-white/25">{p.date}</span>
            </div>

            {/* Premium */}
            <div className="flex-shrink-0 text-right">
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
