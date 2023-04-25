#!/bin/bash

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

PSQL_CMD="psql -U $DB_USER -d postgres -c"

$PSQL_CMD "CREATE USER kaiju_readonly;"
$PSQL_CMD "CREATE USER kaiju_user;"
$PSQL_CMD "CREATE USER kaiju_server;"
$PSQL_CMD "CREATE USER gq_sf_server;"

$PSQL_CMD "CREATE DATABASE kaiju_db;"

$PSQL_CMD "\c kaiju_db;"

$PSQL_CMD "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

$PSQL_CMD "
CREATE SCHEMA kaiju;
SET search_path = kaiju;
CREATE TABLE user_info (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  created_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  initial_auth_method TEXT NOT NULL,
  last_auth_method TEXT,
  web3_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE user_run (
  run_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_info (user_id),
  start_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_ts TIMESTAMP WITH TIME ZONE,
  run_duration_in_sec INTEGER,
  run_score INTEGER,
  run_status TEXT NOT NULL,
  build_version TEXT NOT NULL,
  game_state JSON
);
"

# Run the SQL script containing all the remaining commands
cat << SQL_COMMANDS | psql -U $DB_USER -d kaiju_db
REVOKE ALL ON DATABASE kaiju_db FROM kaiju_readonly;
REVOKE ALL ON DATABASE kaiju_db FROM kaiju_user;
REVOKE ALL ON DATABASE kaiju_db FROM kaiju_server;

GRANT CONNECT ON DATABASE kaiju_db TO kaiju_readonly, kaiju_user, kaiju_server;

GRANT USAGE ON SCHEMA kaiju TO kaiju_user, kaiju_readonly, kaiju_server;

GRANT SELECT ON ALL TABLES IN SCHEMA kaiju TO kaiju_readonly;
GRANT INSERT, SELECT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA kaiju TO kaiju_user;
GRANT INSERT, SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA kaiju TO kaiju_server;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA kaiju TO kaiju_user, kaiju_server;

ALTER DEFAULT PRIVILEGES IN SCHEMA kaiju GRANT SELECT ON TABLES TO kaiju_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA kaiju GRANT INSERT, SELECT, UPDATE, DELETE, REFERENCES ON TABLES TO kaiju_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA kaiju GRANT INSERT, SELECT, UPDATE, DELETE ON TABLES TO kaiju_server;

ALTER DEFAULT PRIVILEGES IN SCHEMA kaiju GRANT USAGE, SELECT ON SEQUENCES TO kaiju_user, kaiju_server;

ALTER USER kaiju_readonly SET search_path to 'kaiju';
ALTER USER kaiju_user SET search_path to 'kaiju';
ALTER USER kaiju_server SET search_path to 'kaiju';

-- Give permissions to GQ/SF user
REVOKE ALL ON DATABASE kaiju_db FROM gq_sf_server;
GRANT CONNECT ON DATABASE kaiju_db TO gq_sf_server;
GRANT INSERT, SELECT, UPDATE, DELETE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO gq_sf_server;

-- Give read permissions (and write to kaiju_user) to other users on GQ/SF tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO kaiju_readonly, kaiju_user, kaiju_server;
GRANT INSERT, SELECT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO kaiju_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, SELECT, UPDATE, DELETE, REFERENCES ON TABLES TO kaiju_user;

-- Give ownership of legacy tables to gq/sf user
SET SEARCH_PATH=public;
ALTER TABLE batches_ OWNER TO gq_sf_server;
ALTER TABLE gem_transfers OWNER TO gq_sf_server;
ALTER TABLE gq_kaijus OWNER TO gq_sf_server;
ALTER TABLE gq_quests OWNER TO gq_sf_server;
ALTER TABLE reservation_log OWNER TO gq_sf_server;
ALTER TABLE swords_v2 OWNER TO gq_sf_server;
ALTER TABLE swords_v2_bak OWNER TO gq_sf_server;
ALTER TABLE user_ids OWNER TO gq_sf_server;
ALTER TABLE user_info OWNER TO gq_sf_server;
ALTER TABLE user_locks OWNER TO gq_sf_server;
ALTER TABLE users OWNER TO gq_sf_server;
SQL_COMMANDS
