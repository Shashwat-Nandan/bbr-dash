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

/* Distinct SVG icon per team */
function TeamLogo({ name, color, size = 28 }: { name: string; color: string; size?: number }) {
  switch (name.toLowerCase()) {
    case "titans":
      // Lightning bolt — power, speed
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M18.5 3L7 18h8l-1.5 11L26 14h-8l.5-11z" fill={color} />
        </svg>
      );
    case "stalwarts":
      // Shield — defense, reliability
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 3L5 8v7c0 7.1 4.7 13.7 11 16 6.3-2.3 11-8.9 11-16V8L16 3z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.8" />
          <path d="M13 16l2.5 2.5L20 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "underrated":
      // Rising star — underdog, ascending
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 4l3.5 7.5L28 13l-6 5.5L23.5 27 16 23l-7.5 4L10 18.5 4 13l8.5-1.5L16 4z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
          <path d="M16 10v8M12 14l4 4 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
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

      {/* ── Header: Logo + Name + Points ── */}
      <div className="flex items-start justify-between" style={{ marginBottom: 28 }}>
        <div className="flex items-start gap-4">
          {/* Team logo */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-2xl"
            style={{
              width: 56,
              height: 56,
              background: c.bg,
              border: `1px solid ${c.main}25`,
            }}
          >
            <TeamLogo name={team.name} color={c.light} size={30} />
          </div>

          {/* Name + rank + count */}
          <div>
            {/* Rank pill */}
            <div
              className="inline-flex items-center rounded-md font-[family-name:var(--font-bebas)] tracking-wider"
              style={{
                fontSize: 13,
                padding: "2px 10px",
                color: c.light,
                background: c.bg,
                border: `1px solid ${c.main}25`,
                marginBottom: 8,
              }}
            >
              RANK {team.rank}
            </div>

            {/* Team name */}
            <h3
              className="font-[family-name:var(--font-bebas)] tracking-[2px] leading-none"
              style={{
                fontSize: 32,
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
        </div>

        {/* Total points — big number */}
        <div className="text-right flex-shrink-0">
          <div
            className="font-[family-name:var(--font-bebas)] leading-none"
            style={{ fontSize: 48, color: c.light, letterSpacing: "0.03em" }}
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
        <div className="stat-block">
          <span className="stat-label">Normal</span>
          <span className="stat-value" style={{ color: "rgba(255,255,255,0.85)" }}>
            {team.normal_points}
          </span>
        </div>

        <div className="stat-block">
          <span className="stat-label">Golden</span>
          <span className="stat-value" style={{ color: "#FBBF24" }}>
            {team.golden_points}
          </span>
        </div>

        <div className="stat-block">
          <span className="stat-label">Premium</span>
          <span className="stat-value" style={{ color: "rgba(255,255,255,0.85)" }}>
            {team.total_premiums >= 10000000
              ? <>{(team.total_premiums / 10000000).toFixed(2)}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginLeft: 2 }}>Cr</span></>
              : <>{(team.total_premiums / 100000).toFixed(1)}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginLeft: 2 }}>L</span></>
            }
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
