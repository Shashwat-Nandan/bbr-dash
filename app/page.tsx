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
    <>
      <Navbar user={user} />

      <main className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
        {data ? (
          <>
            {/* Header */}
            <div className="relative text-center mb-14 animate-fade-in-up">
              {/* Ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-brand-blue/[0.04] rounded-full blur-[80px] pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[2px] uppercase text-brand-blue bg-brand-blue/10 border border-brand-blue/15 px-4 py-1.5 rounded-full mb-4">
                  <div className="w-1 h-1 rounded-full bg-brand-blue animate-pulse" />
                  March 2026
                </div>
                <h2 className="font-[family-name:var(--font-bebas)] text-[42px] tracking-[3px] leading-none">
                  DAILY STANDINGS
                </h2>
                <p className="text-[14px] text-white/40 mt-2">
                  As of <span className="text-brand-gold font-semibold">{data.as_of_date}</span>
                </p>
              </div>
            </div>

            {/* Team Standings */}
            <div className="animate-fade-in-up animate-delay-1">
              <StandingsGrid standings={data.team_standings} />
            </div>

            {/* Section divider */}
            <div className="flex items-center gap-4 my-14">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-purple/40" />
                <div className="w-1 h-1 rounded-full bg-purple/60" />
                <div className="w-1 h-1 rounded-full bg-purple/40" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            </div>

            {/* POTD Section */}
            <div className="mb-10 animate-fade-in-up animate-delay-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple/10 border border-purple/15 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-purple">
                    <path d="M12 2L9 9H2l5.5 4.5L5.5 22 12 17l6.5 5-2-8.5L22 9h-7L12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-bebas)] text-[24px] tracking-[2px] leading-none">
                    PURPLE PLAYER OF THE DAY
                  </h3>
                  <p className="text-[12px] text-white/30 mt-0.5">Top premium collector each day</p>
                </div>
              </div>

              {data.latest_potd && <PotdHero potd={data.latest_potd} />}

              {data.potd_history.length > 1 && (
                <div className="mt-8">
                  <div className="text-[11px] font-semibold tracking-[1.5px] uppercase text-white/25 mb-3 pl-1">
                    Previous Winners
                  </div>
                  <PotdHistory history={data.potd_history.slice(1)} />
                </div>
              )}
            </div>
          </>
        ) : (
          <NoData isAdmin={user.isAdmin} />
        )}
      </main>

      <Footer lastUpdated={data?.last_updated} />
    </>
  );
}
