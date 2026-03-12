import { PotdEntry } from "@/lib/types";

export interface PurpleCapLeader {
  name: string;
  team: string;
  wins: number;
  totalPremiums: number;
}

function badgeClass(team: string): string {
  switch (team.toLowerCase()) {
    case "titans":     return "badge-titans";
    case "stalwarts":  return "badge-stalwarts";
    case "underrated": return "badge-underrated";
    default:           return "badge-titans";
  }
}

function resolveName(p: PotdEntry, map?: Record<string, string>): string {
  if (p.winner && !/^\d+$/.test(p.winner)) return p.winner;
  if (map && p.tact_id && map[p.tact_id]) return map[p.tact_id];
  if (map && p.winner && map[p.winner]) return map[p.winner];
  return p.winner || p.tact_id || "—";
}

export function computePurpleCapLeader(
  history: PotdEntry[],
  advisorMap?: Record<string, string>,
): PurpleCapLeader | null {
  if (history.length === 0) return null;

  const countMap = new Map<string, { team: string; wins: number; totalPremiums: number }>();

  for (const entry of history) {
    const name = resolveName(entry, advisorMap);
    const existing = countMap.get(name);
    if (existing) {
      existing.wins += 1;
      existing.totalPremiums += entry.premiums;
    } else {
      countMap.set(name, { team: entry.team, wins: 1, totalPremiums: entry.premiums });
    }
  }

  let leader: PurpleCapLeader | null = null;
  for (const [name, data] of countMap) {
    if (!leader || data.wins > leader.wins || (data.wins === leader.wins && data.totalPremiums > leader.totalPremiums)) {
      leader = { name, team: data.team, wins: data.wins, totalPremiums: data.totalPremiums };
    }
  }

  return leader;
}

function formatPremium(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  return `${(val / 1000).toFixed(0)}K`;
}

export default function PurpleCapHero({ leader }: { leader: PurpleCapLeader }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2D1B69 0%, #1B1340 40%, #0F1428 100%)",
        border: "1px solid rgba(167,139,250,0.2)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: 3,
          background: "linear-gradient(90deg, #9333EA, #A78BFA, #7C3AED)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex items-stretch justify-between gap-10 max-md:flex-col max-md:text-center"
        style={{ padding: "36px 40px" }}
      >
        {/* Left: Leader info */}
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
                textTransform: "uppercase",
                color: "#C4B5FD",
                background: "rgba(167,139,250,0.15)",
                border: "1px solid rgba(167,139,250,0.25)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="#A78BFA" />
                <path d="M19 19H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" fill="#A78BFA" opacity="0.4" />
              </svg>
              Purple Cap Leader
            </span>
          </div>

          {/* Name */}
          <h2
            className="font-[family-name:var(--font-bebas)] leading-[0.92]"
            style={{ fontSize: "clamp(40px, 5vw, 56px)", letterSpacing: "0.06em", color: "#C4B5FD" }}
          >
            {leader.name.toUpperCase()}
          </h2>

          {/* Meta */}
          <div
            className="flex items-center gap-4 flex-wrap max-md:justify-center"
            style={{ marginTop: 16 }}
          >
            <span
              className={`rounded-lg font-semibold uppercase tracking-wider ${badgeClass(leader.team)}`}
              style={{ fontSize: 11, padding: "5px 12px" }}
            >
              {leader.team}
            </span>
          </div>
        </div>

        {/* Right: Stats */}
        <div
          className="flex-shrink-0 flex flex-col items-end justify-center max-md:items-center"
          style={{ minWidth: 160, gap: 12 }}
        >
          {/* Win count */}
          <div className="text-right max-md:text-center">
            <div
              className="font-[family-name:var(--font-bebas)] leading-none"
              style={{ fontSize: "clamp(56px, 7vw, 80px)", letterSpacing: "0.02em", color: "#A78BFA" }}
            >
              {leader.wins}
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginTop: 2,
            }}>
              {leader.wins === 1 ? "POTD Win" : "POTD Wins"}
            </div>
          </div>

          {/* Total premium */}
          <div className="text-right max-md:text-center" style={{ marginTop: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#FBBF24" }}>
              &#8377;{formatPremium(leader.totalPremiums)}
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginTop: 2,
            }}>
              Total Premium
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
