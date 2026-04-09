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

# Run database migrations
# This ensures migrations are completed before any app instance starts processing requests
echo "Running database migrations..."
if [ -f "node_modules/.bin/payload" ]; then
  su-exec nextjs:nodejs ./node_modules/.bin/payload migrate
else
  echo "Payload binary not found, skipping explicit migrations. Ensure migrations are handled externally."
fi

# Fix permissions for the media volume at runtime
echo "Fixing permissions for /app/media..."
chown -R nextjs:nodejs /app/media

# Execute the command as the nextjs user using su-exec
echo "Starting application as nextjs user..."
exec su-exec nextjs:nodejs "$@"
