import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #06080F 0%, #0A0E1A 40%, #0F1225 100%)" }}
    >
      {/* Background orbs */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 -top-40 -right-40"
        style={{ background: "#3B82F6", animation: "drift-1 24s ease-in-out infinite" }}
      />
      <div
        className="fixed w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15 -bottom-32 -left-32"
        style={{ background: "#FBBF24", animation: "drift-2 30s ease-in-out infinite" }}
      />
      <div
        className="fixed w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-10 top-1/2 left-1/3"
        style={{ background: "#A78BFA" }}
      />

      {/* Login card */}
      <div className="relative z-10 w-[90%] max-w-[480px]">
        <div
          className="rounded-3xl text-center relative overflow-hidden"
          style={{
            padding: "56px 48px 48px",
            background: "linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(59,130,246,0.4) 50%, transparent 90%)" }}
          />

          {/* ── Brand logo ── */}
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 40 }}>
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 42,
                height: 42,
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#3B82F6" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-bebas)] text-[15px] tracking-[3px] text-white/40 uppercase">
              Ditto Insurance
            </span>
          </div>

          {/* ── Title ── */}
          <h1
            className="font-[family-name:var(--font-bebas)] leading-[0.88]"
            style={{ fontSize: "clamp(54px, 8vw, 72px)", letterSpacing: "0.1em" }}
          >
            BLISS BATTLE
            <br />
            <span className="text-brand-gold">ROYALE</span>
          </h1>

          {/* ── Divider with date ── */}
          <div className="flex items-center justify-center gap-5" style={{ margin: "36px 0 40px" }}>
            <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12))" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.2)" }}>
              March 2026
            </span>
            <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)" }} />
          </div>

          {/* ── Subtitle ── */}
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.3)", marginBottom: 36 }}>
            Live Competition Dashboard
          </p>

          {/* ── Sign in button ── */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full max-w-[320px] inline-flex items-center justify-center gap-3 font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{
                fontSize: 15,
                padding: "16px 32px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #fff 0%, #E8E8E8 100%)",
                color: "#111",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
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

          {/* ── Footer note ── */}
          <p style={{ marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.15)" }}>
            Access restricted to{" "}
            <span style={{ color: "rgba(251,191,36,0.4)", fontWeight: 600 }}>@joinditto.in</span>{" "}
            accounts
          </p>
        </div>
      </div>
    </div>
  );
}
