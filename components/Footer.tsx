interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <div className="mt-10 border-t border-white/10">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
      <div className="text-center py-8 text-xs text-white/30">
        Bliss Battle Royale &middot; March 2026 &middot; Ditto Insurance
        {lastUpdated && <> &middot; Last updated: {lastUpdated}</>}
      </div>
    </div>
  );
}
