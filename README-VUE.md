# Wedding Page - Vue + TypeScript + Quarkus/Kotlin

A modern wedding invitation website built with Vue 3, TypeScript, and Quarkus/Kotlin backend.

## Features

- **Vue 3 + TypeScript**: Modern frontend with full type safety
- **Functional Programming**: Composable-based architecture
- **Modular Components**: Separated concerns for maintainability
- **Theme System**: Three beautiful themes (Spring, Khaki, Breeze)
- **Internationalization**: Full bilingual support (Chinese/English)
- **Quarkus/Kotlin Backend**: High-performance backend API
- **Google Sheets Integration**: RSVP data stored in Google Sheets
- **Secure API**: Backend handles Google Sheets operations

## Project Structure

```
WeddingPage/
├── frontend/                 # Vue 3 + TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── composables/     # Reusable composition functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── services/        # API services
│   │   ├── locales/         # i18n translations
│   │   ├── assets/          # Images and static files
│   │   ├── App.vue          # Main app component
│   │   ├── main.ts          # Entry point
│   │   └── style.css        # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                  # Quarkus + Kotlin Backend
│   ├── src/main/kotlin/com/wedding/
│   │   ├── resource/        # REST API endpoints
│   │   ├── service/         # Business logic
│   │   └── model/           # Data models
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── index.html               # Original HTML (reference)
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- Google Cloud Project with Sheets API enabled

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure Google Sheets credentials:
   - Download your Google Cloud credentials JSON file
   - Place it in the backend directory as `credentials.json`
   - Update `application.properties` with your spreadsheet ID

3. Set environment variables (optional):
```bash
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
export GOOGLE_SHEETS_CREDENTIALS_PATH="credentials.json"
```

4. Run the backend:
```bash
./mvnw quarkus:dev
```

The backend API will be available at `http://localhost:8080`

### Google Sheets Setup

1. Create a Google Spreadsheet with two sheets:
   - `config`: Contains i18n configuration (columns: key, zh, en)
   - `rsvp`: For storing RSVP submissions

2. Enable Google Sheets API in your Google Cloud Console

3. Create OAuth 2.0 credentials and download the JSON file

4. The first time you run the backend, it will open a browser for OAuth authorization

## Build for Production

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

### Backend

```bash
cd backend
./mvnw package
```

Run the production build:
```bash
java -jar target/quarkus-app/quarkus-run.jar
```

## API Endpoints

- `GET /api/config` - Retrieve i18n configuration
- `POST /api/rsvp` - Submit RSVP form

## Theme System

The theme system uses CSS variables and Vue composables:

- **Spring**: Green/fresh palette (default)
- **Khaki**: Warm/earthy palette
- **Breeze**: Cool/blue palette

Themes are managed through the `useTheme` composable and persist in localStorage.

## Internationalization

Translations are managed using `vue-i18n`:
- Chinese (zh)
- English (en)

Locale files are in `frontend/src/locales/`

## Development

### Type Checking

```bash
cd frontend
npm run type-check
```

### Building

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
./mvnw clean package
```

## Security Notes

- Google Sheets API credentials should never be committed
- The backend handles all Google Sheets operations
- CORS is configured for development (adjust for production)
- Use environment variables for sensitive configuration

## Migration from Original HTML

This Vue version maintains all features from the original HTML page:
- ✅ All three themes preserved
- ✅ Background animations maintained
- ✅ Bilingual support (zh/en)
- ✅ RSVP form functionality
- ✅ Google Sheets integration (now via backend)
- ✅ Responsive design
- ✅ Smooth scrolling and animations

## License

This project is for personal use.
