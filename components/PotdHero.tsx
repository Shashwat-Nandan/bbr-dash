import { PotdEntry } from "@/lib/types";

interface PotdHeroProps {
  potd: PotdEntry;
}

function getTeamAccent(team: string): string {
  switch (team.toLowerCase()) {
    case "titans": return "#0586FF";
    case "stalwarts": return "#34D399";
    case "underrated": return "#C084FC";
    default: return "#0586FF";
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

export default function PotdHero({ potd }: PotdHeroProps) {
  const premiumK = Math.round(potd.premiums / 1000);
  const premiumFormatted = potd.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const teamColor = getTeamAccent(potd.team);

  return (
    <div className="potd-shimmer relative overflow-hidden rounded-[22px] border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] via-transparent to-brand-blue/[0.06]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9B59B6] via-purple to-brand-blue" />

      <div className="relative p-8 sm:p-10 flex items-center justify-between gap-8 max-md:flex-col max-md:text-center">
        {/* Left — Winner info */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2px] uppercase bg-purple/10 border border-purple/15 px-3.5 py-1.5 rounded-full mb-4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-brand-gold">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="currentColor"/>
              <path d="M19 19H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" fill="currentColor" opacity="0.5"/>
            </svg>
            <span className="text-purple">Purple Cap Holder</span>
          </div>

          <div className="font-[family-name:var(--font-bebas)] text-[44px] sm:text-[48px] tracking-[2px] leading-[0.95]">
            {potd.winner.toUpperCase()}
          </div>

          <div className="mt-3 flex items-center gap-3 flex-wrap max-md:justify-center">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide ${getBadgeClass(potd.team)}`}>
              {potd.team}
            </span>
            <span className="text-[13px] text-white/30">
              ID: <span className="text-white/50 font-medium">{potd.tact_id}</span>
            </span>
          </div>
        </div>

        {/* Right — Premium */}
        <div className="flex-shrink-0 text-right max-md:text-center">
          <div className="text-[12px] text-white/30 uppercase tracking-wider mb-1">{potd.date}</div>
          <div className="font-[family-name:var(--font-bebas)] text-[56px] sm:text-[64px] leading-none" style={{ color: teamColor }}>
            &#8377;{premiumK}K
          </div>
          <div className="text-[13px] text-white/40 font-medium mt-1">
            &#8377;{premiumFormatted}
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-[1.5px] mt-1">
            Premium Collected
          </div>
        </div>
      </div>
    </div>
  );
}
