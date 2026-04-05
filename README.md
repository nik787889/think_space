# Think Space

Think Space is a collaborative, Notion-style whiteboard built with Next.js, Tldraw, and Liveblocks. It allows multiple users to brainstorm, design, and organize their thoughts in real-time within a clean, professional environment.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Database ORM:** [Prisma 7](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Real-time Collaboration:** [Liveblocks](https://liveblocks.io/) & [Tldraw](https://tldraw.dev/)

## Features

- **Real-time Collaboration:** Seamless multi-user editing with cursor presence and instant synchronization.
- **Persisted Shapes:** Every stroke and shape is automatically saved to the database.
- **Workspace Sidebar:** Easily switch between different boards and organize your work in folders.
- **User Authentication:** Secure access using Better Auth.
- **Notion-style Interface:** A clean, minimal UI designed for productivity.

## Prerequisites

Before setting up the project, ensure you have the following:

- **Node.js 20+**
- **PostgreSQL** instance (running locally or in the cloud)

## Step-by-Step Setup

Follow these steps to get the project running on your local machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
   Or use the following template:
   ```env
   # DB Connection
   DATABASE_URL="postgresql://postgres:YOUR_POSTGRESQL_PASSWORD@localhost:5432/think_space?schema=public"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   BETTER_AUTH_URL="http://localhost:3000"
   # NEXT_PUBLIC_APP_URL="http://10.184.214.248:3000"
   # BETTER_AUTH_URL="http://10.184.214.248:3000"
   BETTER_AUTH_SECRET="any_random_long_string_here_any_random_long_string_here_..."
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="pk_dev_YOUR_LIVEBLOCK_PUBLIC_KEY"
   LIVEBLOCKS_SECRET_KEY="sk_dev_YOUR_LIVEBLOCK_SECRET_KEY"
   ```

3. **Generate Prisma Client:**
   The Prisma client is generated in `src/generated`.
   ```bash
   npx prisma generate
   ```

4. **Sync Database Schema:**
   Push the schema to your PostgreSQL instance:
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
