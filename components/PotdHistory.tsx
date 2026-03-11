import { PotdEntry } from "@/lib/types";

interface PotdHistoryProps {
  history: PotdEntry[];
  advisorMap?: Record<string, string>;
}

function teamColor(team: string): string {
  switch (team.toLowerCase()) {
    case "titans":    return "#3B82F6";
    case "stalwarts": return "#10B981";
    case "underrated":return "#A78BFA";
    default:          return "rgba(255,255,255,0.15)";
  }
}

function badgeClass(team: string): string {
  switch (team.toLowerCase()) {
    case "titans":    return "badge-titans";
    case "stalwarts": return "badge-stalwarts";
    case "underrated":return "badge-underrated";
    default:          return "badge-titans";
  }
}

function resolveName(p: PotdEntry, map?: Record<string, string>): string {
  if (p.winner && !/^\d+$/.test(p.winner)) return p.winner;
  if (map && p.tact_id && map[p.tact_id]) return map[p.tact_id];
  if (map && p.winner && map[p.winner]) return map[p.winner];
  return p.winner || p.tact_id || "—";
}

export default function PotdHistory({ history, advisorMap }: PotdHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {history.map((p, i) => {
        const name = resolveName(p, advisorMap);
        const premium = p.premiums.toLocaleString("en-IN", { maximumFractionDigits: 0 });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 20px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderLeft: `3px solid ${teamColor(p.team)}`,
              borderRadius: 14,
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            className="hover:!bg-[#181E34]"
          >
            {/* Date */}
            <div style={{ flexShrink: 0, width: 90 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                {p.date}
              </span>
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                {name}
              </span>
            </div>

            {/* Team */}
            <div style={{ flexShrink: 0 }}>
              <span
                className={`${badgeClass(p.team)} rounded-md font-semibold uppercase`}
                style={{ fontSize: 10, padding: "3px 10px", letterSpacing: "0.08em" }}
              >
                {p.team}
              </span>
            </div>

            {/* Premium */}
            <div style={{ flexShrink: 0, width: 100, textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#FBBF24" }}>
                &#8377;{premium}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
