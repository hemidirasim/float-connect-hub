# Hiclient - Floating Widget Builder

## Overview

Hiclient is a modern web application that allows users to create and deploy floating contact widgets for websites. Built with React and TypeScript on the frontend, Express.js on the backend, and Supabase for database and authentication, the platform provides a comprehensive widget creation and management system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Hooks with React Query for server state
- **Routing**: React Router for client-side navigation
- **Authentication**: Supabase Auth with automatic session management

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless
- **Edge Functions**: Supabase Functions for widget rendering and webhooks
- **Payment Processing**: Paddle integration for subscription management

### Database Architecture
- **Primary Database**: PostgreSQL with Row Level Security (RLS)
- **Schema Management**: Drizzle with migrations in `/migrations` directory
- **Authentication**: Supabase Auth tables with custom user profiles

## Key Components

### Widget System
- **Widget Builder**: Interactive form-based widget creation with real-time preview
- **Template Engine**: Multiple widget templates (default, dark, minimal, modern, elegant)
- **Channel Management**: Support for 20+ communication platforms (WhatsApp, Telegram, Email, etc.)
- **Responsive Design**: Mobile and desktop optimized widgets
- **Customization**: Color themes, positioning, tooltips, and custom icons

### Authentication & User Management
- **Email/Password Authentication**: Standard login with email verification
- **OAuth Integration**: Ready for social login providers
- **Profile Management**: User profiles with credit tracking
- **Password Reset**: Secure password recovery flow

### Payment & Credits System
- **Credit-Based Billing**: Users purchase credits for widget usage
- **Paddle Integration**: Secure payment processing
- **Transaction History**: Complete payment and credit usage tracking
- **Webhook Processing**: Automated credit allocation on successful payments

### Support System
- **Support Tickets**: Built-in customer support ticket system
- **Real-time Messaging**: Ticket replies and communication tracking
- **Admin Interface**: Support ticket management for administrators

## Data Flow

### Widget Creation Flow
1. User designs widget using the visual builder
2. Widget configuration saved to database with template selection
3. Edge function generates optimized JavaScript embed code
4. User deploys code to their website
5. Widget views and interactions tracked in real-time

### Authentication Flow
1. User registration/login through Supabase Auth
2. Email verification required for new accounts
3. Session management with automatic token refresh
4. Profile creation with default credit allocation

### Payment Flow
1. User selects credit package
2. Paddle checkout session created
3. Payment processed through Paddle
4. Webhook confirms payment
5. Credits automatically added to user account

## External Dependencies

### Core Infrastructure
- **Supabase**: Database, authentication, and edge functions hosting
- **Neon**: PostgreSQL database hosting
- **Paddle**: Payment processing and subscription management

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast TypeScript compilation for production
- **PostCSS**: CSS processing with Tailwind CSS

### Frontend Libraries
- **Radix UI**: Accessible component primitives
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Package Manager**: npm with Node.js 20
- **Development Server**: Vite dev server with HMR
- **Database**: Local Supabase or remote development instance
- **Environment Variables**: Stored in `.env` files

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: ESBuild compilation to single JavaScript file
- **Database**: Automated migrations via Drizzle
- **Edge Functions**: Deployed to Supabase edge runtime

### Deployment Platform
- **Primary**: Replit with autoscale deployment
- **Database**: Supabase PostgreSQL
- **CDN**: Supabase edge functions for global widget delivery
- **Monitoring**: Built-in error handling and logging

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 27, 2025. Initial setup