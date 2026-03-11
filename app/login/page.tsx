import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-[#00233C]">
      {/* Animated background orbs */}
      <div className="orb-1 fixed w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none -top-[100px] -left-[50px] bg-brand-blue" />
      <div className="orb-2 fixed w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none -bottom-[150px] -right-[100px] bg-brand-gold" />
      <div className="orb-3 fixed w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none top-[40%] left-[60%] bg-purple" />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-[92%] max-w-[420px]">
        {/* Glow behind card */}
        <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

        <div className="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-[28px] py-14 px-10 text-center backdrop-blur-2xl overflow-hidden">
          {/* Inner shimmer accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Ditto brand */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            <span className="font-[family-name:var(--font-bebas)] text-[13px] tracking-[3px] text-brand-blue/80 uppercase">
              Ditto Insurance
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-bebas)] text-[52px] tracking-[3px] leading-[0.95] mb-2">
            BLISS BATTLE
            <br />
            <span className="text-brand-gold">ROYALE</span>
          </h1>

          {/* Decorative line */}
          <div className="flex items-center gap-3 justify-center my-5">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-white/30">
              March 2026
            </div>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <p className="text-[14px] text-white/40 mb-10">
            Live Competition Dashboard
          </p>

          {/* Sign in button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="group relative inline-flex items-center gap-3 bg-white text-gray-800 font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(5,134,255,0.25)]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-8 text-[12px] text-white/25">
            Restricted to <span className="text-brand-gold/60 font-medium">@joinditto.in</span> accounts
          </p>
        </div>
      </div>
    </div>
  );
}
