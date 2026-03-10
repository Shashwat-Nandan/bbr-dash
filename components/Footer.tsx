interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <div className="text-center py-8 text-xs text-white/30 border-t border-white/10 mt-10">
      Bliss Battle Royale &middot; March 2026 &middot; Ditto Insurance
      {lastUpdated && <> &middot; Last updated: {lastUpdated}</>}
    </div>
  );
}
