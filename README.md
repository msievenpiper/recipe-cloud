# Recipe Cloud

Recipe Cloud is a progressive web application that allows users to upload photos of recipes, which are then processed by an AI agent to generate structured markdown content. Users can manage their recipes, translate them into multiple languages, generate PDFs, and authenticate using various methods.

## Features

*   **AI-Powered Recipe Extraction**: Upload a photo of a recipe, and an AI agent (Google Cloud Vision for OCR, Google Gemini 2.0 Flash for content generation) will process it to produce structured markdown instructions and notes.
*   **Multi-Language Translation**: Translate recipes into 10+ supported languages (Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean) with persistent storage and caching.
*   **PDF Generation**: Export recipes (and their translations) to PDF format with support for international fonts.
*   **User Authentication**: Secure user authentication via:
    *   Email and Password (with bcrypt hashing).
    *   Google, Facebook, and Twitter Single Sign-On (SSO) using NextAuth.js.
*   **Recipe Management**:
    *   View a list of all your uploaded recipes.
    *   View detailed recipe pages with markdown rendering.
    *   Edit AI-generated recipe content directly within the application.
*   **Admin Features**: Administrators can bypass usage limits and manage the system.
*   **Progressive Web App (PWA)**: Built with Next.js for a fast, responsive, and installable user experience.
*   **Database**: Supports SQLite for local development and PostgreSQL for production via Prisma.
*   **Responsive UI**: Modern user interface built with Tailwind CSS.
*   **Integrated Legal Pages**: Includes Terms of Service and Privacy Policy.

## Getting Started

Follow these instructions to get your development environment set up and running.

### Prerequisites

*   **Node.js**: Version 18.x or higher.
*   **npm** or **Yarn**: For package management.
*   **Google Cloud Project**: With the **Cloud Vision API** enabled.
*   **Google Gemini API Key**: Obtainable from Google AI Studio.
*   **OAuth Credentials**: Client IDs and secrets for Google, Facebook, and Twitter if you plan to use SSO.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd recipe-cloud
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project and populate it with your credentials.

    ```env
    # NextAuth.js - Authentication
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET # Generate a strong secret, e.g., using `openssl rand -hex 32`

    # OAuth Providers
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    FACEBOOK_CLIENT_ID=YOUR_FACEBOOK_CLIENT_ID
    FACEBOOK_CLIENT_SECRET=YOUR_FACEBOOK_CLIENT_SECRET
    TWITTER_CLIENT_ID=YOUR_TWITTER_CLIENT_ID
    TWITTER_CLIENT_SECRET=YOUR_TWITTER_CLIENT_SECRET

    # Google Cloud & Gemini API
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/google-cloud-service-account-key.json

    # Database
    DATABASE_URL="file:./dev.db" # Or "postgresql://..." for Docker/Production
    ```
    *   **`GOOGLE_APPLICATION_CREDENTIALS`**: This should be the **absolute path** to the JSON key file for your Google Cloud service account (with "Cloud Vision AI User" role). See [Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started) for more details on how to create and download this key.

### Database Setup (Prisma)

This project uses Prisma with SQLite.

1.  **Generate Prisma Client and Run Migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```
    This command will:
    *   Create the `prisma/dev.db` SQLite database file.
    *   Apply the schema defined in `prisma/schema.prisma`.
    *   Generate the Prisma client.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Google Cloud Platform (GCP)

This guide focuses on deploying the Next.js application to **Cloud Run**. For persistent data storage with SQLite, you would typically need a managed database service like **Cloud SQL (PostgreSQL/MySQL)**. Using SQLite directly on Cloud Run's ephemeral file system means data will be lost when instances restart.

**For Production (Recommended):**
*   **Migrate to Cloud SQL**: Change your `prisma/schema.prisma` to use `postgresql` or `mysql` provider and configure the connection string. Then run `npx prisma migrate deploy`.
*   **Update NextAuth.js**: If you use `CredentialsProvider` with a custom `User` model, ensure it's compatible with the new database.

**For Demo/Testing (Ephemeral SQLite):**
You can deploy with SQLite, but be aware that your data will not persist across container restarts.

#### Prerequisites for GCP Deployment

*   A GCP Project with billing enabled.
*   `gcloud CLI` installed and configured.
*   **Cloud Run API** enabled in your GCP project.
*   **Cloud Build API** enabled in your GCP project.
*   **Cloud SQL (PostgreSQL)** (Recommended for persistent data).

#### Docker Compose (Local/VPS with Postgres)

For a more robust setup including a PostgreSQL database, you can use Docker Compose:

1.  **Configure environment variables**: Ensure `.env` contains the correct `DATABASE_URL` pointing to the `db` service (e.g., `postgresql://user:password@db:5432/mydatabase?schema=public`).
2.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    This will start the Next.js application and a PostgreSQL database.

#### Deployment Steps

1.  **Build the application:**
    ```bash
    npm run build
    ```
2.  **Create a `Dockerfile`** (if not already present, for Cloud Run):
    Create a `Dockerfile` in your project root:
    ```dockerfile
    # Install dependencies
    FROM node:18-alpine AS deps
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    COPY package.json yarn.lock* package-lock.json* ./
    RUN \
      if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
      elif [ -f package-lock.json ]; then npm ci; \
      else echo "No lock file found." && exit 1; \
      fi

    # Rebuild the source code only when needed
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    ENV NEXT_TELEMETRY_DISABLED 1
    RUN npx prisma generate
    RUN npm run build

    # Production image, copy all the files and run next
    FROM node:18-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV production
    # Uncomment the following line in case you want to disable telemetry during runtime.
    ENV NEXT_TELEMETRY_DISABLED 1

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    USER nextjs

    EXPOSE 3000
    ENV PORT 3000

    CMD ["node", "server.js"]
    ```
    *Note: This Dockerfile uses Next.js's standalone output mode, which is efficient for container deployments.*

3.  **Deploy to Cloud Run:**
    ```bash
    gcloud run deploy recipe-cloud-app \
      --source . \
      --region YOUR_GCP_REGION \
      --platform managed \
      --allow-unauthenticated # Or --no-allow-unauthenticated if you want to restrict access
    ```
    Follow the prompts.

4.  **Configure Environment Variables in Cloud Run:**
    After deployment, go to the Cloud Run service in the GCP Console. Edit the service and add all your environment variables (`GOOGLE_CLIENT_ID`, `NEXTAUTH_SECRET`, `GEMINI_API_KEY`, etc.) under the "Variables & Secrets" section.
    *   **`GOOGLE_APPLICATION_CREDENTIALS`**: For Cloud Run, you should typically use [Workload Identity](https://cloud.google.com/run/docs/securing/service-identity) to grant your Cloud Run service account the "Cloud Vision AI User" role directly, rather than embedding a key file. If you must use a key file, upload it as a secret and mount it.

### Deploying to a Droplet (Generic VPS)

This method involves setting up a Linux server (e.g., Ubuntu, Debian) with Node.js, a process manager, and a reverse proxy.

#### Prerequisites for Droplet Deployment

*   A VPS (droplet) running a Linux distribution (e.g., Ubuntu 20.04+).
*   SSH access to your droplet.
*   Node.js (v18+) and npm/yarn installed on the droplet.
*   Git installed on the droplet.
*   A domain name pointed to your droplet's IP address (for SSL).
*   Nginx or Caddy installed (for reverse proxy and SSL).

#### Deployment Steps

1.  **SSH into your droplet:**
    ```bash
    ssh user@your_droplet_ip
    ```
2.  **Clone your repository:**
    ```bash
    git clone <repository-url> /var/www/recipe-cloud # Or your preferred directory
    cd /var/www/recipe-cloud
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
4.  **Set up Environment Variables:**
    Create a `.env.production` file in your project root (`/var/www/recipe-cloud/.env.production`) and populate it with your production environment variables.
    *   **`NEXTAUTH_URL`**: Set this to your production domain (e.g., `https://recipecloud.yourdomain.com`).
    *   **`GOOGLE_APPLICATION_CREDENTIALS`**: Ensure this path is correct on your server (e.g., `/var/www/recipe-cloud/credentials/keyfile.json`).

5.  **Build the application:**
    ```bash
    npm run build
    ```
6.  **Database Setup (Prisma):**
    ```bash
    npx prisma migrate deploy
    ```
    This will apply your Prisma schema to the `dev.db` file on your server.

7.  **Install PM2 (Process Manager):**
    PM2 keeps your Node.js application running continuously and automatically restarts it if it crashes.
    ```bash
    npm install -g pm2
    ```
8.  **Start your application with PM2:**
    ```bash
    pm2 start npm --name "recipe-cloud" -- start
    pm2 save # Save the process list to restart on boot
    ```
    Your application should now be running on `http://localhost:3000` on your droplet.

9.  **Set up Nginx (Reverse Proxy & SSL):**
    Nginx will serve your application on port 80/443 and handle SSL.

    *   **Install Nginx:**
        ```bash
        sudo apt update
        sudo apt install nginx
        ```
    *   **Create Nginx configuration:**
        ```bash
        sudo nano /etc/nginx/sites-available/recipe-cloud
        ```
        Add the following content (replace `yourdomain.com`):
        ```nginx
        server {
            listen 80;
            server_name yourdomain.com www.yourdomain.com;

            location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
        ```
    *   **Enable the Nginx configuration:**
        ```bash
        sudo ln -s /etc/nginx/sites-available/recipe-cloud /etc/nginx/sites-enabled/
        sudo nginx -t # Test Nginx configuration
        sudo systemctl restart nginx
        ```
    *   **Install Certbot for SSL (Let's Encrypt):**
        ```bash
        sudo snap install --classic certbot
        sudo ln -s /snap/bin/certbot /usr/bin/certbot
        sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
        ```
        Follow the prompts to set up SSL. Certbot will automatically modify your Nginx config.

Your application should now be accessible via HTTPS on your domain.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## License

[Specify your license here, e.g., MIT License]
