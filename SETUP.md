# Bliss Battle Royale — Dashboard Setup Guide

## Quick Start

### 1. Google Cloud Console Setup (for SSO)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set Application type: **Web application**
6. Add Authorized redirect URI: `https://your-domain.com/auth/callback`
   - For local testing: `http://localhost:5000/auth/callback`
7. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SECRET_KEY=generate-a-random-secret-key
ADMIN_EMAILS=your-email@joinditto.in
ALLOWED_DOMAIN=joinditto.in
```

### 3. Install & Run

```bash
pip install -r requirements.txt
python app.py
```

Visit `http://localhost:5000`

### 4. Deploy to Render (Recommended)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Add environment variables from your `.env` file
6. Update the Google OAuth redirect URI to your Render URL

## How It Works

- **Google SSO**: Only `@joinditto.in` emails can log in
- **Admin uploads**: Admins (configured in `ADMIN_EMAILS`) can upload the BBR Excel file
- **Dashboard**: All logged-in employees see daily standings, team points, and Purple Player of the Day
- **Data parsing**: The app reads all relevant sheets from the Excel file automatically

## Admin Workflow

1. Log in with your `@joinditto.in` Google account
2. Click "Admin Panel" in the nav
3. Upload the latest `Bliss Battle Royale` Excel file
4. Dashboard updates immediately for all users
