"""
Student Performance Analytics - Standalone Python Backend
Powered by Flask & SQLite / MySQL
"""

import os
import sqlite3
from flask import Flask, request, jsonify, render_template, session, redirect, url_for

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "student_analytics_secret_2026")
DB_FILE = os.path.join(os.path.dirname(__file__), "student_performance.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    with open(os.path.join(os.path.dirname(__file__), "schema.sql")) as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return jsonify({"status": "ready", "message": "Student Performance Analytics API"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or request.form
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cur.fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

    if role and user["role"] != role and user["role"] != "admin":
        return jsonify({"success": False, "message": f"Account is not registered as {role}"}), 403

    session["user_id"] = user["user_id"]
    session["username"] = user["username"]
    session["role"] = user["role"]
    session["student_id"] = user["student_id"]

    return jsonify({
        "success": True,
        "user": {
            "id": user["user_id"],
            "username": user["username"],
            "role": user["role"],
            "student_id": user["student_id"]
        }
    })

@app.route("/api/students", methods=["GET", "POST"])
def manage_students():
    conn = get_db()
    cur = conn.cursor()
    if request.method == "POST":
        data = request.json or request.form
        cur.execute(
            "INSERT INTO students (name, course, semester, division) VALUES (?, ?, ?, ?)",
            (data["name"], data["course"], int(data["semester"]), data["division"])
        )
        student_id = cur.lastrowid
        if "username" in data and "password" in data:
            cur.execute(
                "INSERT INTO users (username, password, role, student_id) VALUES (?, ?, 'student', ?)",
                (data["username"], data["password"], student_id)
            )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "student_id": student_id}), 201
    
    cur.execute("SELECT * FROM students ORDER BY student_id ASC")
    students = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({"students": students})

@app.route("/api/marks", methods=["GET", "POST", "DELETE"])
def manage_marks():
    conn = get_db()
    cur = conn.cursor()
    if request.method == "POST":
        data = request.json or request.form
        cur.execute(
            "INSERT INTO marks (student_id, subject_id, semester, marks) VALUES (?, ?, ?, ?)",
            (int(data["student_id"]), int(data["subject_id"]), int(data["semester"]), float(data["marks"]))
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 201

    cur.execute("""
        SELECT m.mark_id, m.student_id, st.name, sub.subject_name, m.semester, m.marks
        FROM marks m
        JOIN students st ON m.student_id = st.student_id
        JOIN subjects sub ON m.subject_id = sub.subject_id
        ORDER BY m.mark_id DESC
    """)
    marks = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({"marks": marks})

@app.route("/api/attendance", methods=["GET", "POST"])
def manage_attendance():
    conn = get_db()
    cur = conn.cursor()
    if request.method == "POST":
        data = request.json or request.form
        cur.execute(
            "INSERT INTO attendance (student_id, subject_id, semester, total_classes, attended_classes) VALUES (?, ?, ?, ?, ?)",
            (int(data["student_id"]), int(data["subject_id"]), int(data["semester"]), int(data["total_classes"]), int(data["attended_classes"]))
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 201

    cur.execute("""
        SELECT a.attendance_id, a.student_id, st.name, sub.subject_name, a.semester,
               a.total_classes, a.attended_classes,
               ROUND((CAST(a.attended_classes AS REAL) / a.total_classes) * 100, 1) as percentage
        FROM attendance a
        JOIN students st ON a.student_id = st.student_id
        JOIN subjects sub ON a.subject_id = sub.subject_id
        ORDER BY a.attendance_id DESC
    """)
    attendance = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({"attendance": attendance})

if __name__ == "__main__":
    if not os.path.exists(DB_FILE):
        init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
