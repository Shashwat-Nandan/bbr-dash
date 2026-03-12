import { auth } from "@/lib/auth";
import { getLatestData } from "@/lib/data";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import StandingsGrid from "@/components/StandingsGrid";
import PotdHero from "@/components/PotdHero";
import PotdHistory from "@/components/PotdHistory";
import PurpleCapHero, { computePurpleCapLeader } from "@/components/PurpleCapHero";
import NoData from "@/components/NoData";
import Footer from "@/components/Footer";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await getLatestData();
  const user = session.user;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <Navbar user={user} />

      <main className="flex-1 w-full max-w-[1320px] mx-auto" style={{ padding: "48px 24px 64px" }}>
        {data ? (
          <>
            {/* ── Header ── */}
            <div className="text-center" style={{ marginBottom: 56 }}>
              <div
                className="inline-flex items-center gap-2 rounded-full"
                style={{
                  padding: "7px 18px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#60A5FA",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  marginBottom: 20,
                }}
              >
                <span
                  className="inline-block w-[7px] h-[7px] rounded-full bg-brand-blue animate-pulse"
                />
                Live &middot; March 2026
              </div>

              <h2
                className="font-[family-name:var(--font-bebas)]"
                style={{
                  fontSize: "clamp(42px, 5vw, 56px)",
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                }}
              >
                DAILY STANDINGS
              </h2>

              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 12 }}>
                Updated as of{" "}
                <span style={{ color: "#FBBF24", fontWeight: 600 }}>{data.as_of_date}</span>
              </p>
            </div>

            {/* ── Team Standings ── */}
            <StandingsGrid standings={data.team_standings} />

            {/* ── Divider ── */}
            <div
              className="mx-auto"
              style={{
                margin: "64px auto",
                maxWidth: 600,
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />

            {/* ── Player of the Day Section ── */}
            <section style={{ marginBottom: 64 }}>
              {/* Section header */}
              <div className="flex items-center gap-4" style={{ marginBottom: 28 }}>
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.15)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L9 9H2l5.5 4.5L5.5 22 12 17l6.5 5-2-8.5L22 9h-7L12 2z" fill="#FBBF24" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-[family-name:var(--font-bebas)]"
                    style={{ fontSize: 30, letterSpacing: "0.08em", lineHeight: 1 }}
                  >
                    PLAYER OF THE DAY
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                    Highest daily premium collector
                  </p>
                </div>
              </div>

              {/* Hero */}
              {data.latest_potd && (
                <PotdHero potd={data.latest_potd} advisorMap={data.advisor_map} />
              )}

              {/* History */}
              {data.potd_history.length > 1 && (
                <div style={{ marginTop: 36 }}>
                  <h4 style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    marginBottom: 14,
                    paddingLeft: 4,
                  }}>
                    Previous Winners
                  </h4>
                  <PotdHistory
                    history={data.potd_history.slice(1)}
                    advisorMap={data.advisor_map}
                  />
                </div>
              )}
            </section>

            {/* ── Purple Cap Leader Section ── */}
            {(() => {
              const purpleCapLeader = computePurpleCapLeader(data.potd_history, data.advisor_map);
              if (!purpleCapLeader || purpleCapLeader.wins < 2) return null;
              return (
                <>
                  {/* Divider */}
                  <div
                    className="mx-auto"
                    style={{
                      margin: "0 auto 64px",
                      maxWidth: 600,
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                    }}
                  />

                  <section style={{ marginBottom: 64 }}>
                    <div className="flex items-center gap-4" style={{ marginBottom: 28 }}>
                      <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{
                          width: 44,
                          height: 44,
                          background: "rgba(167,139,250,0.1)",
                          border: "1px solid rgba(167,139,250,0.15)",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="#A78BFA" />
                          <path d="M19 19H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" fill="#A78BFA" opacity="0.4" />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className="font-[family-name:var(--font-bebas)]"
                          style={{ fontSize: 30, letterSpacing: "0.08em", lineHeight: 1 }}
                        >
                          PURPLE CAP LEADER
                        </h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                          Most Player of the Day awards this month
                        </p>
                      </div>
                    </div>

                    <PurpleCapHero leader={purpleCapLeader} />
                  </section>
                </>
              );
            })()}
          </>
        ) : (
          <NoData isAdmin={user.isAdmin} />
        )}
      </main>

      <Footer lastUpdated={data?.last_updated} />
    </div>
  );
}
