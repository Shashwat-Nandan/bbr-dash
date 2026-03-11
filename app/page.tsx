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

      <main className="max-w-[1280px] mx-auto p-8">
        {data ? (
          <>
            {/* Header with mesh background */}
            <div className="relative text-center mb-12">
              <div className="absolute inset-0 -top-8 -mx-8 bg-gradient-to-b from-brand-blue/[0.04] to-transparent rounded-3xl pointer-events-none" />
              <div className="relative">
                <div className="inline-block text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-blue bg-brand-blue/15 px-4 py-1.5 rounded-full mb-3">
                  March 2026
                </div>
                <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-[2px]">
                  DAILY STANDINGS
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  As of <span className="text-brand-gold font-semibold">{data.as_of_date}</span>
                </p>
              </div>
            </div>

            {/* Team Standings */}
            <StandingsGrid standings={data.team_standings} />

            {/* Section separator */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* POTD Section */}
            <div className="mb-10">
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-[1.5px] mb-5 flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-purple">
                  <path d="M12 2L9 9H2l5.5 4.5L5.5 22 12 17l6.5 5-2-8.5L22 9h-7L12 2z" fill="currentColor" opacity="0.8"/>
                </svg>
                PURPLE PLAYER OF THE DAY
              </h3>

              {data.latest_potd && <PotdHero potd={data.latest_potd} />}
              <PotdHistory history={data.potd_history} />
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
