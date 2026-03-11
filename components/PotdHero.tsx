import { PotdEntry } from "@/lib/types";

interface PotdHeroProps {
  potd: PotdEntry;
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

  // If winner looks like a numeric ID, display it differently
  const isNumericWinner = /^\d+$/.test(potd.winner);
  const displayName = isNumericWinner ? `Advisor #${potd.winner}` : potd.winner;

  return (
    <div className="potd-hero overflow-hidden">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9B59B6] via-[#C084FC] to-[#0586FF]" />

      <div className="relative z-10 p-7 sm:p-9 flex items-center justify-between gap-8 max-md:flex-col max-md:text-center">
        {/* Left: Winner */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="section-badge bg-purple/10 border border-purple/20 text-purple mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-brand-gold">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="currentColor"/>
              <path d="M19 19H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" fill="currentColor" opacity="0.5"/>
            </svg>
            Purple Cap Holder
          </div>

          {/* Name */}
          <h2 className="font-[family-name:var(--font-bebas)] text-[42px] sm:text-[52px] tracking-[2px] leading-[0.9] mb-3">
            {displayName.toUpperCase()}
          </h2>

          {/* Team + Date */}
          <div className="flex items-center gap-3 flex-wrap max-md:justify-center">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${getBadgeClass(potd.team)}`}>
              {potd.team}
            </span>
            <span className="text-[13px] text-white/30">{potd.date}</span>
          </div>
        </div>

        {/* Right: Premium */}
        <div className="flex-shrink-0 text-right max-md:text-center">
          <div className="font-[family-name:var(--font-bebas)] text-[60px] sm:text-[72px] leading-none text-brand-gold">
            &#8377;{premiumK}K
          </div>
          <div className="text-[14px] text-white/40 font-medium mt-1">
            &#8377;{premiumFormatted}
          </div>
          <div className="text-[10px] text-white/25 uppercase tracking-[2px] mt-1 font-semibold">
            Premium Collected
          </div>
        </div>
      </div>
    </div>
  );
}
