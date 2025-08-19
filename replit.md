# CBT Attendance Platform

## Overview

This is a modern Computer-Based Training (CBT) attendance management platform built for educational institutions. The application provides a streamlined way for students to mark attendance and for administrators to manage attendance records. It features a clean, professional interface with authentication, student management, and attendance tracking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with a comprehensive design system using CSS variables
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation
- **Icons**: FontAwesome icons with a centralized icon library setup

### Backend Architecture
The backend uses a Node.js/Express architecture with the following design decisions:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the entire stack
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Development Server**: Vite integration for hot module replacement in development

### Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Schema Location**: Centralized in `shared/schema.ts` for type sharing between client and server
- **Migration Strategy**: Drizzle Kit for schema migrations stored in `./migrations`
- **Type Safety**: Automatic TypeScript type generation from database schema
- **Validation**: Zod schemas derived from Drizzle tables for runtime validation

### Authentication System
The application implements a dual authentication approach:

- **Primary Auth**: Supabase integration for user authentication and management
- **Session Management**: Built-in session handling with social login support (Google, GitHub)
- **Admin Access**: Separate admin login portal for administrative functions
- **Protected Routes**: Route-level authentication guards for secure areas

### Project Structure
The codebase follows a monorepo structure with clear separation of concerns:

- **`client/`**: Frontend React application with its own build configuration
- **`server/`**: Backend Express server with API routes and business logic  
- **`shared/`**: Common code shared between client and server (schemas, types)
- **Shared Build**: Single package.json managing both frontend and backend dependencies

### Development Workflow
The application is configured for efficient development:

- **Hot Reloading**: Vite provides fast HMR for frontend development
- **Type Checking**: Comprehensive TypeScript configuration across all layers
- **Development Server**: Single command starts both frontend and backend
- **Database Development**: Easy schema push and migration commands
- **Environment Management**: Separate development and production configurations

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL database hosting with connection pooling
- **Database URL**: Environment variable required for database connectivity

### Authentication Services  
- **Supabase**: Complete authentication and user management platform
- **Social Auth**: Integrated Google and GitHub OAuth providers
- **Session Storage**: Browser localStorage for session persistence

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for complex UI elements
- **FontAwesome**: Comprehensive icon library with centralized configuration
- **Embla Carousel**: Touch-friendly carousel component for UI elements

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **Replit Integration**: Specialized plugins for Replit development environment
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration