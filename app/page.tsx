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
            {/* Header */}
            <div className="text-center mb-10">
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

            {/* Team Standings */}
            <StandingsGrid standings={data.team_standings} />

            {/* POTD Section */}
            <div className="mb-10">
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-[1.5px] mb-5 flex items-center gap-2.5">
                <span className="text-xl">&#x1F451;</span> PURPLE PLAYER OF THE DAY
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
