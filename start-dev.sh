#!/bin/bash

# Wedding Page Development Startup Script

echo "🎉 Starting Wedding Page Development Environment..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 17+"
    exit 1
fi

if ! command_exists mvn; then
    echo "❌ Maven is not installed. Please install Maven 3.8+"
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

# Start backend
echo "🚀 Starting Quarkus backend..."
cd backend
./mvnw quarkus:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "📝 Backend logs: tail -f backend.log"
echo ""

# Wait a bit for backend to start
sleep 5

# Start frontend
echo "🚀 Starting Vue frontend..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "📝 Frontend logs: tail -f frontend.log"
echo ""

# Save PIDs to file for cleanup
echo "$BACKEND_PID" > .dev-pids
echo "$FRONTEND_PID" >> .dev-pids

echo "✨ Development environment is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo ""
echo "To stop the servers, run: ./stop-dev.sh"
echo "Or press Ctrl+C and kill processes manually"
echo ""
echo "Happy coding! 💕"
