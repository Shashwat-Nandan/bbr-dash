import { PotdEntry } from "@/lib/types";

interface PotdHeroProps {
  potd: PotdEntry;
  advisorMap?: Record<string, string>;
}

function badgeClass(team: string): string {
  switch (team.toLowerCase()) {
    case "titans":    return "badge-titans";
    case "stalwarts": return "badge-stalwarts";
    case "underrated":return "badge-underrated";
    default:          return "badge-titans";
  }
}

function resolveAdvisorName(potd: PotdEntry, map?: Record<string, string>): string {
  // If winner is already a proper name (has letters), use it
  if (potd.winner && !/^\d+$/.test(potd.winner)) return potd.winner;
  // Try resolving from advisor_map via tact_id
  if (map && potd.tact_id && map[potd.tact_id]) return map[potd.tact_id];
  // Try resolving winner as tact_id
  if (map && potd.winner && map[potd.winner]) return map[potd.winner];
  // Fallback
  return potd.winner || potd.tact_id || "—";
}

export default function PotdHero({ potd, advisorMap }: PotdHeroProps) {
  const name = resolveAdvisorName(potd, advisorMap);
  const premiumLakh = Math.round(potd.premiums / 100000);
  const premiumK = Math.round(potd.premiums / 1000);
  const premiumFull = potd.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Choose display format: lakhs if >= 1L, else K
  const premiumShort = premiumLakh >= 1 ? `${premiumLakh}L` : `${premiumK}K`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1B1340 0%, #12183A 40%, #0F1428 100%)",
        border: "1px solid rgba(167,139,250,0.15)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: 3,
          background: "linear-gradient(90deg, #7C3AED, #A78BFA, #3B82F6)",
        }}
      />

      {/* Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 30%, rgba(167,139,250,0.03) 50%, transparent 70%)",
          animation: "potd-shimmer 6s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex items-stretch justify-between gap-10 max-md:flex-col max-md:text-center"
        style={{ padding: "36px 40px" }}
      >
        {/* Left: Winner */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Badge */}
          <div className="mb-5 max-md:flex max-md:justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full"
              style={{
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#C4B5FD",
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="#FBBF24" />
                <path d="M19 19H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" fill="#FBBF24" opacity="0.4" />
              </svg>
              Purple Cap Holder
            </span>
          </div>

          {/* Name */}
          <h2
            className="font-[family-name:var(--font-bebas)] leading-[0.92]"
            style={{ fontSize: "clamp(40px, 5vw, 56px)", letterSpacing: "0.06em" }}
          >
            {name.toUpperCase()}
          </h2>

          {/* Meta: Team + Date */}
          <div
            className="flex items-center gap-4 flex-wrap max-md:justify-center"
            style={{ marginTop: 16 }}
          >
            <span
              className={`rounded-lg font-semibold uppercase tracking-wider ${badgeClass(potd.team)}`}
              style={{ fontSize: 11, padding: "5px 12px" }}
            >
              {potd.team}
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              {potd.date}
            </span>
          </div>
        </div>

        {/* Right: Premium */}
        <div
          className="flex-shrink-0 flex flex-col items-end justify-center max-md:items-center"
          style={{ minWidth: 160 }}
        >
          <div
            className="font-[family-name:var(--font-bebas)] leading-none text-brand-gold"
            style={{ fontSize: "clamp(56px, 7vw, 80px)", letterSpacing: "0.02em" }}
          >
            &#8377;{premiumShort}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 500 }}>
            &#8377;{premiumFull}
          </div>
          <div style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.15em",
            fontWeight: 600,
            marginTop: 8,
          }}>
            Premium Collected
          </div>
        </div>
      </div>
    </div>
  );
}
