# Demo Frontend

Frontend & DevOps for a microservices-based demo application.

## Project Overview

This is a **React-based web application** deployed on **Firebase Hosting** with CI/CD via **GitHub Actions**.

### Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Authentication**: Firebase Auth (Google)
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **Domain**: Custom domain (TBD)

### Team Responsibilities

#### Frontend & DevOps (Your Role)
- Build React dashboard, CSV upload, and settings pages
- Set up Firebase Hosting deployment
- Configure GitHub Actions CI/CD pipeline
- Set up custom domain DNS routing
- Create GitHub Projects board for task tracking

#### Backend Lead (Teammate)
- Set up Google Cloud infrastructure (Cloud Run, Cloud SQL, Firestore)
- Build User Service (authentication, profiles)
- Build Transaction Service (CSV upload, data parsing)
- Set up API Gateway and JWT verification
- Configure Datadog logging for all services

## Project Requirements (Demo)

- ✅ 1 client (React web app)
- ✅ Custom domain with DNS
- ✅ Cloud vendor (Google Cloud + Firebase)
- ✅ 2 Databases (PostgreSQL + Firestore) - Backend
- ✅ Authentication provider (Firebase Auth)
- ✅ API Gateway (Google Cloud API Gateway) - Backend
- ✅ 5 deployable services (FastAPI microservices) - Backend
- ✅ External logging (Datadog) - Backend
- ✅ Recurring job - Backend

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git configured with GitHub

### Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build