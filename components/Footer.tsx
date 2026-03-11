interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.04] mt-auto">
      <div className="max-w-[1280px] mx-auto px-8 py-6 flex items-center justify-between text-[11px] text-white/20">
        <span>Bliss Battle Royale &middot; Ditto Insurance</span>
        {lastUpdated && <span>Updated {lastUpdated}</span>}
      </div>
    </footer>
  );
}
