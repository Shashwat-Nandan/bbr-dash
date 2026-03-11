import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#001829]">
      {/* Large animated orbs */}
      <div className="login-orb-1 fixed w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none -top-[200px] -left-[150px] bg-[#0586FF] opacity-[0.12]" />
      <div className="login-orb-2 fixed w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -bottom-[100px] -right-[100px] bg-[#FFD966] opacity-[0.08]" />
      <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none top-[50%] left-[30%] bg-[#C084FC] opacity-[0.06]" />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-[440px]">
        <div className="login-card py-16 px-10 sm:px-12 text-center relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />

          {/* Logo area */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/25 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0586FF"/>
                </svg>
              </div>
              <span className="font-[family-name:var(--font-bebas)] text-[14px] tracking-[3px] text-white/50 uppercase">
                Ditto Insurance
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-[56px] sm:text-[64px] tracking-[4px] leading-[0.9]">
              BLISS BATTLE
              <br />
              <span className="bg-gradient-to-r from-[#FFD966] to-[#FFAB40] bg-clip-text text-transparent">
                ROYALE
              </span>
            </h1>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/15" />
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-white/25">
              March 2026
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/15" />
          </div>

          {/* CTA */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button type="submit" className="login-btn w-full max-w-[280px] inline-flex items-center justify-center gap-3 font-semibold text-[15px] px-8 py-4 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-8 text-[12px] text-white/20">
            Access restricted to{" "}
            <span className="text-brand-gold/50 font-semibold">@joinditto.in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
