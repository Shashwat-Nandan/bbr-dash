import Link from "next/link";
import { signOut } from "@/lib/auth";

interface NavbarProps {
  user: {
    name: string;
    image?: string;
    isAdmin: boolean;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-2xl"
      style={{
        background: "rgba(10,14,26,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-[1320px] mx-auto flex items-center justify-between px-6 sm:px-10 py-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.18)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#3B82F6" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-bebas)] text-[22px] tracking-[2px] leading-none">
            BLISS BATTLE <span className="text-brand-gold">ROYALE</span>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user.isAdmin && (
            <Link
              href="/admin"
              className="text-[12px] font-semibold px-4 py-2 rounded-xl transition-colors"
              style={{
                background: "rgba(59,130,246,0.12)",
                color: "#60A5FA",
                border: "1px solid rgba(59,130,246,0.18)",
              }}
            >
              Admin
            </Link>
          )}

          <div className="flex items-center gap-2.5">
            {user.image && (
              <img
                src={user.image}
                alt=""
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full"
                style={{ border: "2px solid rgba(255,255,255,0.08)" }}
              />
            )}
            <span className="hidden sm:block text-[13px] text-white/40 max-w-[140px] truncate">
              {user.name}
            </span>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="text-[12px] font-medium px-3.5 py-2 rounded-xl text-white/25 hover:text-white/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
