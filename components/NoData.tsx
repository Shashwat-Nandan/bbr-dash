import Link from "next/link";

interface NoDataProps {
  isAdmin: boolean;
}

export default function NoData({ isAdmin }: NoDataProps) {
  return (
    <div className="text-center py-20 px-8">
      <div className="text-5xl mb-4">&#x1F4CA;</div>
      <h3 className="font-[family-name:var(--font-bebas)] text-[28px] tracking-wider mb-2">
        NO DATA UPLOADED YET
      </h3>
      <p className="text-white/60 text-sm">
        The admin needs to upload the Bliss Battle Royale Excel file to populate the dashboard.
      </p>
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-block mt-5 text-sm font-semibold px-7 py-3 rounded-lg bg-brand-blue text-white hover:opacity-90 transition-all"
        >
          Upload Data
        </Link>
      )}
    </div>
  );
}
