import { auth } from "@/lib/auth";
import { getLatestData } from "@/lib/data";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import StandingsGrid from "@/components/StandingsGrid";
import PotdHero from "@/components/PotdHero";
import PotdHistory from "@/components/PotdHistory";
import NoData from "@/components/NoData";
import Footer from "@/components/Footer";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await getLatestData();
  const user = session.user;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 sm:px-8 py-10 sm:py-12">
        {data ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="section-badge bg-brand-blue/10 border border-brand-blue/20 text-brand-blue mb-4 inline-flex">
                <div className="w-[6px] h-[6px] rounded-full bg-brand-blue animate-pulse" />
                Live &middot; March 2026
              </div>
              <h2 className="font-[family-name:var(--font-bebas)] text-[44px] sm:text-[52px] tracking-[4px] leading-none">
                DAILY STANDINGS
              </h2>
              <p className="text-[14px] text-white/35 mt-3">
                Updated as of{" "}
                <span className="text-brand-gold font-semibold">{data.as_of_date}</span>
              </p>
            </div>

            {/* Team Standings */}
            <StandingsGrid standings={data.team_standings} />

            {/* Divider */}
            <div className="my-14 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
            </div>

            {/* POTD Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3.5 mb-7">
                <div className="w-10 h-10 rounded-xl bg-purple/12 border border-purple/20 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple">
                    <path d="M12 2L9 9H2l5.5 4.5L5.5 22 12 17l6.5 5-2-8.5L22 9h-7L12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-bebas)] text-[26px] sm:text-[28px] tracking-[2px] leading-none">
                    PURPLE PLAYER OF THE DAY
                  </h3>
                  <p className="text-[12px] text-white/25 mt-1">Highest daily premium collector</p>
                </div>
              </div>

              {data.latest_potd && <PotdHero potd={data.latest_potd} />}

              {data.potd_history.length > 1 && (
                <div className="mt-8">
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/20 mb-3 ml-1">
                    Previous Winners
                  </div>
                  <PotdHistory history={data.potd_history.slice(1)} />
                </div>
              )}
            </section>
          </>
        ) : (
          <NoData isAdmin={user.isAdmin} />
        )}
      </main>

      <Footer lastUpdated={data?.last_updated} />
    </div>
  );
}
