#!/usr/bin/env bash
# CampusEase – Full Stack Startup Script

echo "=========================================================="
echo " Starting CampusEase – Campus Resource Booking Platform"
echo "=========================================================="

# Check and activate virtual environment
if [ -d "backend/venv" ]; then
    echo "✓ Found Python virtual environment"
else
    echo "Creating virtual environment..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# Run migrations
echo "✓ Applying any pending database migrations..."
backend/venv/bin/python backend/manage.py migrate

# Trap to kill background processes on exit (Ctrl+C)
cleanup() {
    echo ""
    echo "Stopping CampusEase servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start Django Backend on port 8000
echo "✓ Starting Django REST API Backend on http://localhost:8000..."
backend/venv/bin/python backend/manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Start Vite Frontend on port 5173
echo "✓ Starting Vite React Frontend on http://localhost:5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================================="
echo " CampusEase is up and running!"
echo " Frontend: http://localhost:5173"
echo " Backend:  http://localhost:8000/api/"
echo ""
echo " Demo Accounts:"
echo " • Administrator: admin   / admin123"
echo " • Student:       student / student123"
echo "=========================================================="
echo "Press Ctrl+C to stop all servers."

wait
