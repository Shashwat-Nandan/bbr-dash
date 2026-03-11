import Link from "next/link";

interface NoDataProps {
  isAdmin: boolean;
}

export default function NoData({ isAdmin }: NoDataProps) {
  return (
    <div className="text-center" style={{ padding: "80px 24px" }}>
      <div
        className="mx-auto flex items-center justify-center rounded-2xl"
        style={{
          width: 72,
          height: 72,
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.15)",
          marginBottom: 24,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 14l4-4 4 4 6-6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3
        className="font-[family-name:var(--font-bebas)]"
        style={{ fontSize: 32, letterSpacing: "0.08em", marginBottom: 8 }}
      >
        NO DATA UPLOADED YET
      </h3>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 400, margin: "0 auto" }}>
        The admin needs to upload the Bliss Battle Royale Excel file to populate the dashboard.
      </p>
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-block font-semibold text-white rounded-xl transition-all hover:opacity-90"
          style={{
            marginTop: 24,
            fontSize: 14,
            padding: "12px 28px",
            background: "#3B82F6",
          }}
        >
          Upload Data
        </Link>
      )}
    </div>
  );
}
