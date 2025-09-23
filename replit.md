# Overview

A full-stack web application for job applications built with a modern React frontend and Express.js backend. The application allows users to view available job positions at what appears to be a healthcare organization and submit job applications through an interactive form interface. The system provides a careers page with detailed job listings and handles the complete application submission workflow.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for client-side routing with a simple Switch/Route pattern
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Forms**: React Hook Form with Zod validation for robust form handling and validation
- **UI Components**: Comprehensive component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming, includes dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api` namespace
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development**: Vite integration for hot module replacement and development server

## Data Layer
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL driver
- **Validation**: Shared Zod schemas between frontend and backend for type safety
- **Storage Abstraction**: Memory storage implementation with interface for easy database integration

## Key Design Patterns
- **Shared Types**: Common TypeScript interfaces and Zod schemas in `/shared` directory
- **Component Composition**: Modular UI components with consistent API patterns
- **Query Management**: Centralized API request handling with proper error boundaries
- **Form Validation**: Client-side and server-side validation using the same schema definitions
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: TypeScript ORM for database operations
- **react-hook-form**: Form state management and validation
- **wouter**: Lightweight client-side routing
- **zod**: Runtime type validation and schema definition

## UI and Design System
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

## Database and Infrastructure
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-kit**: Database migration and schema management tools
- **connect-pg-simple**: PostgreSQL session store integration

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements