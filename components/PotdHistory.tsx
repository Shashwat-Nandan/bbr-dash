import { PotdEntry } from "@/lib/types";

interface PotdHistoryProps {
  history: PotdEntry[];
}

function getTeamColor(team: string): string {
  switch (team.toLowerCase()) {
    case "titans": return "#0586FF";
    case "stalwarts": return "#34D399";
    case "underrated": return "#C084FC";
    default: return "rgba(255,255,255,0.2)";
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
    <div className="mt-6 flex flex-col gap-2.5">
      {history.map((p, i) => (
        <div
          key={i}
          className="group relative flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] px-5 py-4 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/10"
          style={{ borderLeftWidth: 3, borderLeftColor: getTeamColor(p.team) }}
        >
          {/* Rank number */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
            <span className="text-[11px] font-bold text-white/40">{i + 1}</span>
          </div>

          {/* Date */}
          <div className="flex-shrink-0 w-[72px]">
            <span className="text-[13px] text-white/40 font-medium">{p.date}</span>
          </div>

          {/* Advisor name + team badge */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="font-semibold text-[15px] truncate">{p.winner}</span>
            <span
              className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide ${getBadgeClass(p.team)}`}
            >
              {p.team}
            </span>
          </div>

          {/* Premium amount */}
          <div className="flex-shrink-0 text-right">
            <span className="font-bold text-brand-gold text-[15px]">
              &#8377;{p.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
