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
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[rgba(0,35,60,0.85)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-[family-name:var(--font-bebas)] text-[11px] tracking-[2px] text-brand-blue uppercase">
            Ditto Insurance
          </div>
          <h1 className="font-[family-name:var(--font-bebas)] text-[22px] tracking-[1.5px]">
            BLISS BATTLE <span className="text-brand-gold">ROYALE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user.isAdmin && (
          <Link
            href="/admin"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-blue text-white hover:opacity-90 transition-all"
          >
            Admin Panel
          </Link>
        )}

        <div className="flex items-center gap-2.5 text-[13px] text-white/60">
          {user.image && (
            <img
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border-2 border-white/10"
            />
          )}
          <span>{user.name}</span>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-transparent text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
