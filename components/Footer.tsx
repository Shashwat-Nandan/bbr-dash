interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="mt-16">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="text-center py-8 px-6">
        <div className="text-[11px] text-white/20 flex items-center justify-center gap-2 flex-wrap">
          <span>Bliss Battle Royale</span>
          <span className="text-white/10">/</span>
          <span>March 2026</span>
          <span className="text-white/10">/</span>
          <span className="text-brand-blue/40">Ditto Insurance</span>
          {lastUpdated && (
            <>
              <span className="text-white/10">/</span>
              <span>Updated {lastUpdated}</span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
