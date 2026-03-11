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
    <nav className="flex items-center justify-between px-5 sm:px-8 py-3 border-b border-white/[0.06] backdrop-blur-xl sticky top-0 z-50 bg-[rgba(0,24,41,0.92)]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0586FF"/>
          </svg>
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-[18px] sm:text-[20px] tracking-[1.5px] leading-none">
            BLISS BATTLE <span className="text-brand-gold">ROYALE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {user.isAdmin && (
          <Link
            href="/admin"
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-brand-blue/15 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/25 transition-colors"
          >
            Admin
          </Link>
        )}

        <div className="flex items-center gap-2 text-[12px] text-white/40">
          {user.image && (
            <img
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full border border-white/10"
            />
          )}
          <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg text-white/30 hover:text-white/50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
