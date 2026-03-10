import { PotdEntry } from "@/lib/types";

interface PotdHeroProps {
  potd: PotdEntry;
}

export default function PotdHero({ potd }: PotdHeroProps) {
  const premiumK = Math.round(potd.premiums / 1000);

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-purple-500/25 bg-gradient-to-br from-purple-500/15 to-brand-blue/10 p-9 px-10 flex items-center justify-between gap-6 max-md:flex-col max-md:text-center">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9B59B6] to-brand-blue" />

      <div className="flex-1">
        <div className="inline-block text-[11px] font-bold tracking-[2px] uppercase text-purple/100 bg-purple/15 px-3.5 py-1.5 rounded-full mb-3">
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

      <div className="text-right max-md:text-center">
        <div className="text-[13px] text-white/30">{potd.date}</div>
        <div className="font-[family-name:var(--font-bebas)] text-5xl text-brand-gold leading-none">
          &#8377;{premiumK}K
        </div>
        <div className="text-[11px] text-white/30 uppercase tracking-wider">
          Premium Collected
        </div>
      </div>
    </div>
  );
}
