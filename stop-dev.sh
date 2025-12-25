#!/bin/bash

# Wedding Page Development Stop Script

echo "🛑 Stopping Wedding Page Development Environment..."
echo ""

if [ -f .dev-pids ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping process $pid..."
            kill $pid
        fi
    done < .dev-pids
    rm .dev-pids
    echo "✅ All processes stopped"
else
    echo "⚠️  No PID file found. Processes may still be running."
    echo "Please check manually with: ps aux | grep -E '(quarkus|vite)'"
fi

echo ""
echo "👋 Development environment stopped!"
