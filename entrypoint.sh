#!/bin/sh

# Exit on error
set -e

# Run migrations
echo "Running database migrations..."
npm run payload migrate

# Start the application
echo "Starting application..."
exec node server.js
