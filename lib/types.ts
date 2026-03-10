export interface TeamStanding {
  name: string;
  rank: number;
  normal_points: number;
  golden_points: number;
  total_points: number;
  total_premiums: number;
  premiums_cr: number;
  considered_count: number;
}

export interface PotdEntry {
  date: string;
  date_sort: string;
  tact_id: string;
  winner: string;
  team: string;
  premiums: number;
}

export interface TopPerformer {
  name: string;
  premiums: number;
  rank: number;
}

export interface DashboardData {
  as_of_date: string;
  team_standings: TeamStanding[];
  latest_potd: PotdEntry | null;
  potd_history: PotdEntry[];
  top_performers: Record<string, TopPerformer[]>;
  daily_totals: Record<string, number>;
  last_updated?: string;
  uploaded_by?: string;
}
