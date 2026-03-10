import * as XLSX from "xlsx";
import { DashboardData, TeamStanding, PotdEntry, TopPerformer } from "./types";

const TEAM_NAMES = ["Titans", "Stalwarts", "Underrated"] as const;

function parseDate(val: unknown): { str: string; sort: string } | null {
  if (val == null) return null;
  if (typeof val === "number") {
    // Excel serial date
    const d = XLSX.SSF.parse_date_code(val);
    if (d) {
      const dt = new Date(d.y, d.m - 1, d.d);
      return {
        str: dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        sort: dt.toISOString().split("T")[0],
      };
    }
  }
  if (val instanceof Date) {
    return {
      str: val.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      sort: val.toISOString().split("T")[0],
    };
  }
  return { str: String(val), sort: String(val) };
}

function num(val: unknown): number {
  if (val == null) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

function str(val: unknown): string {
  if (val == null) return "";
  return String(val).trim();
}

export function parseBbrExcel(buffer: Buffer): DashboardData {
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });

  // --- Read BBR Data sheet ---
  const bbrSheet = wb.Sheets["BBR <> Data"];
  if (!bbrSheet) throw new Error('Sheet "BBR <> Data" not found');
  const bbrData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(bbrSheet, { defval: null });

  // --- Read POTD sheet (no header) ---
  const potdSheet = wb.Sheets["POTD"];
  const potdRows: unknown[][] = potdSheet
    ? XLSX.utils.sheet_to_json(potdSheet, { header: 1, defval: null })
    : [];

  // --- Read Golden Points sheet (no header) ---
  const goldenSheet = wb.Sheets["Golden Points"];
  const goldenRows: unknown[][] = goldenSheet
    ? XLSX.utils.sheet_to_json(goldenSheet, { header: 1, defval: null })
    : [];

  // --- Read team sheets ---
  const teamsData: Record<string, Record<string, unknown>[]> = {};
  for (const teamName of TEAM_NAMES) {
    try {
      const sheet = wb.Sheets[teamName];
      if (!sheet) { teamsData[teamName] = []; continue; }
      const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
      // Row 0 is header, rest is data - columns A-H
      const headers = ["TACT ID", "Advisor Name", "Type", "Mentor Name",
        "Team Name", "Premiums MTD", "Rank", "Considered?"];
      const parsed: Record<string, unknown>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row[0] == null) continue;
        const obj: Record<string, unknown> = {};
        headers.forEach((h, j) => { obj[h] = row[j]; });
        parsed.push(obj);
      }
      teamsData[teamName] = parsed;
    } catch {
      teamsData[teamName] = [];
    }
  }

  // --- Team Standings ---
  const teamStandings: TeamStanding[] = [];
  for (const teamName of TEAM_NAMES) {
    const teamSheet = teamsData[teamName] || [];
    const considered = teamSheet.filter((r) => str(r["Considered?"]) === "Yes");

    // Calculate premiums from BBR Data for considered advisors
    const teamBbr = bbrData.filter(
      (r) => str(r["Team Name"]) === teamName && str(r["Considered?"]) === "Yes"
    );
    const totalPremiums = teamBbr.reduce((sum, r) => sum + num(r["Premiums MTD"]), 0);

    // Points: every 5L premium = 0.5 points
    const normalPoints = Math.floor(totalPremiums / 500000) * 0.5;

    teamStandings.push({
      name: teamName,
      rank: 0,
      normal_points: normalPoints,
      golden_points: 0,
      total_points: 0,
      total_premiums: totalPremiums,
      premiums_cr: Math.round((totalPremiums / 10000000) * 1000) / 1000,
      considered_count: considered.length,
    });
  }

  // --- Golden Points ---
  try {
    for (let i = 2; i < 5 && i < goldenRows.length; i++) {
      const row = goldenRows[i];
      if (!row) continue;
      const gpTeamName = str(row[0]);
      const goldenPts = num(row[7]);
      for (const ts of teamStandings) {
        if (ts.name.toLowerCase() === gpTeamName.toLowerCase()) {
          ts.golden_points = goldenPts;
          break;
        }
      }
    }
  } catch {
    // ignore golden points parse errors
  }

  // Calculate total points and sort
  for (const ts of teamStandings) {
    ts.total_points = ts.normal_points + ts.golden_points;
  }
  teamStandings.sort((a, b) => {
    if (b.total_points !== a.total_points) return b.total_points - a.total_points;
    return b.total_premiums - a.total_premiums;
  });
  teamStandings.forEach((ts, i) => { ts.rank = i + 1; });

  // --- POTD ---
  const potdList: PotdEntry[] = [];
  try {
    for (let i = 3; i < potdRows.length; i++) {
      const row = potdRows[i];
      if (!row) continue;
      const dateVal = row[1];
      const winner = row[3];
      const team = row[4];
      const premiums = row[5];

      if (!winner || str(winner) === "") continue;
      if (premiums != null && num(premiums) === 0) continue;

      const parsed = parseDate(dateVal);

      potdList.push({
        date: parsed?.str || str(dateVal),
        date_sort: parsed?.sort || str(dateVal),
        tact_id: row[2] != null ? str(row[2]) : "",
        winner: str(winner),
        team: str(team),
        premiums: num(premiums),
      });
    }
  } catch {
    // ignore potd parse errors
  }
  potdList.sort((a, b) => (b.date_sort > a.date_sort ? 1 : -1));
  const latestPotd = potdList.length > 0 ? potdList[0] : null;

  // --- Top Performers ---
  const topPerformers: Record<string, TopPerformer[]> = {};
  for (const teamName of TEAM_NAMES) {
    const teamSheet = teamsData[teamName] || [];
    const considered = teamSheet
      .filter((r) => str(r["Considered?"]) === "Yes")
      .slice(0, 10);
    topPerformers[teamName] = considered.map((r) => ({
      name: str(r["Advisor Name"]),
      premiums: num(r["Premiums MTD"]),
      rank: num(r["Rank"]),
    }));
  }

  // --- Daily Totals ---
  const dailyTotals: Record<string, number> = {};
  // Find date columns (keys that are Date objects or date strings)
  const allKeys = bbrData.length > 0 ? Object.keys(bbrData[0]) : [];
  const dateColKeys: string[] = [];
  for (const key of allKeys) {
    // Check if the key looks like a date (XLSX with cellDates may produce Date-like strings)
    const testVal = bbrData[0][key];
    if (testVal instanceof Date) {
      dateColKeys.push(key);
    }
  }

  let lastDateWithData: Date | null = null;
  for (const key of dateColKeys) {
    const firstRow = bbrData[0][key];
    if (!(firstRow instanceof Date)) continue;
    const dt = firstRow; // The key itself maps to the date in first row context
    // Actually the key IS the date column header
    const dayTotal = bbrData.reduce((sum, r) => sum + num(r[key]), 0);
    if (dayTotal > 0) {
      const dateStr = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      dailyTotals[dateStr] = Math.round((dayTotal / 100000) * 100) / 100;
      if (!lastDateWithData || dt > lastDateWithData) {
        lastDateWithData = dt;
      }
    }
  }

  // For date column keys that come as strings from sheet_to_json
  // The column headers that are Date objects get serialized as strings by sheet_to_json
  // We need a different approach - read headers directly
  if (dateColKeys.length === 0 && bbrSheet) {
    const range = XLSX.utils.decode_range(bbrSheet["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = bbrSheet[XLSX.utils.encode_cell({ r: range.s.r, c })];
      if (cell && cell.t === "d" && cell.v instanceof Date) {
        const dt = cell.v;
        const colHeader = XLSX.utils.format_cell(cell);
        // Sum this column across all data rows
        let dayTotal = 0;
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const dataCell = bbrSheet[XLSX.utils.encode_cell({ r, c })];
          if (dataCell && typeof dataCell.v === "number") {
            dayTotal += dataCell.v;
          }
        }
        if (dayTotal > 0) {
          const dateStr = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
          dailyTotals[dateStr] = Math.round((dayTotal / 100000) * 100) / 100;
          if (!lastDateWithData || dt > lastDateWithData) {
            lastDateWithData = dt;
          }
        }
      }
    }
  }

  const asOfDate = lastDateWithData
    ? lastDateWithData.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "N/A";

  return {
    as_of_date: asOfDate,
    team_standings: teamStandings,
    latest_potd: latestPotd,
    potd_history: potdList,
    top_performers: topPerformers,
    daily_totals: dailyTotals,
  };
}
