import * as XLSX from "xlsx";

const TEAM_NAMES = ["Titans", "Stalwarts", "Underrated"] as const;

interface TeamStanding {
  name: string;
  rank: number;
  normal_points: number;
  golden_points: number;
  total_points: number;
  total_premiums: number;
  premiums_cr: number;
  considered_count: number;
}

interface PotdEntry {
  date: string;
  date_sort: string;
  tact_id: string;
  winner: string;
  team: string;
  premiums: number;
}

interface TopPerformer {
  name: string;
  premiums: number;
  rank: number;
}

interface DashboardData {
  as_of_date: string;
  team_standings: TeamStanding[];
  latest_potd: PotdEntry | null;
  potd_history: PotdEntry[];
  top_performers: Record<string, TopPerformer[]>;
  daily_totals: Record<string, number>;
  advisor_map?: Record<string, string>;
}

function parseDate(val: unknown): { str: string; sort: string } | null {
  if (val == null) return null;
  if (typeof val === "number") {
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

export function parseBbrExcel(arrayBuffer: ArrayBuffer): DashboardData {
  const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

  const bbrSheet = wb.Sheets["BBR <> Data"];
  if (!bbrSheet) throw new Error('Sheet "BBR <> Data" not found');
  const bbrData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(bbrSheet, { defval: null });

  const potdSheet = wb.Sheets["POTD"];
  const potdRows: unknown[][] = potdSheet
    ? XLSX.utils.sheet_to_json(potdSheet, { header: 1, defval: null })
    : [];

  const goldenSheet = wb.Sheets["Golden Points"];
  const goldenRows: unknown[][] = goldenSheet
    ? XLSX.utils.sheet_to_json(goldenSheet, { header: 1, defval: null })
    : [];

  const teamsData: Record<string, Record<string, unknown>[]> = {};
  for (const teamName of TEAM_NAMES) {
    try {
      const sheet = wb.Sheets[teamName];
      if (!sheet) { teamsData[teamName] = []; continue; }
      const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
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

  // Build advisor lookup: tact_id → { name, premiums, team }
  const advisorLookup: Record<string, { name: string; premiums: number; team: string }> = {};
  for (const teamName of TEAM_NAMES) {
    for (const row of teamsData[teamName] || []) {
      const tactId = str(row["TACT ID"]);
      if (tactId) {
        advisorLookup[tactId] = {
          name: str(row["Advisor Name"]),
          premiums: num(row["Premiums MTD"]),
          team: teamName,
        };
      }
    }
  }

  // Team Standings
  const teamStandings: TeamStanding[] = [];
  for (const teamName of TEAM_NAMES) {
    const teamSheet = teamsData[teamName] || [];
    const considered = teamSheet.filter((r) => str(r["Considered?"]) === "Yes");
    const teamBbr = bbrData.filter(
      (r) => str(r["Team Name"]) === teamName && str(r["Considered?"]) === "Yes"
    );
    const totalPremiums = teamBbr.reduce((sum, r) => sum + num(r["Premiums MTD"]), 0);
    const normalPoints = Math.floor(totalPremiums / 500000) * 0.5;

    teamStandings.push({
      name: teamName, rank: 0,
      normal_points: normalPoints, golden_points: 0, total_points: 0,
      total_premiums: totalPremiums,
      premiums_cr: Math.round((totalPremiums / 10000000) * 1000) / 1000,
      considered_count: considered.length,
    });
  }

  // Golden Points
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
  } catch { /* ignore */ }

  for (const ts of teamStandings) {
    ts.total_points = ts.normal_points + ts.golden_points;
  }
  teamStandings.sort((a, b) => b.total_points !== a.total_points
    ? b.total_points - a.total_points : b.total_premiums - a.total_premiums);
  teamStandings.forEach((ts, i) => { ts.rank = i + 1; });

  // POTD — resolve advisor names via lookup
  const potdList: PotdEntry[] = [];
  try {
    for (let i = 3; i < potdRows.length; i++) {
      const row = potdRows[i];
      if (!row) continue;
      const dateVal = row[1];
      const tactId = str(row[2]);
      const rawWinner = str(row[3]);
      const rawTeam = str(row[4]);
      const rawPremiums = num(row[5]);

      if (!rawWinner && !tactId) continue;

      // Look up advisor info from team sheets
      const lookup = tactId ? advisorLookup[tactId] : null;

      // Use looked-up name if winner looks like a tact_id (all digits) or is empty
      const isWinnerNumeric = /^\d+$/.test(rawWinner);
      const advisorName = lookup?.name && (isWinnerNumeric || !rawWinner)
        ? lookup.name : (rawWinner || lookup?.name || tactId);

      const team = rawTeam || lookup?.team || "";
      const premiums = rawPremiums > 0 ? rawPremiums : (lookup?.premiums || 0);

      if (premiums === 0) continue;

      const parsed = parseDate(dateVal);
      potdList.push({
        date: parsed?.str || str(dateVal),
        date_sort: parsed?.sort || str(dateVal),
        tact_id: tactId,
        winner: advisorName,
        team,
        premiums,
      });
    }
  } catch { /* ignore */ }
  potdList.sort((a, b) => (b.date_sort > a.date_sort ? 1 : -1));

  // Top Performers
  const topPerformers: Record<string, TopPerformer[]> = {};
  for (const teamName of TEAM_NAMES) {
    const teamSheet = teamsData[teamName] || [];
    const considered = teamSheet.filter((r) => str(r["Considered?"]) === "Yes").slice(0, 10);
    topPerformers[teamName] = considered.map((r) => ({
      name: str(r["Advisor Name"]), premiums: num(r["Premiums MTD"]), rank: num(r["Rank"]),
    }));
  }

  // Daily Totals
  const dailyTotals: Record<string, number> = {};
  let lastDateWithData: Date | null = null;

  if (bbrSheet) {
    const range = XLSX.utils.decode_range(bbrSheet["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = bbrSheet[XLSX.utils.encode_cell({ r: range.s.r, c })];
      if (cell && (cell.t === "d" || cell.v instanceof Date)) {
        const dt = cell.v instanceof Date ? cell.v : new Date(cell.v);
        if (isNaN(dt.getTime())) continue;
        let dayTotal = 0;
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const dataCell = bbrSheet[XLSX.utils.encode_cell({ r, c })];
          if (dataCell && typeof dataCell.v === "number") dayTotal += dataCell.v;
        }
        if (dayTotal > 0) {
          const dateStr = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
          dailyTotals[dateStr] = Math.round((dayTotal / 100000) * 100) / 100;
          if (!lastDateWithData || dt > lastDateWithData) lastDateWithData = dt;
        }
      }
    }
  }

  const asOfDate = lastDateWithData
    ? lastDateWithData.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "N/A";

  // Build advisor_map: tact_id → advisor name (for display-time resolution)
  const advisorMap: Record<string, string> = {};
  for (const [tactId, info] of Object.entries(advisorLookup)) {
    if (info.name) advisorMap[tactId] = info.name;
  }

  return {
    as_of_date: asOfDate,
    team_standings: teamStandings,
    latest_potd: potdList.length > 0 ? potdList[0] : null,
    potd_history: potdList,
    top_performers: topPerformers,
    daily_totals: dailyTotals,
    advisor_map: advisorMap,
  };
}
