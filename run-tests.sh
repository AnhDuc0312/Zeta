#!/bin/bash

# Zeta CMS Test Execution Script
# Chạy tất cả các loại test cho project

set -e

echo "🚀 Starting Zeta CMS Test Suite..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for service at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "Service is ready at $url"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting for service..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Service at $url is not responding after $max_attempts attempts"
    return 1
}

# Parse command line arguments
RUN_BACKEND_TESTS=true
RUN_FRONTEND_TESTS=true
RUN_E2E_TESTS=true
RUN_PERFORMANCE_TESTS=false
RUN_SPECIFIC_TESTS=""
VERBOSE=false
CLEANUP=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            RUN_FRONTEND_TESTS=false
            RUN_E2E_TESTS=false
            shift
            ;;
        --frontend-only)
            RUN_BACKEND_TESTS=false
            RUN_E2E_TESTS=false
            shift
            ;;
        --e2e-only)
            RUN_BACKEND_TESTS=false
            RUN_FRONTEND_TESTS=false
            shift
            ;;
        --performance)
            RUN_PERFORMANCE_TESTS=true
            shift
            ;;
        --test=*)
            RUN_SPECIFIC_TESTS="${1#*=}"
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --no-cleanup)
            CLEANUP=false
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-only      Run only backend tests"
            echo "  --frontend-only     Run only frontend tests"
            echo "  --e2e-only         Run only E2E tests"
            echo "  --performance      Include performance tests"
            echo "  --test=CATEGORY    Run specific test category (auth, content, admin, api, performance)"
            echo "  --verbose          Enable verbose output"
            echo "  --no-cleanup       Skip cleanup after tests"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "builder-orbit-lab-main" ]; then
    print_error "Please run this script from the Zeta CMS root directory"
    exit 1
fi

# Set up environment
export NODE_ENV=test
export DATABASE_URL=${DATABASE_URL:-"postgres://postgres:postgres@localhost:5432/zeta_cms_test"}

# Function to run backend tests
run_backend_tests() {
    print_status "Running backend tests..."
    
    cd backend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Setup test database
    print_status "Setting up test database..."
    if [ -f "scripts/setup-test-db.ts" ]; then
        npm run db:setup:test || print_warning "Database setup failed, continuing with existing data"
    fi
    
    # Run tests
    if [ -n "$RUN_SPECIFIC_TESTS" ]; then
        print_status "Running specific backend tests: $RUN_SPECIFIC_TESTS"
        npm run test:$RUN_SPECIFIC_TESTS
    else
        print_status "Running all backend tests..."
        npm run test:all
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        return 1
    fi
    
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    
    cd builder-orbit-lab-main
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Run tests
    print_status "Running frontend tests..."
    npm test -- --run
    
    if [ $? -eq 0 ]; then
        print_success "Frontend tests passed"
    else
        print_error "Frontend tests failed"
        return 1
    fi
    
    cd ..
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    # Check if E2E tests directory exists
    if [ ! -d "e2e-tests" ]; then
        print_warning "E2E tests directory not found, skipping E2E tests"
        return 0
    fi
    
    cd e2e-tests
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing E2E test dependencies..."
        npm install
    fi
    
    # Install Playwright browsers if needed
    if [ ! -d "node_modules/@playwright/test" ]; then
        print_status "Installing Playwright browsers..."
        npm run test:install
    fi
    
    # Start backend server for E2E tests
    print_status "Starting backend server for E2E tests..."
    cd ../backend
    npm run dev &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    wait_for_service "http://localhost:4000/api/health" || {
        print_error "Backend server failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        return 1
    }
    
    # Start frontend server for E2E tests
    print_status "Starting frontend server for E2E tests..."
    cd ../builder-orbit-lab-main
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    wait_for_service "http://localhost:8080" || {
        print_error "Frontend server failed to start"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
        return 1
    }
    
    # Run E2E tests
    cd ../e2e-tests
    if [ -n "$RUN_SPECIFIC_TESTS" ]; then
        print_status "Running specific E2E tests: $RUN_SPECIFIC_TESTS"
        npm run test:$RUN_SPECIFIC_TESTS
    else
        print_status "Running all E2E tests..."
        npm run test
    fi
    
    E2E_RESULT=$?
    
    # Stop servers
    print_status "Stopping test servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    
    if [ $E2E_RESULT -eq 0 ]; then
        print_success "E2E tests passed"
    else
        print_error "E2E tests failed"
        return 1
    fi
    
    cd ..
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    if [ ! -d "e2e-tests" ]; then
        print_warning "E2E tests directory not found, skipping performance tests"
        return 0
    fi
    
    cd e2e-tests
    
    # Run performance tests
    npm run test:performance
    
    if [ $? -eq 0 ]; then
        print_success "Performance tests passed"
    else
        print_error "Performance tests failed"
        return 1
    fi
    
    cd ..
}

# Function to cleanup
cleanup() {
    if [ "$CLEANUP" = true ]; then
        print_status "Cleaning up test data..."
        
        # Cleanup backend test data
        if [ -d "backend" ] && [ -f "backend/scripts/cleanup-test-db.ts" ]; then
            cd backend
            npm run db:cleanup:test 2>/dev/null || print_warning "Backend cleanup failed"
            cd ..
        fi
        
        # Cleanup E2E test data
        if [ -d "e2e-tests" ] && [ -f "e2e-tests/scripts/setup-test-data.ts" ]; then
            cd e2e-tests
            npm run cleanup:test-data 2>/dev/null || print_warning "E2E cleanup failed"
            cd ..
        fi
        
        print_success "Cleanup completed"
    fi
}

# Main execution
main() {
    local exit_code=0
    
    # Run tests based on configuration
    if [ "$RUN_BACKEND_TESTS" = true ]; then
        run_backend_tests || exit_code=1
    fi
    
    if [ "$RUN_FRONTEND_TESTS" = true ]; then
        run_frontend_tests || exit_code=1
    fi
    
    if [ "$RUN_E2E_TESTS" = true ]; then
        run_e2e_tests || exit_code=1
    fi
    
    if [ "$RUN_PERFORMANCE_TESTS" = true ]; then
        run_performance_tests || exit_code=1
    fi
    
    # Cleanup
    cleanup
    
    # Final result
    if [ $exit_code -eq 0 ]; then
        print_success "All tests completed successfully! 🎉"
    else
        print_error "Some tests failed! ❌"
    fi
    
    exit $exit_code
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main

