import { TeamStanding } from "@/lib/types";

interface TeamCardProps {
  team: TeamStanding;
  maxPoints: number;
}

function teamColor(name: string) {
  switch (name.toLowerCase()) {
    case "titans":    return { main: "#3B82F6", light: "#60A5FA", bg: "rgba(59,130,246,0.08)" };
    case "stalwarts": return { main: "#10B981", light: "#34D399", bg: "rgba(16,185,129,0.08)" };
    case "underrated":return { main: "#A78BFA", light: "#C4B5FD", bg: "rgba(167,139,250,0.08)" };
    default:          return { main: "#fff",    light: "#fff",    bg: "rgba(255,255,255,0.04)" };
  }
}

export default function TeamCard({ team, maxPoints }: TeamCardProps) {
  const isFirst = team.rank === 1;
  const barPct = maxPoints > 0 ? Math.round((team.total_points / maxPoints) * 100) : 0;
  const goldenPct = Math.min(100, Math.round((team.golden_points / 6) * 100));
  const c = teamColor(team.name);

  return (
    <div
      className={`card ${isFirst ? "glow-gold" : ""}`}
      style={{
        padding: "32px",
        background: isFirst
          ? "linear-gradient(165deg, #1A1A0E 0%, #111627 50%)"
          : "var(--color-surface)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-[20px]"
        style={{
          height: isFirst ? 3 : 2,
          background: `linear-gradient(90deg, ${c.main}, transparent 80%)`,
          opacity: isFirst ? 1 : 0.5,
        }}
      />

      {/* ── Header: Rank + Name ── */}
      <div className="flex items-start justify-between" style={{ marginBottom: 28 }}>
        <div>
          {/* Rank badge */}
          <div
            className="inline-flex items-center justify-center rounded-lg font-[family-name:var(--font-bebas)] text-[18px] tracking-wider"
            style={{
              width: 36,
              height: 36,
              background: c.bg,
              color: c.light,
              border: `1px solid ${c.main}30`,
              marginBottom: 12,
            }}
          >
            #{team.rank}
          </div>

          {/* Team name */}
          <h3
            className="font-[family-name:var(--font-bebas)] tracking-[2px] leading-none"
            style={{
              fontSize: 34,
              color: isFirst ? "#FBBF24" : "#F1F5F9",
            }}
          >
            {team.name.toUpperCase()}
          </h3>

          {/* Advisor count */}
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
            {team.considered_count} advisors considered
          </p>
        </div>

        {/* Total points — big number */}
        <div className="text-right">
          <div
            className="font-[family-name:var(--font-bebas)] leading-none"
            style={{ fontSize: 52, color: c.light, letterSpacing: "0.03em" }}
          >
            {team.total_points}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
            Total Points
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="pbar" style={{ marginBottom: 28 }}>
        <div className="pbar-fill" style={{ width: `${barPct}%`, background: c.main }} />
      </div>

      {/* ── Stats row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
        padding: "20px 0 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Normal Points */}
        <div className="stat-block">
          <span className="stat-label">Normal</span>
          <span className="stat-value" style={{ color: "rgba(255,255,255,0.85)" }}>
            {team.normal_points}
          </span>
        </div>

        {/* Golden Points */}
        <div className="stat-block">
          <span className="stat-label">Golden</span>
          <span className="stat-value" style={{ color: "#FBBF24" }}>
            {team.golden_points}
          </span>
        </div>

        {/* Premiums */}
        <div className="stat-block">
          <span className="stat-label">Premium</span>
          <span className="stat-value" style={{ color: "rgba(255,255,255,0.85)" }}>
            {team.premiums_cr}
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginLeft: 2 }}>Cr</span>
          </span>
        </div>
      </div>

      {/* ── Golden bar ── */}
      {team.golden_points > 0 && (
        <div className="pbar" style={{ marginTop: 16 }}>
          <div className="pbar-fill" style={{ width: `${goldenPct}%`, background: "#FBBF24" }} />
        </div>
      )}
    </div>
  );
}
