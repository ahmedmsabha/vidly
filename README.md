# Vidly - Video Sharing Platform

Vidly is a comprehensive video sharing platform built with Next.js 15, inspired by YouTube. It allows users to upload, manage, and view video content with a rich set of features for both content creators and viewers.

## Features

### For Viewers

- **Video Playback**: High-quality video streaming powered by Mux
- **User Authentication**: Secure login and registration via Clerk
- **Comments & Reactions**: Engage with content through comments and reactions (likes/dislikes)
- **Subscriptions**: Subscribe to favorite content creators
- **Playlists**: Create and manage playlists of favorite videos
- **Search**: Powerful search functionality to find videos and channels
- **AI-Powered Suggestions**: Get personalized video recommendations
- **Video View Tracking**: Track video view history

### For Content Creators

- **Studio Dashboard**: Comprehensive dashboard for content management
- **Video Upload**: Easy video uploading with thumbnail generation
- **Analytics**: Track video performance and audience engagement
- **Comment Management**: Moderate comments on your videos
- **Category Management**: Organize videos by categories

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: Clerk
- **Database**: Drizzle ORM with NeonDB (PostgreSQL)
- **Video Processing**: Mux
- **File Uploads**: UploadThing
- **API**: tRPC
- **AI Features**: Vercel SDK Ai, Google AI
- **Caching & Rate Limiting**: Upstash Redis
- **Background Jobs**: Upstash QStash

## Getting Started

To get started with Vidly, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18 or later)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AHMEDASABHA/vidly.git
   cd vidly
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables. Create a `.env.local` file in the root of your project and add the following variables:

   ```env
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (NeonDB)
   DATABASE_URL=your_neondb_url

   # Video Processing (Mux)
   MUX_TOKEN_ID=your_mux_token_id
   MUX_TOKEN_SECRET=your_mux_token_secret

   # File Uploads (UploadThing)
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id

   # AI Features
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   # Caching & Background Jobs (Upstash)
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   UPSTASH_WORKFLOW_URL=your_upstash_workflow_url

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Running the Development Server

```bash
# Standard development server
pnpm dev

# Run with webhook support (for Mux callbacks)
pnpm dev:all
```

### Building for Production

To build the application for production, run:

```bash
pnpm build
```

### Starting the Production Server

```bash
pnpm start
```

## Project Structure

The project is organized as follows:

- **src/app/**: Contains the Next.js app router pages and layouts

  - **(home)/**: Home page and related components
  - **(studio)/**: Creator studio pages
  - **(auth)/**: Authentication pages
  - **ai/**: AI-related features
  - **api/**: API endpoints

- **src/modules/**: Feature-based modules

  - **videos/**: Video management
  - **comments/**: Comment functionality
  - **subscriptions/**: Subscription management
  - **playlists/**: Playlist management
  - **users/**: User profiles and settings
  - **search/**: Search functionality
  - **suggestions/**: AI-powered recommendations
  - **video-reactions/**: Like/dislike functionality
  - **video-views/**: View tracking

- **src/components/**: Reusable UI components
- **src/lib/**: Utility functions and shared code
- **src/db/**: Database schema and queries
- **src/trpc/**: tRPC API router and procedures

## Scripts

The following scripts are available in the project:

- `dev`: Starts the development server with Turbopack
- `dev:all`: Runs the dev server with webhook support
- `build`: Builds the application for production
- `start`: Starts the production server
- `lint`: Runs the linter
- `db:push`: Pushes the database schema
- `db:studio`: Opens the database studio
- `seed`: Seeds the database with initial data

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Mux Documentation](https://docs.mux.com/)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
