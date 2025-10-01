#!/bin/bash

# Zeta CMS Health Check Script
# This script performs comprehensive health checks on all services

set -e

# Configuration
TIMEOUT=30
RETRY_COUNT=3
ALERT_EMAIL=""
WEBHOOK_URL=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Health check results
declare -A HEALTH_STATUS
declare -A HEALTH_MESSAGES

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

# Function to check HTTP endpoint
check_http_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local timeout="${4:-$TIMEOUT}"
    
    info "Checking $name at $url..."
    
    local response_code
    local response_time
    
    for ((i=1; i<=RETRY_COUNT; i++)); do
        response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")
        response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$timeout" "$url" 2>/dev/null || echo "0")
        
        if [ "$response_code" = "$expected_status" ]; then
            HEALTH_STATUS["$name"]="healthy"
            HEALTH_MESSAGES["$name"]="Response time: ${response_time}s"
            log "✅ $name is healthy (${response_time}s)"
            return 0
        else
            warning "Attempt $i/$RETRY_COUNT failed for $name (HTTP $response_code)"
            if [ $i -lt $RETRY_COUNT ]; then
                sleep 2
            fi
        fi
    done
    
    HEALTH_STATUS["$name"]="unhealthy"
    HEALTH_MESSAGES["$name"]="HTTP $response_code after $RETRY_COUNT attempts"
    error "❌ $name is unhealthy (HTTP $response_code)"
    return 1
}

# Function to check database
check_database() {
    local name="Database"
    info "Checking $name..."
    
    if docker-compose exec -T postgres pg_isready -U zeta_user -d zetadb > /dev/null 2>&1; then
        # Check database size
        local db_size=$(docker-compose exec -T postgres psql -U zeta_user -d zetadb -t -c "SELECT pg_size_pretty(pg_database_size('zetadb'));" 2>/dev/null | tr -d ' \n' || echo "Unknown")
        
        HEALTH_STATUS["$name"]="healthy"
        HEALTH_MESSAGES["$name"]="Size: $db_size"
        log "✅ $name is healthy (Size: $db_size)"
        return 0
    else
        HEALTH_STATUS["$name"]="unhealthy"
        HEALTH_MESSAGES["$name"]="Connection failed"
        error "❌ $name is unhealthy"
        return 1
    fi
}

# Function to check Redis
check_redis() {
    local name="Redis"
    info "Checking $name..."
    
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        # Check Redis memory usage
        local memory_usage=$(docker-compose exec -T redis redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r\n' || echo "Unknown")
        
        HEALTH_STATUS["$name"]="healthy"
        HEALTH_MESSAGES["$name"]="Memory: $memory_usage"
        log "✅ $name is healthy (Memory: $memory_usage)"
        return 0
    else
        HEALTH_STATUS["$name"]="unhealthy"
        HEALTH_MESSAGES["$name"]="Connection failed"
        error "❌ $name is unhealthy"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    local name="Disk Space"
    local threshold=90  # Alert if disk usage > 90%
    
    info "Checking $name..."
    
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    local available_space=$(df -h / | awk 'NR==2 {print $4}')
    
    if [ "$disk_usage" -lt "$threshold" ]; then
        HEALTH_STATUS["$name"]="healthy"
        HEALTH_MESSAGES["$name"]="Usage: ${disk_usage}% (Available: $available_space)"
        log "✅ $name is healthy (Usage: ${disk_usage}%)"
        return 0
    else
        HEALTH_STATUS["$name"]="warning"
        HEALTH_MESSAGES["$name"]="Usage: ${disk_usage}% (Available: $available_space) - WARNING: High usage"
        warning "⚠️  $name usage is high (${disk_usage}%)"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    local name="Memory"
    local threshold=90  # Alert if memory usage > 90%
    
    info "Checking $name..."
    
    local memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    local available_memory=$(free -h | awk 'NR==2{print $7}')
    
    if [ "$memory_usage" -lt "$threshold" ]; then
        HEALTH_STATUS["$name"]="healthy"
        HEALTH_MESSAGES["$name"]="Usage: ${memory_usage}% (Available: $available_memory)"
        log "✅ $name is healthy (Usage: ${memory_usage}%)"
        return 0
    else
        HEALTH_STATUS["$name"]="warning"
        HEALTH_MESSAGES["$name"]="Usage: ${memory_usage}% (Available: $available_memory) - WARNING: High usage"
        warning "⚠️  $name usage is high (${memory_usage}%)"
        return 1
    fi
}

# Function to check Docker containers
check_docker_containers() {
    local name="Docker Containers"
    info "Checking $name..."
    
    local total_containers=$(docker-compose ps -q | wc -l)
    local running_containers=$(docker-compose ps | grep -c "Up" || echo "0")
    
    if [ "$running_containers" -eq "$total_containers" ] && [ "$total_containers" -gt 0 ]; then
        HEALTH_STATUS["$name"]="healthy"
        HEALTH_MESSAGES["$name"]="$running_containers/$total_containers containers running"
        log "✅ $name is healthy ($running_containers/$total_containers running)"
        return 0
    else
        HEALTH_STATUS["$name"]="unhealthy"
        HEALTH_MESSAGES["$name"]="$running_containers/$total_containers containers running"
        error "❌ $name is unhealthy ($running_containers/$total_containers running)"
        return 1
    fi
}

# Function to check backup status
check_backup_status() {
    local name="Backup Status"
    info "Checking $name..."
    
    local latest_backup=$(find backup -name "zetadb_*.sql.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2- || echo "")
    local backup_count=$(find backup -name "zetadb_*.sql.gz" -type f | wc -l)
    
    if [ -n "$latest_backup" ]; then
        local backup_age=$(find "$latest_backup" -printf '%T@' 2>/dev/null | awk '{print int((systime() - $1) / 3600)}' || echo "999")
        
        if [ "$backup_age" -lt 25 ]; then  # Less than 25 hours old
            HEALTH_STATUS["$name"]="healthy"
            HEALTH_MESSAGES["$name"]="Latest backup: $backup_age hours ago ($backup_count total)"
            log "✅ $name is healthy (Latest: $backup_age hours ago)"
            return 0
        else
            HEALTH_STATUS["$name"]="warning"
            HEALTH_MESSAGES["$name"]="Latest backup: $backup_age hours ago ($backup_count total) - WARNING: Old backup"
            warning "⚠️  $name is warning (Latest: $backup_age hours ago)"
            return 1
        fi
    else
        HEALTH_STATUS["$name"]="unhealthy"
        HEALTH_MESSAGES["$name"]="No backups found"
        error "❌ $name is unhealthy (No backups found)"
        return 1
    fi
}

# Function to send alert
send_alert() {
    local message="$1"
    
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Zeta CMS Health Alert" "$ALERT_EMAIL" 2>/dev/null || true
    fi
    
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST -H "Content-Type: application/json" \
             -d "{\"text\":\"$message\"}" \
             "$WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Function to run all health checks
run_all_checks() {
    log "Starting comprehensive health check..."
    
    local overall_healthy=true
    local warning_count=0
    local error_count=0
    
    # Service checks
    check_http_endpoint "Backend API" "http://localhost:4000/api/health"
    check_http_endpoint "Frontend" "http://localhost:8080"
    check_database
    check_redis
    
    # System checks
    check_disk_space
    check_memory
    check_docker_containers
    check_backup_status
    
    # Count issues
    for status in "${HEALTH_STATUS[@]}"; do
        case "$status" in
            "unhealthy")
                error_count=$((error_count + 1))
                overall_healthy=false
                ;;
            "warning")
                warning_count=$((warning_count + 1))
                ;;
        esac
    done
    
    # Generate summary
    echo ""
    log "Health Check Summary:"
    echo "===================="
    
    for service in "${!HEALTH_STATUS[@]}"; do
        local status="${HEALTH_STATUS[$service]}"
        local message="${HEALTH_MESSAGES[$service]}"
        
        case "$status" in
            "healthy")
                echo -e "✅ $service: $message"
                ;;
            "warning")
                echo -e "⚠️  $service: $message"
                ;;
            "unhealthy")
                echo -e "❌ $service: $message"
                ;;
        esac
    done
    
    echo ""
    if [ "$overall_healthy" = true ]; then
        log "🎉 All systems are healthy!"
        if [ "$warning_count" -gt 0 ]; then
            warning "⚠️  $warning_count warnings detected"
        fi
    else
        error "🚨 $error_count critical issues detected!"
        if [ "$warning_count" -gt 0 ]; then
            warning "⚠️  $warning_count warnings detected"
        fi
        
        # Send alert
        local alert_message="Zeta CMS Health Alert: $error_count critical issues, $warning_count warnings detected at $(date)"
        send_alert "$alert_message"
    fi
    
    return $([ "$overall_healthy" = true ] && echo 0 || echo 1)
}

# Function to show help
show_help() {
    echo "Zeta CMS Health Check Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --email <email>       - Email for alerts"
    echo "  --webhook <url>       - Webhook URL for alerts"
    echo "  --timeout <seconds>   - HTTP timeout (default: 30)"
    echo "  --retry <count>       - Retry count (default: 3)"
    echo "  --help                - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Basic health check"
    echo "  $0 --email admin@example.com         # With email alerts"
    echo "  $0 --webhook https://hooks.slack.com # With webhook alerts"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --email)
            ALERT_EMAIL="$2"
            shift 2
            ;;
        --webhook)
            WEBHOOK_URL="$2"
            shift 2
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        --retry)
            RETRY_COUNT="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run health checks
run_all_checks
