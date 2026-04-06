# Project Documentation: FinTrack Financial Management System

## 1. System Architecture Overview
The FinTrack platform is built on a distributed microservices architecture designed for high scalability and secure data processing. The system separates concerns between client-side visualization and server-side business logic.

### Frontend Layer
- **Framework**: React 18 with TypeScript for type-safe development.
- **Build Tool**: Vite, optimized for fast hot-module replacement and production builds.
- **Hosting**: Firebase Hosting with a custom SSL-secured domain (`fintrack-demo.online`).
- **Authentication**: Integrated Firebase Authentication utilizing Google OAuth 2.0.

### Middleware & Security Layer
- **API Gateway**: Google Cloud API Gateway serves as the centralized entry point.
- **Security**: Stateless JWT (JSON Web Token) validation handled at the Gateway level to ensure only authenticated requests reach the internal services.
- **CORS Management**: Detailed OpenAPI configuration to manage Cross-Origin Resource Sharing for the production domain.

### Backend Microservices
- **Technology Stack**: FastAPI (Python) for high-performance asynchronous request handling.
- **Runtime**: Google Cloud Run (Containerized environments).
- **Service Breakdown**:
    - **Transaction Service**: Responsible for CSV ingestion and initial validation.
    - **Subscription Service**: Manages recurring financial data and account totals.
    - **User Service**: Coordinates user profile metadata.

### Persistence Layer
- **Relational Data**: PostgreSQL (Cloud SQL) for structured transaction and subscription records.
- **Non-Relational Data**: Google Firestore for real-time user metadata and configuration.

## 2. Technical Implementation Challenges

### Cross-Origin Resource Sharing (CORS) Configuration
During the transition from the default Firebase development domain to the production custom DNS, we encountered strict CORS blocking. The engineering solution involved:
- Modifying the OpenAPI Gateway specification to explicitly handle OPTIONS preflight requests.
- Injecting `Access-Control-Allow-Origin` headers into the Gateway deployment configuration to authorize the production frontend.

### Service-to-Service Communication & Schema Validation
A critical challenge was ensuring data integrity between the Transaction Service and the Subscription Service. 
- **The Issue**: HTTP 400 errors occurred when CSV headers did not align with the backend's expected schema.
- **The Solution**: We standardized a strict CSV data contract, ensuring that the frontend-submitted multipart/form-data matched the backend’s database model exactly.

## 3. DevOps & Continuous Integration
- **CI/CD Pipeline**: Utilized GitHub Actions to automate the build and deployment process to Firebase Hosting upon every merge to the main branch.
- **Configuration Management**: Managed sensitive API keys and backend endpoints via GitHub Secrets and local environment variables to maintain security standards.

## 4. Future Improvements
*   **File Upload Validation**: Add an automatic check in the browser to ensure the CSV file has the correct columns before it is sent to the server. Beyond basic validation, a future improvement would allow the app to accept CSV files in any format or column order. The system would automatically detect and map the uploaded columns to the correct fields, removing the need for the user to follow a specific file structure. This would be achieved by implementing a column mapping engine on the frontend that compares the uploaded headers against the expected schema and attempts to resolve mismatches before sending the request to the backend.
*   **Enhanced Charts**: Adding more visual graphs to the dashboard, such as spending trends over the last 6 months, using the **Recharts** library.

## 5. Service Deployment and Infrastructure (Cloud Native)
The system is decomposed into specialized microservices, each deployed as an independent containerized workload on **Google Cloud Run**. 

### Managed Services Breakdown:
- **transaction-service**: Primary ingestion engine for CSV financial data.
- **subscription-service**: Core logic for calculating recurring expenditures and historical records.
- **budget-service**: Aggregates data to provide real-time budget utilization metrics.
- **insight-service**: Provides analytical processing for financial health summaries.
- **notification-service**: Managed service for asynchronous user alerts and system events.
- **scheduled-jobs**: Handles background cron tasks for account reconciliations.

### Infrastructure Benefits:
- **Autoscaling**: Each service scales horizontally based on request traffic.
- **Isolations**: A failure in the `notification-service` does not impact the core `transaction-service`.
- **Global Distribution**: All services are deployed in the `us-central1` region for low latency and high availability.