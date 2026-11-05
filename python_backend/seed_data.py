#!/usr/bin/env python3
"""
Seed script for standalone Python Flask + SQLite backend.
Initializes student_performance.db with sample students, subjects, marks, and attendance.
"""

import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "student_performance.db")
SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "schema.sql")

def seed():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    with open(SCHEMA_FILE) as f:
        cur.executescript(f.read())

    # Users
    cur.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'admin@12345', 'admin')")
    cur.execute("INSERT INTO users (username, password, role) VALUES ('teacher1', 'teacher@123', 'teacher')")

    # Subjects
    subjects = [
        ("Database Management Systems", "CS401"),
        ("Operating Systems & Shell Scripting", "CS402"),
        ("Computer Networks", "CS403"),
        ("Python & Web Development", "CS404"),
        ("Design & Analysis of Algorithms", "CS405"),
    ]
    cur.executemany("INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)", subjects)

    # Students
    students = [
        ("Soham Wani", "B.Tech CSE(AIML)", 4, "A"),
        ("Aarav Sharma", "B.Tech CSE(AIML)", 4, "A"),
        ("Priya Patel", "B.Tech CSE(AIML)", 4, "A"),
        ("Rohan Mehta", "B.Tech CSE(AIML)", 4, "B"),
        ("Ananya Roy", "B.Tech CSE(AIML)", 4, "A"),
        ("Vikram Joshi", "B.Tech CSE(AIML)", 4, "B"),
    ]
    cur.executemany("INSERT INTO students (name, course, semester, division) VALUES (?, ?, ?, ?)", students)

    # Student logins
    for i, name in enumerate(["soham", "aarav", "priya", "rohan", "ananya", "vikram"], start=1):
        cur.execute("INSERT INTO users (username, password, role, student_id) VALUES (?, 'student@123', 'student', ?)", (name, i))

    # Marks
    marks_data = [
        (1, 1, 4, 92), (1, 2, 4, 88), (1, 3, 4, 91), (1, 4, 4, 95), (1, 5, 4, 89),
        (2, 1, 4, 84), (2, 2, 4, 79), (2, 3, 4, 82), (2, 4, 4, 87), (2, 5, 4, 76),
        (3, 1, 4, 62), (3, 2, 4, 58), (3, 3, 4, 48), (3, 4, 4, 65), (3, 5, 4, 44),
        (4, 1, 4, 89), (4, 2, 4, 85), (4, 3, 4, 88), (4, 4, 4, 93), (4, 5, 4, 81),
        (5, 1, 4, 72), (5, 2, 4, 68), (5, 3, 4, 64), (5, 4, 4, 78), (5, 5, 4, 61),
    ]
    cur.executemany("INSERT INTO marks (student_id, subject_id, semester, marks) VALUES (?, ?, ?, ?)", marks_data)

    # Attendance
    attendance_data = [
        (1, 1, 4, 36, 34), (1, 2, 4, 32, 31), (1, 3, 4, 30, 29), (1, 4, 4, 40, 39), (1, 5, 4, 34, 32),
        (2, 1, 4, 36, 31), (2, 2, 4, 32, 28), (2, 3, 4, 30, 27), (2, 4, 4, 40, 36), (2, 5, 4, 34, 30),
        (3, 1, 4, 36, 24), (3, 2, 4, 32, 20), (3, 3, 4, 30, 18), (3, 4, 4, 40, 28), (3, 5, 4, 34, 19),
        (4, 1, 4, 36, 35), (4, 2, 4, 32, 30), (4, 3, 4, 30, 28), (4, 4, 4, 40, 38), (4, 5, 4, 34, 33),
        (5, 1, 4, 36, 29), (5, 2, 4, 32, 25), (5, 3, 4, 30, 23), (5, 4, 4, 40, 33), (5, 5, 4, 34, 26),
    ]
    cur.executemany("INSERT INTO attendance (student_id, subject_id, semester, total_classes, attended_classes) VALUES (?, ?, ?, ?, ?)", attendance_data)

    conn.commit()
    conn.close()
    print("Database seeded successfully into student_performance.db!")

if __name__ == "__main__":
    seed()
