#!/bin/bash

# Zeta CMS Database Backup Script
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backup"
DB_NAME="zetadb"
DB_USER="zeta_user"
DB_HOST="postgres"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/zetadb_${TIMESTAMP}.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create backup
create_backup() {
    log "Starting database backup..."
    
    # Wait for database to be ready
    until pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; do
        warning "Waiting for database to be ready..."
        sleep 2
    done
    
    # Create backup
    if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"; then
        log "Backup created successfully: $BACKUP_FILE"
        
        # Compress backup
        gzip "$BACKUP_FILE"
        log "Backup compressed: ${BACKUP_FILE}.gz"
        
        # Get file size
        FILE_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
        log "Backup size: $FILE_SIZE"
        
    else
        error "Backup failed!"
        exit 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    # Find and delete old backups
    OLD_BACKUPS=$(find "$BACKUP_DIR" -name "zetadb_*.sql.gz" -mtime +$RETENTION_DAYS)
    
    if [ -n "$OLD_BACKUPS" ]; then
        echo "$OLD_BACKUPS" | xargs rm -f
        log "Removed old backups"
    else
        log "No old backups to remove"
    fi
}

# Function to list current backups
list_backups() {
    log "Current backups:"
    ls -lah "$BACKUP_DIR"/zetadb_*.sql.gz 2>/dev/null || log "No backups found"
}

# Function to restore from backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "Please specify backup file to restore"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Restoring from backup: $backup_file"
    
    # Wait for database to be ready
    until pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; do
        warning "Waiting for database to be ready..."
        sleep 2
    done
    
    # Restore backup
    if gunzip -c "$backup_file" | psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; then
        log "Database restored successfully"
    else
        error "Database restore failed!"
        exit 1
    fi
}

# Main script logic
case "${1:-backup}" in
    "backup")
        create_backup
        cleanup_old_backups
        list_backups
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "cleanup")
        cleanup_old_backups
        list_backups
        ;;
    *)
        echo "Usage: $0 {backup|restore|list|cleanup}"
        echo ""
        echo "Commands:"
        echo "  backup   - Create a new backup (default)"
        echo "  restore  - Restore from a backup file"
        echo "  list     - List all available backups"
        echo "  cleanup  - Remove old backups"
        echo ""
        echo "Examples:"
        echo "  $0 backup"
        echo "  $0 restore /backup/zetadb_20241201_120000.sql.gz"
        echo "  $0 list"
        exit 1
        ;;
esac

log "Script completed successfully"
