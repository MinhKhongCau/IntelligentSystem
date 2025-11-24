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

### AI/ML Services
- **Python 3.x** for intelligent services
- **TensorFlow/Keras** for facial recognition
- **FaceNet** pre-trained model for face embeddings
- **ChromaDB** for vector storage
- **Apache Kafka** for real-time video streaming
- **Flask** for AI service API

### Infrastructure
- **Docker & Docker Compose** for containerization
- **Kafka & Zookeeper** for message streaming
- **SQL Server 2019** for data persistence

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
- SQL Server Management Studio or Azure Data Studio (for database management)

### Quick Start with Docker (Recommended)

#### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

#### 2. Initialize the Database

**Option A: Using Docker SQL Server**

First, start only the database service:
```bash
docker compose -f docker-compose.dev.yml up -d sqlserver
```

Wait for SQL Server to be ready (about 30 seconds), then restore the database using the backup file:

```bash
# Connect to SQL Server and run the backup script
docker exec -it <sqlserver-container-name> /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'MinhMinh@1234' \
  -i /path/to/BK_DBS_INTELLIGENT_SYS_6-11-2024.sql
```

**Option B: Using SQL Server Management Studio**

1. Connect to `localhost:1433` with credentials:
   - Username: `sa`
   - Password: `MinhMinh@1234`
2. Open the file `BK_DBS_INTELLIGENT_SYS_6-11-2024.sql`
3. Execute the script to create the database and tables with sample data

#### 3. Build and Start All Services

**For development with hot reload:**
```bash
docker compose -f docker-compose.dev.yml up --build
```

**For production:**
```bash
docker compose up --build
```

This will start:
- SQL Server database on port `1433`
- Spring Boot backend on port `8080` (with hot reload in dev mode)
- React frontend on port `3000` (with hot reload in dev mode)
- Kafka (if configured) on port `9092`
- Zookeeper (if configured) on port `2181`

#### 4. Access the application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Database: `localhost:1433`

#### 5. Stop all services
```bash
# Stop and remove containers
docker compose -f docker-compose.dev.yml down

# Stop and remove containers with volumes (clean slate)
docker compose -f docker-compose.dev.yml down -v
```

### Rebuild After Changes

If you need to rebuild the containers after making changes:

```bash
# Stop existing containers
docker compose -f docker-compose.dev.yml down

# Rebuild and start
docker compose -f docker-compose.dev.yml up --build
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

#### Database Setup

1. **Install SQL Server 2019 or later**
2. **Create the database** by running `BK_DBS_INTELLIGENT_SYS_6-11-2024.sql` script
3. **Verify connection** at `localhost:1433` with credentials:
   - Username: `sa`
   - Password: `MinhMinh@1234`

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

3. **Build and run the application**:
   ```bash
   # Build the project
   mvn clean install

   # Run the application
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

#### Intelligent Services Setup (Optional)

1. **Navigate to Intelligent directory**:
   ```bash
   cd Intelligent
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask service**:
   ```bash
   python app.py
   ```

   The AI service will be available at `http://localhost:5001`

### Production Build

For production deployment without hot reload:

```bash
docker compose up --build -d
```

This creates optimized builds without development tools and runs in detached mode.

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


## Service Communication

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       ├──────────────┬
       │              │  
       ▼              ▼ 
┌─────────────┐ ┌─────────────┐
│   Stream    │ │   Backend   │
│   Server    │ │   (Java)    │
│  Port 5001  │ │  Port 8080  │
└──────┬──────┘ └─────────────┘
       │
       ▼
┌─────────────┐
│    Kafka    │
│  Port 9092  │
└─────────────┘
```

## Sample Data

The database backup file `BK_DBS_INTELLIGENT_SYS_6-11-2024.sql` includes sample data for testing:

### Test Accounts
- **Police Officer**: 
  - Username: `police_trung`
  - Password: `123456` (hashed in database)
  - Email: `trung.police@gov.vn`

- **Care Partner**: 
  - Username: `partner_lien`
  - Email: `lien.care@mail.com`

- **Volunteers**:
  - Username: `ngoquangminh` / Email: `minhngoquang6@gmail.com`
  - Username: `heoconthiengu` / Email: `minhngoquang@gmail.com`
  - Username: `testuser` / Email: `symphogearw2016@gmail.com`

### Sample Data
- Missing person case: "Ngo Quang Minh"
- Sample areas: District 1 and Tan Binh (Ho Chi Minh City)
- CCTV systems ready for integration

## Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication
- Role-based access control (ready for implementation)

## Development Notes

- The application uses SQL Server with Vietnamese Unicode support (nvarchar fields)
- All text fields support Vietnamese characters
- Date/time handling uses Java 8 Time API
- Frontend uses Material-UI for consistent design
- API responses include proper error handling
- JWT tokens expire after 24 hours
- File uploads are stored in `backend/uploads/` directory
- CCTV video streams use Kafka for real-time processing
- Face recognition uses FaceNet model with 128-dimensional embeddings

## Troubleshooting

### Database Connection Issues
```bash
# Check if SQL Server container is running
docker ps | grep sqlserver

# View SQL Server logs
docker logs <sqlserver-container-name>

# Restart SQL Server container
docker compose -f docker-compose.dev.yml restart sqlserver
```

### Backend Not Starting
```bash
# Check backend logs
docker logs <backend-container-name>

# Rebuild backend
docker compose -f docker-compose.dev.yml up --build backend-app
```

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Or rebuild container
docker compose -f docker-compose.dev.yml up --build frontend-app
```

### Port Already in Use
```bash
# Find process using port 8080 (backend)
lsof -i :8080  # On Linux/Mac
netstat -ano | findstr :8080  # On Windows

# Kill the process or change port in docker-compose.dev.yml
```

## Future Enhancements

- Real-time notifications
- Image upload functionality
- Advanced search filters
- Mobile app development
- Integration with external CCTV systems
- Machine learning model integration for facial recognition
