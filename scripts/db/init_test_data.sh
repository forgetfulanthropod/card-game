#!/bin/bash
# This script will insert (NOT OVERWRITE) dummy data into the kaiju_db database.
# Specifically, 50 users with 5 runs for each user will be inserted.

# Navigate to the root directory of the repository
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_DIR/../.."

# Load the .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found. Please create an .env file at the root directory of the repository with the required variables."
    exit 1
fi

# Check that we're not in production
if [ "$IS_PRODUCTION" == "true" ]; then
    echo "Error: This script should not run in production. Exiting."
    exit 1
fi

DB_USER="$PGUSER"
DB_PASSWORD="$PGPASSWORD"

echo "Generating test data..."

if ! command -v python3 &> /dev/null
then
    echo "Python 3 is not installed. Please install Python 3 to run this script."
    exit 1
fi

# Check if psycopg2 is installed, if not, install it
python3 -c "import psycopg2" 2> /dev/null || {
    echo "psycopg2 is not installed. Installing..."
    pip3 install psycopg2 || {
        echo "Failed to install psycopg2. Please install it manually using 'pip3 install psycopg2'."
        exit 1
    }
}

python3 << PYTHON_SCRIPT
import random
import uuid
import psycopg2

conn = psycopg2.connect(
    dbname="kaiju_db",
    user="$DB_USER",
    password="$DB_PASSWORD"
)

cur = conn.cursor()

# Insert dummy users into user_info
for _ in range(50):
    user_id = uuid.uuid4()
    wallet_address = f"0x{uuid.uuid4().hex}"
    username = f"user_{random.randint(1, 1000000)}"
    email = f"{username}@example.com"
    initial_auth_method = "connect_wallet"

    cur.execute("""
        INSERT INTO kaiju.user_info (user_id, wallet_address, username, email, initial_auth_method)
        VALUES (%s, %s, %s, %s, %s);
    """, (str(user_id), wallet_address, username, email, initial_auth_method))

    # Insert 5 records for each user into user_run
    for _ in range(5):
        start_ts = f"2023-04-24 {random.randint(0, 23)}:{random.randint(0, 59)}:00"
        end_ts = f"2023-04-24 {random.randint(0, 23)}:{random.randint(0, 59)}:00"
        run_duration_in_sec = random.randint(60, 3600)
        run_score = random.randint(0, 1000)
        run_status = random.choice(["completed", "failed", "aborted"])
        build_version = "1.0.0"
        game_state = '{}'

        cur.execute("""
            INSERT INTO kaiju.user_run (user_id, start_ts, end_ts, run_duration_in_sec, run_score, run_status, build_version, game_state)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """, (str(user_id), start_ts, end_ts, run_duration_in_sec, run_score, run_status, build_version, game_state))

conn.commit()
PYTHON_SCRIPT

echo "Done."
