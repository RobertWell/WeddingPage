# Deployment Guide

## Quick Start (Development)

### Option 1: Using the startup script
```bash
./start-dev.sh
```

This will start both frontend and backend automatically.

### Option 2: Manual start

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw quarkus:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Option 1: Docker Compose (Recommended)

1. Set up environment variables:
```bash
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
```

2. Place your Google credentials:
```bash
cp /path/to/credentials.json backend/credentials.json
```

3. Build and run:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8080

### Option 2: Manual Production Build

**Backend:**
```bash
cd backend
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

**Frontend:**
```bash
cd frontend
npm run build

# Serve with your preferred web server
# Example with nginx:
cp -r dist/* /var/www/html/
```

## Google Sheets Setup

### 1. Create Spreadsheet

Create a Google Spreadsheet with two sheets:

**Sheet 1: config**
```
| key                    | zh              | en              |
|------------------------|-----------------|-----------------|
| nav.brand              | 森語誓約        | Forest Promise  |
| hero.names             | 昊然 & 予晴     | Haoran & Yu-Ching |
| ...                    | ...             | ...             |
```

**Sheet 2: rsvp**
```
| timestamp           | name    | guests | diet      | message | locale | source |
|--------------------|---------|--------|-----------|---------|--------|--------|
| (auto-populated)   | ...     | ...    | ...       | ...     | ...    | ...    |
```

### 2. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google Sheets API"
4. Create OAuth 2.0 credentials (Desktop application)
5. Download credentials as `credentials.json`

### 3. Configure Backend

Place `credentials.json` in the `backend/` directory:
```bash
cp ~/Downloads/credentials.json backend/credentials.json
```

Update `backend/src/main/resources/application.properties`:
```properties
google.sheets.spreadsheet-id=YOUR_SPREADSHEET_ID_HERE
```

### 4. First Run Authorization

The first time you run the backend, it will:
1. Open a browser window
2. Ask you to authorize the application
3. Store tokens in `backend/tokens/` directory

Keep the `tokens/` directory secure and don't commit it to git.

## Environment Variables

### Backend
- `GOOGLE_SHEETS_SPREADSHEET_ID` - Your Google Sheets ID
- `GOOGLE_SHEETS_CREDENTIALS_PATH` - Path to credentials.json (default: credentials.json)

### Frontend
- Configure API endpoint in `vite.config.ts` if deploying to different domain

## Nginx Configuration (Production)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/wedding/frontend;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Checklist

- [ ] Never commit `credentials.json`
- [ ] Never commit `tokens/` directory
- [ ] Set up CORS properly for production
- [ ] Use HTTPS in production
- [ ] Restrict Google Sheets API permissions
- [ ] Use environment variables for sensitive data
- [ ] Set up rate limiting on API endpoints

## Troubleshooting

### Backend won't start
- Check Java version: `java -version` (need 17+)
- Check if port 8080 is available: `lsof -i :8080`
- Check logs in `backend.log`

### Frontend won't start
- Check Node version: `node -v` (need 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 3000 is available: `lsof -i :3000`
- Check logs in `frontend.log`

### Google Sheets connection fails
- Verify credentials.json is valid
- Check spreadsheet ID is correct
- Ensure Google Sheets API is enabled
- Check network connectivity

### CORS errors
- Update `application.properties` with correct frontend URL
- Check browser console for specific CORS error

## Monitoring

### Logs
- Backend: `tail -f backend.log`
- Frontend: `tail -f frontend.log`

### Health Checks
- Backend health: `curl http://localhost:8080/q/health`
- API test: `curl http://localhost:8080/api/config`

## Backup

Regularly backup:
- Google Sheets data
- `credentials.json` (securely)
- `tokens/` directory (securely)
- Frontend images and assets

## Scaling

For high traffic:
1. Use CDN for frontend assets
2. Enable Redis caching for config data
3. Use connection pooling for Google Sheets API
4. Consider serverless deployment (AWS Lambda, Google Cloud Run)

## Support

For issues:
1. Check logs
2. Review this guide
3. Check README-VUE.md for setup details
4. Verify Google Sheets API quota
