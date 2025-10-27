# Smart ISP Django Backend Docker Setup

## Overview
This Docker setup provides a complete development environment for the Smart ISP Django backend with MongoDB integration.

## Services Included
- **Django Backend**: Django application with djongo for MongoDB integration
- **MongoDB**: Database service with authentication
- **Nginx**: Web server for static files and reverse proxy (optional)

## Quick Start

### 1. Clone and Navigate
```bash
cd django-backend
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your settings
nano .env
```

### 3. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Django Admin**: http://localhost:8000/admin/
- **API**: http://localhost:8000/api/
- **MongoDB**: localhost:27017

## Environment Variables

### Django Settings
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### MongoDB Settings
- `MONGODB_HOST`: MongoDB host (default: mongodb)
- `MONGODB_PORT`: MongoDB port (default: 27017)
- `MONGODB_USERNAME`: MongoDB username (default: admin)
- `MONGODB_PASSWORD`: MongoDB password (default: password123)
- `MONGODB_DATABASE`: Database name (default: smart_isp_db)

## Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild services
docker-compose up --build

# View logs
docker-compose logs -f django-backend
docker-compose logs -f mongodb
```

### Django Management
```bash
# Run Django commands
docker-compose exec django-backend python manage.py makemigrations
docker-compose exec django-backend python manage.py migrate
docker-compose exec django-backend python manage.py createsuperuser
docker-compose exec django-backend python manage.py collectstatic

# Access Django shell
docker-compose exec django-backend python manage.py shell

# Run tests
docker-compose exec django-backend python manage.py test
```

### Database Operations
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

## Development Workflow

### 1. First Time Setup
```bash
# Build and start services
docker-compose up --build

# Create superuser
docker-compose exec django-backend python manage.py createsuperuser

# Access admin panel
open http://localhost:8000/admin/
```

### 2. Daily Development
```bash
# Start services
docker-compose up

# Make changes to code
# Changes are automatically reflected due to volume mounting

# Run migrations when needed
docker-compose exec django-backend python manage.py makemigrations
docker-compose exec django-backend python manage.py migrate
```

### 3. Production Deployment
```bash
# Update environment variables for production
# Set DEBUG=False
# Update ALLOWED_HOSTS
# Use strong SECRET_KEY

# Build production image
docker-compose -f docker-compose.prod.yml up --build
```

## File Structure
```
django-backend/
├── Dockerfile              # Django container definition
├── docker-compose.yml      # Multi-service orchestration
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── nginx.conf             # Nginx configuration
├── manage.py              # Django management script
├── django_backend/        # Django project settings
├── clients/               # Clients app
├── collectors/            # Collectors app
├── dashboard/             # Dashboard app
├── payments_and_logs/     # Payments app
├── reports/               # Reports app
└── routers/              # Routers app
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8000
   lsof -i :27017
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Django Migration Issues**
   ```bash
   # Reset migrations
   docker-compose exec django-backend python manage.py migrate --fake-initial
   
   # Or start fresh
   docker-compose down -v
   docker-compose up --build
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Useful Commands
```bash
# View container status
docker-compose ps

# View resource usage
docker stats

# Clean up unused containers/images
docker system prune -a

# View detailed logs
docker-compose logs --tail=100 -f django-backend
```

## Security Notes

### Development
- Default MongoDB credentials are for development only
- DEBUG=True should only be used in development
- CORS is open for development convenience

### Production
- Change all default passwords
- Set DEBUG=False
- Use environment-specific SECRET_KEY
- Configure proper ALLOWED_HOSTS
- Use HTTPS with proper SSL certificates
- Enable MongoDB authentication
- Use Docker secrets for sensitive data

## Monitoring

### Health Checks
```bash
# Check Django health
curl http://localhost:8000/admin/

# Check MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f django-backend
docker-compose logs -f mongodb
docker-compose logs -f nginx
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup to host
docker cp smart_isp_mongodb:/data/backup ./mongodb-backup
```

### Database Restore
```bash
# Copy backup to container
docker cp ./mongodb-backup smart_isp_mongodb:/data/backup

# Restore database
docker-compose exec mongodb mongorestore /data/backup
```

## Performance Optimization

### Django Settings
- Enable caching
- Use database connection pooling
- Optimize static file serving
- Enable gzip compression

### MongoDB Settings
- Configure appropriate indexes
- Use replica sets for high availability
- Monitor query performance
- Use appropriate sharding strategies

## Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure all services are running: `docker-compose ps`
4. Check network connectivity between containers
