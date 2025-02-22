# Vidly - Youtube Clone

Vidly is a video management platform built with Next.js. It allows users to upload, manage, and view video content with various features like video details management, thumbnail generation, and more.

## Getting Started

To get started with Vidly, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AHMEDASABHA/vidly.git
   cd vidly
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables. Create a `.env.local` file in the root of your project and add the following variables:

   ```env
   MUX_TOKEN_ID=your_mux_token_id
   MUX_TOKEN_SECRET=your_mux_token_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   UPSTASH_WORKFLOW_URL=your_upstash_workflow_url
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Development Server

```bash
pnpm dev
```

### Starting the Production Server

```bash
pnpm start
```

### Building for Production

To build the application for production, run:

```bash
pnpm build
```

## Project Structure

The project is organized as follows:

- **pages/**: Contains the Next.js pages for the application.
- **src/**: Contains the main source code for the application, including components, modules, and utilities.

## Scripts

The following scripts are available in the project:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs the linter.
- `db:push`: Pushes the database schema.
- `db:studio`: Opens the database studio.
- `seed`: Seeds the database with initial data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
