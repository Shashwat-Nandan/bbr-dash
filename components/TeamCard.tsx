import { TeamStanding } from "@/lib/types";

interface TeamCardProps {
  team: TeamStanding;
  maxPoints: number;
}

function getTeamColor(name: string): string {
  switch (name.toLowerCase()) {
    case "titans": return "#0586FF";
    case "stalwarts": return "#34D399";
    case "underrated": return "#C084FC";
    default: return "#fff";
  }
}

export default function TeamCard({ team, maxPoints }: TeamCardProps) {
  const isFirst = team.rank === 1;
  const barWidth = maxPoints > 0 ? Math.round((team.total_points / maxPoints) * 100) : 0;
  const goldenBarWidth = Math.round((team.golden_points / 6) * 100);
  const color = getTeamColor(team.name);

  return (
    <div className={`team-card ${isFirst ? "team-card-champion" : ""} p-6 sm:p-7`}>
      {/* Top color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[18px]"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }}
      />

      {/* Header row: rank + name + advisor count */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-[family-name:var(--font-bebas)] text-[18px]"
              style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}25`,
              }}
            >
              {team.rank}
            </div>
            <h3
              className="font-[family-name:var(--font-bebas)] text-[28px] sm:text-[32px] tracking-[2px] leading-none"
              style={isFirst ? { color } : {}}
            >
              {team.name}
            </h3>
          </div>
          <div className="text-[12px] text-white/30 ml-[42px]">
            {team.considered_count} advisors
          </div>
        </div>

        {/* Big points number */}
        <div className="text-right">
          <div className="font-[family-name:var(--font-bebas)] text-[40px] sm:text-[44px] leading-none" style={{ color }}>
            {team.total_points}
          </div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
            Points
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="points-bar mb-6">
        <div className="points-bar-fill" style={{ width: `${barWidth}%`, background: color }} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-pill">
          <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mb-1">Normal</div>
          <div className="text-[18px] font-bold text-white/90">{team.normal_points}</div>
        </div>
        <div className="stat-pill">
          <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mb-1">Golden</div>
          <div className="text-[18px] font-bold text-brand-gold">{team.golden_points}</div>
        </div>
        <div className="stat-pill">
          <div className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mb-1">Premium</div>
          <div className="text-[18px] font-bold text-white/90">
            {team.premiums_cr}<span className="text-[12px] text-white/30 ml-0.5">Cr</span>
          </div>
        </div>
      </div>

      {/* Golden progress */}
      {team.golden_points > 0 && (
        <div className="mt-4">
          <div className="points-bar">
            <div className="points-bar-fill bg-brand-gold" style={{ width: `${goldenBarWidth}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
