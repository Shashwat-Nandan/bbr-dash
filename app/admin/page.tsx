import { auth } from "@/lib/auth";
import { getLatestData } from "@/lib/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import UploadForm from "@/components/UploadForm";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.isAdmin) redirect("/");

  const data = getLatestData();
  const lastUpdated = data?.last_updated;

  return (
    <>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[rgba(0,35,60,0.85)] backdrop-blur-xl">
        <div>
          <div className="font-[family-name:var(--font-bebas)] text-[11px] tracking-[2px] text-brand-blue uppercase">
            Admin Panel
          </div>
          <h1 className="font-[family-name:var(--font-bebas)] text-[22px] tracking-[1.5px]">
            BLISS BATTLE <span className="text-brand-gold">ROYALE</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-transparent text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all"
          >
            &larr; Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-[640px] mx-auto py-12 px-8">
        <h2 className="font-[family-name:var(--font-bebas)] text-[32px] tracking-[2px] mb-2">
          UPLOAD DATA
        </h2>
        <p className="text-sm text-white/60 mb-8">
          Upload the Bliss Battle Royale Excel file to update the dashboard.
        </p>

        <UploadForm />

        {lastUpdated && (
          <p className="mt-5 text-xs text-white/30 text-center">
            Last updated: <span className="text-brand-gold">{lastUpdated}</span>
          </p>
        )}
      </main>
    </>
  );
}
