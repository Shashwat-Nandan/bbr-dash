interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div
        className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4"
        style={{ padding: "20px 24px", fontSize: 12, color: "rgba(255,255,255,0.2)" }}
      >
        <span>Bliss Battle Royale &middot; Ditto Insurance</span>
        {lastUpdated && <span>Updated {lastUpdated}</span>}
      </div>
    </footer>
  );
}
