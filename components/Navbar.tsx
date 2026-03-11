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
    <nav className="flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-white/[0.06] backdrop-blur-2xl sticky top-0 z-50 bg-[rgba(0,35,60,0.9)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-[family-name:var(--font-bebas)] text-[10px] tracking-[2.5px] text-brand-blue/70 uppercase">
            Ditto Insurance
          </div>
          <h1 className="font-[family-name:var(--font-bebas)] text-[20px] tracking-[1.5px] leading-none">
            BLISS BATTLE <span className="text-brand-gold">ROYALE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user.isAdmin && (
          <Link
            href="/admin"
            className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg bg-brand-blue/15 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/25 transition-all"
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
          <span className="hidden sm:inline">{user.name}</span>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg text-white/30 border border-white/[0.06] hover:border-white/15 hover:text-white/50 transition-all cursor-pointer"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
