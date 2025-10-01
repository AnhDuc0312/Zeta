#!/bin/bash

# Demo Test Script for Zeta CMS
echo "🚀 Starting Zeta CMS Demo Test..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "builder-orbit-lab-main" ]; then
    print_error "Please run this script from the Zeta CMS root directory"
    exit 1
fi

# Start backend server
print_status "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:4000/api/health > /dev/null; then
    print_success "Backend is running on port 4000"
else
    print_warning "Backend might not be running, continuing anyway..."
fi

# Start frontend server
print_status "Starting frontend server..."
cd builder-orbit-lab-main
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_status "Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if curl -s http://localhost:8080 > /dev/null; then
    print_success "Frontend is running on port 8080"
else
    print_warning "Frontend might not be running, continuing anyway..."
fi

# Run E2E tests
print_status "Running E2E tests..."
cd e2e-tests

# Run only the demo test
npx playwright test tests/demo.spec.ts --headed

TEST_RESULT=$?

# Stop servers
print_status "Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true

# Show results
if [ $TEST_RESULT -eq 0 ]; then
    print_success "Demo tests completed successfully! 🎉"
    print_status "Check the screenshots in e2e-tests/ for visual results"
else
    print_error "Demo tests failed! ❌"
fi

cd ..

print_status "Demo test completed!"

