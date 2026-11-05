# Student Performance Analytics - Python Backend

This directory contains the standalone, native Python 3 Flask backend for the Student Performance Analytics application.

## Prerequisites
- Python 3.10+
- pip

## Quick Start (Run Locally)

1. Navigate to this directory:
   ```bash
   cd python_backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Seed the local SQLite database with realistic academic data:
   ```bash
   python3 seed_data.py
   ```

4. Start the Flask application:
   ```bash
   python3 app.py
   ```
   The Flask server will launch on `http://127.0.0.1:5000`.

## Pre-Configured Accounts
- **Administrator**: username `admin` / password `admin@12345`
- **Faculty / Teacher**: username `teacher1` / password `teacher@123`
- **Student**: username `aarav` / password `student@123`
- **At-Risk Student**: username `rohan` / password `student@123`

## Database Architecture
- Standard default uses `sqlite3` (zero configuration required).
- To connect to a MySQL instance, set MySQL credentials in `database.py` and import `mysql.connector`.
