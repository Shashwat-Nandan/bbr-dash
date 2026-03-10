import os
import json
from datetime import datetime
from functools import wraps

from flask import Flask, redirect, url_for, session, render_template, request, flash, jsonify
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv

from data_parser import parse_bbr_excel

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-me")

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_DOMAIN = os.getenv("ALLOWED_DOMAIN", "joinditto.in")
ADMIN_EMAILS = [e.strip() for e in os.getenv("ADMIN_EMAILS", "").split(",") if e.strip()]

# Google OAuth setup
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# ---------- helpers ----------

def get_latest_data():
    data_file = os.path.join(UPLOAD_FOLDER, "latest_data.json")
    if os.path.exists(data_file):
        with open(data_file, "r") as f:
            return json.load(f)
    return None


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("login"))
        if session["user"]["email"] not in ADMIN_EMAILS:
            flash("You don't have admin access.", "error")
            return redirect(url_for("dashboard"))
        return f(*args, **kwargs)
    return wrapper


# ---------- auth routes ----------

@app.route("/login")
def login():
    if "user" in session:
        return redirect(url_for("dashboard"))
    return render_template("login.html")


@app.route("/auth/google")
def auth_google():
    redirect_uri = url_for("auth_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route("/auth/callback")
def auth_callback():
    token = google.authorize_access_token()
    userinfo = token.get("userinfo")
    if not userinfo:
        resp = google.get("https://openidconnect.googleapis.com/v1/userinfo")
        userinfo = resp.json()

    email = userinfo.get("email", "")
    domain = email.split("@")[-1] if "@" in email else ""

    if domain != ALLOWED_DOMAIN:
        flash(f"Access restricted to @{ALLOWED_DOMAIN} accounts only.", "error")
        return redirect(url_for("login"))

    session["user"] = {
        "email": email,
        "name": userinfo.get("name", email.split("@")[0]),
        "picture": userinfo.get("picture", ""),
        "is_admin": email in ADMIN_EMAILS,
    }
    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))


# ---------- main routes ----------

@app.route("/")
@login_required
def dashboard():
    data = get_latest_data()
    user = session["user"]
    return render_template("dashboard.html", data=data, user=user)


@app.route("/admin")
@admin_required
def admin_panel():
    user = session["user"]
    data = get_latest_data()
    last_updated = None
    if data:
        last_updated = data.get("last_updated")
    return render_template("admin.html", user=user, last_updated=last_updated)


@app.route("/admin/upload", methods=["POST"])
@admin_required
def upload_file():
    if "file" not in request.files:
        flash("No file selected.", "error")
        return redirect(url_for("admin_panel"))

    file = request.files["file"]
    if file.filename == "":
        flash("No file selected.", "error")
        return redirect(url_for("admin_panel"))

    if not file.filename.endswith((".xlsx", ".xls")):
        flash("Please upload an Excel file (.xlsx).", "error")
        return redirect(url_for("admin_panel"))

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], "latest_upload.xlsx")
    file.save(filepath)

    try:
        data = parse_bbr_excel(filepath)
        data["last_updated"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
        data["uploaded_by"] = session["user"]["email"]

        with open(os.path.join(UPLOAD_FOLDER, "latest_data.json"), "w") as f:
            json.dump(data, f, indent=2, default=str)

        flash("File uploaded and processed successfully!", "success")
    except Exception as e:
        flash(f"Error processing file: {str(e)}", "error")

    return redirect(url_for("admin_panel"))


@app.route("/api/data")
@login_required
def api_data():
    data = get_latest_data()
    if data:
        return jsonify(data)
    return jsonify({"error": "No data available"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
