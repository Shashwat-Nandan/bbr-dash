import { TeamStanding } from "@/lib/types";

interface TeamCardProps {
  team: TeamStanding;
  maxPoints: number;
}

function getTeamAccent(name: string): { color: string; glow: string } {
  switch (name.toLowerCase()) {
    case "titans": return { color: "#0586FF", glow: "rgba(5,134,255,0.08)" };
    case "stalwarts": return { color: "#34D399", glow: "rgba(52,211,153,0.08)" };
    case "underrated": return { color: "#C084FC", glow: "rgba(192,132,252,0.08)" };
    default: return { color: "#fff", glow: "transparent" };
  }
}

export default function TeamCard({ team, maxPoints }: TeamCardProps) {
  const isFirst = team.rank === 1;
  const barWidth = maxPoints > 0 ? Math.round((team.total_points / maxPoints) * 100) : 0;
  const goldenBarWidth = Math.round((team.golden_points / 6) * 100);
  const accent = getTeamAccent(team.name);

  return (
    <div
      className={`glass-card p-7 sm:p-8 relative overflow-hidden hover:-translate-y-1 ${
        isFirst ? "!border-brand-gold/40 card-glow-gold" : ""
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: isFirst
            ? `linear-gradient(90deg, ${accent.color}, transparent)`
            : `linear-gradient(90deg, ${accent.color}40, transparent)`,
        }}
      />

      {/* Rank watermark */}
      <div
        className={`font-[family-name:var(--font-bebas)] text-[72px] absolute -top-1 right-5 leading-none ${
          isFirst ? "text-brand-gold/[0.07]" : "text-white/[0.03]"
        }`}
      >
        #{team.rank}
      </div>

      {/* Team name + advisor count */}
      <div className="mb-6">
        <div
          className={`font-[family-name:var(--font-bebas)] text-[30px] tracking-[2px] leading-none ${
            isFirst ? "text-brand-gold" : ""
          }`}
        >
          {team.name}
        </div>
        <div className="text-[11px] text-white/25 mt-1.5 flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white/20">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          {team.considered_count} advisors
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3.5">
        {/* Total Points */}
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
            Total Points
          </span>
          <span className="text-2xl font-bold" style={{ color: accent.color }}>
            {team.total_points}
          </span>
        </div>
        <div className="points-bar">
          <div
            className="points-bar-fill"
            style={{ width: `${barWidth}%`, background: accent.color }}
          />
        </div>

        <div className="h-px bg-white/[0.05] my-1" />

        {/* Normal + Golden in a 2-col grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">Normal</div>
            <div className="text-lg font-bold text-white/80">{team.normal_points}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">Golden</div>
            <div className="text-lg font-bold text-brand-gold">{team.golden_points}</div>
          </div>
        </div>

        <div className="points-bar">
          <div
            className="points-bar-fill bg-brand-gold"
            style={{ width: `${goldenBarWidth}%` }}
          />
        </div>

        <div className="h-px bg-white/[0.05] my-1" />

        {/* Premiums */}
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
            Premiums
          </span>
          <span className="text-base font-semibold">
            &#8377;{team.premiums_cr} <span className="text-white/40 text-[12px]">Cr</span>
          </span>
        </div>
      </div>
    </div>
  );
}
