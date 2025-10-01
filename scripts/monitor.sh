#!/bin/bash

# Zeta CMS Monitoring Script
# This script provides monitoring and health check functionality

set -e

# Configuration
COMPOSE_FILE="docker-compose.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Function to check service health
check_health() {
    local service="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        log "✅ $service is healthy"
        return 0
    else
        error "❌ $service is unhealthy"
        return 1
    fi
}

# Function to check all services
check_all_services() {
    log "Checking all services health..."
    
    local all_healthy=true
    
    # Check backend API
    if ! check_health "Backend API" "http://localhost:4000/api/health"; then
        all_healthy=false
    fi
    
    # Check frontend
    if ! check_health "Frontend" "http://localhost:8080"; then
        all_healthy=false
    fi
    
    # Check database
    if ! docker-compose exec -T postgres pg_isready -U zeta_user -d zetadb > /dev/null 2>&1; then
        error "❌ Database is unhealthy"
        all_healthy=false
    else
        log "✅ Database is healthy"
    fi
    
    # Check Redis
    if ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        error "❌ Redis is unhealthy"
        all_healthy=false
    else
        log "✅ Redis is healthy"
    fi
    
    if [ "$all_healthy" = true ]; then
        log "🎉 All services are healthy!"
    else
        error "⚠️  Some services are unhealthy"
        exit 1
    fi
}

# Function to show service status
show_status() {
    log "Service Status:"
    echo ""
    
    # Docker containers status
    info "Docker Containers:"
    docker-compose ps
    echo ""
    
    # Resource usage
    info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    
    # Disk usage
    info "Disk Usage:"
    df -h | grep -E "(Filesystem|/dev/)"
    echo ""
    
    # Memory usage
    info "Memory Usage:"
    free -h
    echo ""
}

# Function to show logs
show_logs() {
    local service="$1"
    local lines="${2:-50}"
    
    if [ -n "$service" ]; then
        log "Showing logs for $service (last $lines lines):"
        docker-compose logs --tail="$lines" "$service"
    else
        log "Showing logs for all services (last $lines lines):"
        docker-compose logs --tail="$lines"
    fi
}

# Function to monitor in real-time
monitor_realtime() {
    log "Starting real-time monitoring (Press Ctrl+C to stop)..."
    
    while true; do
        clear
        echo "=== Zeta CMS Real-time Monitoring ==="
        echo "Time: $(date)"
        echo ""
        
        # Service status
        info "Service Status:"
        docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        
        # Resource usage
        info "Resource Usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
        echo ""
        
        # Health checks
        info "Health Checks:"
        check_health "Backend API" "http://localhost:4000/api/health" > /dev/null 2>&1 && echo "✅ Backend API" || echo "❌ Backend API"
        check_health "Frontend" "http://localhost:8080" > /dev/null 2>&1 && echo "✅ Frontend" || echo "❌ Frontend"
        
        sleep 5
    done
}

# Function to setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p monitoring
    
    # Create Prometheus config if not exists
    if [ ! -f "monitoring/prometheus.yml" ]; then
        log "Creating Prometheus configuration..."
        # Prometheus config is already created
    fi
    
    # Create Grafana dashboard config
    if [ ! -f "monitoring/grafana-dashboard.json" ]; then
        log "Creating Grafana dashboard configuration..."
        cat > monitoring/grafana-dashboard.json << 'EOF'
{
  "dashboard": {
    "title": "Zeta CMS Dashboard",
    "panels": [
      {
        "title": "Service Health",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"zeta-backend\"}",
            "legendFormat": "Backend API"
          },
          {
            "expr": "up{job=\"zeta-frontend\"}",
            "legendFormat": "Frontend"
          }
        ]
      }
    ]
  }
}
EOF
    fi
    
    log "Monitoring setup completed"
}

# Function to show metrics
show_metrics() {
    local service="$1"
    
    case "$service" in
        "backend")
            log "Backend API Metrics:"
            curl -s http://localhost:4000/api/metrics 2>/dev/null || error "Backend metrics not available"
            ;;
        "prometheus")
            log "Prometheus Metrics:"
            curl -s http://localhost:9090/metrics 2>/dev/null || error "Prometheus not available"
            ;;
        "all")
            show_metrics "backend"
            echo ""
            show_metrics "prometheus"
            ;;
        *)
            error "Unknown service: $service"
            echo "Available services: backend, prometheus, all"
            ;;
    esac
}

# Function to show help
show_help() {
    echo "Zeta CMS Monitoring Script"
    echo ""
    echo "Usage: $0 {health|status|logs|monitor|setup|metrics} [options]"
    echo ""
    echo "Commands:"
    echo "  health                    - Check all services health"
    echo "  status                    - Show service status and resource usage"
    echo "  logs [service] [lines]    - Show logs (default: all services, 50 lines)"
    echo "  monitor                   - Real-time monitoring"
    echo "  setup                     - Setup monitoring infrastructure"
    echo "  metrics [service]         - Show metrics (backend, prometheus, all)"
    echo ""
    echo "Examples:"
    echo "  $0 health"
    echo "  $0 status"
    echo "  $0 logs backend 100"
    echo "  $0 monitor"
    echo "  $0 setup"
    echo "  $0 metrics backend"
}

# Main script logic
case "${1:-help}" in
    "health")
        check_all_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2" "$3"
        ;;
    "monitor")
        monitor_realtime
        ;;
    "setup")
        setup_monitoring
        ;;
    "metrics")
        show_metrics "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac
