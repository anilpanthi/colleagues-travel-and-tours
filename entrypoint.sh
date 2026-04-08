#!/bin/sh
set -e

# Fix permissions for the media volume at runtime
# This is necessary because Docker volume mounts are often owned by root
echo "Fixing permissions for /app/media..."
chown -R nextjs:nodejs /app/media

# Execute the command as the nextjs user using su-exec
# The 'CMD' from the Dockerfile will be passed as "$@"
# We use "$@" to include all arguments passed to the script
echo "Starting application as nextjs user..."
exec su-exec nextjs:nodejs "$@"
