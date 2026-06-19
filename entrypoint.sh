#!/bin/sh
set -e

# Function to wait for database
wait_for_db() {
  if [ -n "$DATABASE_URL" ]; then
    # Extract host and port from DATABASE_URL
    # Format: postgres://user:password@host:port/database
    DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|/.*||' -e 's|:.*||')
    DB_PORT=$(echo $DATABASE_URL | sed -e 's|.*:||' -e 's|/.*||')
    
    # Default port if not specified
    if [ "$DB_HOST" = "$DB_PORT" ]; then
      DB_PORT=5432
    fi

    echo "Waiting for database at $DB_HOST:$DB_PORT..."
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 1
    done
    echo "Database is reachable!"
  else
    echo "DATABASE_URL not set, skipping connectivity check."
  fi
}

# Run the wait function
wait_for_db

# Run database migration sync check
if [ -f "sync-migrations.js" ]; then
  echo "Running database migration sync check..."
  su-exec nextjs:nodejs node sync-migrations.js || echo "Warning: Migration sync check failed to run."
fi

# Fix permissions for the media volume at runtime
echo "Fixing permissions for /app/media..."
chown -R nextjs:nodejs /app/media

# Execute the command as the nextjs user using su-exec
echo "Starting application as nextjs user..."
exec su-exec nextjs:nodejs "$@"
