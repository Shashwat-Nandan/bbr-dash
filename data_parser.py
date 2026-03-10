import pandas as pd
import numpy as np
from datetime import datetime


def parse_bbr_excel(filepath):
    """Parse the Bliss Battle Royale Excel file and extract dashboard data."""

    # Read all relevant sheets
    bbr_data = pd.read_excel(filepath, sheet_name="BBR <> Data", header=0)
    potd_df = pd.read_excel(filepath, sheet_name="POTD", header=None)
    golden_df = pd.read_excel(filepath, sheet_name="Golden Points", header=None)

    # Read team sheets to get rankings
    teams_data = {}
    for team_name in ["Titans", "Stalwarts", "Underrated"]:
        try:
            df = pd.read_excel(filepath, sheet_name=team_name, header=0)
            # Columns A-H contain the ranked data
            ranked = df.iloc[:, :8].copy()
            ranked.columns = ["TACT ID", "Advisor Name", "Type", "Mentor Name",
                              "Team Name", "Premiums MTD", "Rank", "Considered?"]
            ranked = ranked.dropna(subset=["TACT ID"])
            teams_data[team_name] = ranked
        except Exception:
            teams_data[team_name] = pd.DataFrame()

    # --- Team standings ---
    team_standings = []
    for team_name in ["Titans", "Stalwarts", "Underrated"]:
        team_df = teams_data.get(team_name, pd.DataFrame())
        considered = team_df[team_df["Considered?"] == "Yes"] if not team_df.empty else pd.DataFrame()

        # Calculate premiums from BBR Data for considered advisors
        team_bbr = bbr_data[
            (bbr_data["Team Name"] == team_name) &
            (bbr_data["Considered?"] == "Yes")
        ]
        total_premiums = float(team_bbr["Premiums MTD"].sum()) if not team_bbr.empty else 0

        # Points: every 5L premium = 0.5 points
        normal_points = (total_premiums // 500000) * 0.5

        team_standings.append({
            "name": team_name,
            "normal_points": normal_points,
            "golden_points": 0,
            "total_premiums": total_premiums,
            "premiums_cr": round(total_premiums / 10000000, 3),
            "considered_count": len(considered) if not considered.empty else 0,
        })

    # --- Golden Points ---
    # Row 0 has point values, Row 1 has headers, Rows 2-4 have team data
    try:
        for i in range(2, 5):
            row = golden_df.iloc[i]
            gp_team_name = str(row.iloc[0]).strip()
            golden_pts = float(row.iloc[7]) if pd.notna(row.iloc[7]) else 0
            for ts in team_standings:
                if ts["name"].lower() == gp_team_name.lower():
                    ts["golden_points"] = golden_pts
                    break
    except Exception:
        pass

    # Calculate total points and sort
    for ts in team_standings:
        ts["total_points"] = ts["normal_points"] + ts["golden_points"]

    team_standings.sort(key=lambda x: (-x["total_points"], -x["total_premiums"]))

    # Assign ranks
    for i, ts in enumerate(team_standings):
        ts["rank"] = i + 1

    # --- POTD (Player of the Day) ---
    potd_list = []
    try:
        for i in range(3, potd_df.shape[0]):
            row = potd_df.iloc[i]
            date_val = row.iloc[1]
            winner = row.iloc[3]
            team = row.iloc[4]
            premiums = row.iloc[5]

            if pd.isna(winner) or str(winner).strip() == "":
                continue
            if pd.notna(premiums) and float(premiums) == 0:
                continue

            if isinstance(date_val, datetime):
                date_str = date_val.strftime("%d %b %Y")
                date_sort = date_val.strftime("%Y-%m-%d")
            else:
                date_str = str(date_val)
                date_sort = str(date_val)

            potd_list.append({
                "date": date_str,
                "date_sort": date_sort,
                "tact_id": str(row.iloc[2]) if pd.notna(row.iloc[2]) else "",
                "winner": str(winner).strip(),
                "team": str(team).strip() if pd.notna(team) else "",
                "premiums": float(premiums) if pd.notna(premiums) else 0,
            })
    except Exception:
        pass

    potd_list.sort(key=lambda x: x["date_sort"], reverse=True)

    # Latest POTD
    latest_potd = potd_list[0] if potd_list else None

    # --- Top performers per team ---
    top_performers = {}
    for team_name in ["Titans", "Stalwarts", "Underrated"]:
        team_df = teams_data.get(team_name, pd.DataFrame())
        if not team_df.empty:
            considered = team_df[team_df["Considered?"] == "Yes"].head(10)
            performers = []
            for _, row in considered.iterrows():
                performers.append({
                    "name": str(row["Advisor Name"]),
                    "premiums": float(row["Premiums MTD"]) if pd.notna(row["Premiums MTD"]) else 0,
                    "rank": int(row["Rank"]) if pd.notna(row["Rank"]) else 0,
                })
            top_performers[team_name] = performers

    # --- Daily breakdown (dates with data) ---
    date_cols = [c for c in bbr_data.columns if isinstance(c, datetime)]
    daily_totals = {}
    for dc in date_cols:
        date_str = dc.strftime("%d %b")
        day_total = float(bbr_data[dc].sum())
        if day_total > 0:
            daily_totals[date_str] = round(day_total / 100000, 2)  # in lakhs

    # Find as-of date (last date with data)
    last_date_with_data = None
    for dc in sorted(date_cols, reverse=True):
        if float(bbr_data[dc].sum()) > 0:
            last_date_with_data = dc
            break

    as_of_date = last_date_with_data.strftime("%d %b %Y") if last_date_with_data else "N/A"

    return {
        "as_of_date": as_of_date,
        "team_standings": team_standings,
        "latest_potd": latest_potd,
        "potd_history": potd_list,
        "top_performers": top_performers,
        "daily_totals": daily_totals,
    }
