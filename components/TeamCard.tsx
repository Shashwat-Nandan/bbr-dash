import { TeamStanding } from "@/lib/types";

interface TeamCardProps {
  team: TeamStanding;
  maxPoints: number;
}

export default function TeamCard({ team, maxPoints }: TeamCardProps) {
  const isFirst = team.rank === 1;
  const barWidth = maxPoints > 0 ? Math.round((team.total_points / maxPoints) * 100) : 0;
  const goldenBarWidth = Math.round((team.golden_points / 6) * 100);

  return (
    <div
      className={`glass-card p-7 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 ${
        isFirst ? "!border-brand-gold" : ""
      }`}
    >
      {/* Gold top line for rank 1 */}
      {isFirst && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-gold to-transparent" />
      )}

      {/* Rank watermark */}
      <div
        className={`font-[family-name:var(--font-bebas)] text-[64px] absolute top-4 right-6 leading-none ${
          isFirst ? "text-brand-gold/10" : "text-white/5"
        }`}
      >
        #{team.rank}
      </div>

      {/* Team name */}
      <div
        className={`font-[family-name:var(--font-bebas)] text-[28px] tracking-[2px] mb-5 ${
          isFirst ? "text-brand-gold" : ""
        }`}
      >
        {team.name}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3.5">
        {/* Total Points */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
            Total Points
          </span>
          <span className="text-xl font-bold text-brand-blue">{team.total_points}</span>
        </div>
        <div className="points-bar">
          <div
            className="points-bar-fill bg-brand-blue"
            style={{ width: `${barWidth}%` }}
          />
        </div>

        <div className="h-px bg-white/10 my-1" />

        {/* Normal Points */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
            Normal Points
          </span>
          <span className="text-base font-bold">{team.normal_points}</span>
        </div>

        {/* Golden Points */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
            Golden Points
          </span>
          <span className="text-base font-bold text-brand-gold">{team.golden_points}</span>
        </div>
        <div className="points-bar">
          <div
            className="points-bar-fill bg-brand-gold"
            style={{ width: `${goldenBarWidth}%` }}
          />
        </div>

        <div className="h-px bg-white/10 my-1" />

        {/* Premiums */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
            Total Premiums
          </span>
          <span className="text-base font-semibold">&#8377; {team.premiums_cr} Cr</span>
        </div>
      </div>
    </div>
  );
}
