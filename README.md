# Missing Person Finder System

A comprehensive web application for managing missing person cases with intelligent CCTV monitoring and volunteer coordination.

## Features

- **User Authentication**: JWT-based authentication for different user types (Police, Care Partners, Volunteers)
- **Missing Person Management**: Create, update, and track missing person reports
- **CCTV Integration**: AI-powered facial recognition for automatic detection
- **Volunteer Coordination**: Allow volunteers to report findings and coordinate search efforts
- **Real-time Dashboard**: Statistics and quick actions for efficient case management
- **Search and Filter**: Advanced search capabilities by name, status, and area

## Technology Stack

### Backend
- **Java Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **SQL Server** database
- **Maven** for dependency management

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **Day.js** for date handling

## Database Schema

The system uses the following main entities:
- **ACCOUNT**: User accounts with authentication
- **MISSING_DOCUMENT**: Missing person records
- **AREA**: Geographic areas for tracking
- **POLICE**: Police officer accounts
- **VOLUNTEER**: Volunteer accounts
- **CARE_PARTNER**: Care partner accounts
- **CCTV**: Camera systems for monitoring
- **MANAGE_DOCUMENT**: Police management of cases
- **INTEREST_PROFILE**: Volunteer interest tracking
- **CCTV_REPORT**: AI detection reports

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Java 17 or higher (for local development)
- Node.js 16 or higher (for local development)
- Maven 3.6 or higher (for local development)

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Start all services with hot reload**:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   This will start:
   - SQL Server database on port `1433`
   - Spring Boot backend on port `8080` (with hot reload)
   - React frontend on port `3000` (with hot reload)

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`
   - Database: `localhost:1433`

4. **Stop all services**:
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

### Hot Reload Development

The development environment supports automatic reload when you save changes:

#### Backend (Spring Boot)
- Edit any Java file in `backend/src/`
- Press **Ctrl+S** (or Cmd+S on Mac)
- Wait 1-2 seconds - the application automatically restarts
- Changes are live!

**How it works:**
- Spring Boot DevTools monitors classpath changes
- Docker volumes sync your source code
- Application context restarts (fast, ~1-3 seconds)

#### Frontend (React)
- Edit any file in `frontend/src/`
- Press **Ctrl+S**
- Browser automatically refreshes with changes
- No manual reload needed!

### View Logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Backend only
docker compose -f docker-compose.dev.yml logs -f backend-app

# Frontend only
docker compose -f docker-compose.dev.yml logs -f frontend-app
```

### Local Development (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Update database configuration** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=IntelligentSystemDB;encrypt=false;
   spring.datasource.username=sa
   spring.datasource.password=MinhMinh@1234
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080`

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Production Build

For production deployment without hot reload:

```bash
docker compose up --build
```

This creates optimized builds without development tools.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Missing Documents
- `GET /api/missing-documents` - Get all missing persons
- `GET /api/missing-documents/{id}` - Get specific missing person
- `GET /api/missing-documents/status/{status}` - Filter by status
- `GET /api/missing-documents/search?name={name}` - Search by name
- `POST /api/missing-documents` - Create new missing person report
- `PUT /api/missing-documents/{id}` - Update missing person
- `PUT /api/missing-documents/{id}/status` - Update status
- `DELETE /api/missing-documents/{id}` - Delete missing person

### Areas
- `GET /api/areas` - Get all areas
- `POST /api/areas` - Create new area

### Care Partners
- `GET /api/care-partners` - Get all care partners

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View statistics and quick actions
3. **Add Missing Person**: Create new missing person reports
4. **View Cases**: Browse and search through missing person cases
5. **Update Status**: Mark cases as found or missing
6. **Search**: Use the search functionality to find specific cases

## Sample Data

The database includes sample data for testing:
- Police officer account (username: `police_trung`)
- Care partner account (username: `partner_lien`)
- Volunteer account (username: `volun_minh`)
- Sample missing person case for "Trần Thị Mai"
- Sample areas and CCTV systems

## Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication
- Role-based access control (ready for implementation)

## Development Notes

- The application uses SQL Server with Vietnamese Unicode support
- All text fields support Vietnamese characters
- Date/time handling uses Java 8 Time API
- Frontend uses Material-UI for consistent design
- API responses include proper error handling

## Future Enhancements

- Real-time notifications
- Image upload functionality
- Advanced search filters
- Mobile app development
- Integration with external CCTV systems
- Machine learning model integration for facial recognition
