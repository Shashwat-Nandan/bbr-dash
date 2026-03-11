import { PotdEntry } from "@/lib/types";

interface PotdHeroProps {
  potd: PotdEntry;
}

export default function PotdHero({ potd }: PotdHeroProps) {
  const premiumK = Math.round(potd.premiums / 1000);
  const premiumFormatted = potd.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="potd-hero relative overflow-hidden rounded-[20px] border border-purple-500/25 bg-gradient-to-br from-purple-500/15 to-brand-blue/10 p-9 px-10 flex items-center justify-between gap-6 max-md:flex-col max-md:text-center">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 potd-shimmer pointer-events-none" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9B59B6] to-brand-blue" />

      <div className="flex-1 relative">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2px] uppercase text-purple/100 bg-purple/15 px-3.5 py-1.5 rounded-full mb-3">
          {/* Crown SVG */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-brand-gold">
            <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.83 10l-2.13-5.34c-.32-.8-1.24-1.19-2.04-.87-.56.22-.94.72-1.04 1.3L8.48 10l-5.4-1.42c-.8-.21-1.62.27-1.83 1.07-.16.6.04 1.22.5 1.58l4.68 3.56-1.28 5.2h14.7l-1.28-5.2 4.68-3.56c.46-.36.66-.97.5-1.58h-.18z" fill="currentColor"/>
          </svg>
          Purple Cap Holder
        </div>
        <div className="font-[family-name:var(--font-bebas)] text-[42px] tracking-[2px] leading-tight">
          {potd.winner.toUpperCase()}
        </div>
        <div className="mt-2 text-sm text-white/60 flex gap-5 flex-wrap max-md:justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">Team:</span>
            <span className="font-semibold text-brand-blue">{potd.team}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">ID:</span>
            <span className="font-semibold">{potd.tact_id}</span>
          </div>
        </div>
      </div>

      <div className="text-right max-md:text-center relative">
        <div className="text-[13px] text-white/30">{potd.date}</div>
        <div className="font-[family-name:var(--font-bebas)] text-5xl text-brand-gold leading-none">
          &#8377;{premiumK}K
        </div>
        <div className="text-[13px] text-white/50 mt-0.5">
          &#8377;{premiumFormatted}
        </div>
        <div className="text-[11px] text-white/30 uppercase tracking-wider mt-1">
          Premium Collected
        </div>
      </div>
    </div>
  );
}
