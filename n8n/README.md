# n8n Deployment and Usage

This folder contains the `n8n` workflow and Docker config for Smart Best Brands.

## What is included

- `order-notifications-workflow.json` — sample n8n workflow for order-created and order-status notifications
- `Dockerfile` — deploys the official `n8n` image from this repo

## How to deploy to Railway from GitHub

### 1. Push this repo to GitHub

Make sure your repository contains:

- `n8n/Dockerfile`
- `n8n/order-notifications-workflow.json`

### 2. Add a new Railway service

- In Railway, create a new project or use your existing project
- Add a service and choose **GitHub** deploy
- Connect your GitHub repository
- Select the `n8n` folder as the service root
- Railway should detect the `Dockerfile`

### 3. Configure n8n persistence

Add a PostgreSQL plugin to the same Railway project and use the generated database variables.

Set environment variables for n8n:

- `N8N_BASIC_AUTH_ACTIVE=true`
- `N8N_BASIC_AUTH_USER=<your-user>`
- `N8N_BASIC_AUTH_PASSWORD=<your-password>`
- `N8N_HOST=<railway-hostname>`
- `N8N_PROTOCOL=https`
- `N8N_PORT=5678`
- `WEBHOOK_URL=https://<railway-app>.railway.app/`
- `DB_TYPE=postgresdb`
- `DB_POSTGRESDB_HOST=<db-host>`
- `DB_POSTGRESDB_PORT=<db-port>`
- `DB_POSTGRESDB_DATABASE=<db-name>`
- `DB_POSTGRESDB_USER=<db-user>`
- `DB_POSTGRESDB_PASSWORD=<db-password>`

### 4. Optional security and production settings

- `NODE_ENV=production`
- `N8N_DEFAULT_MAILER=sendmail` (or set up a mailer later)
- `N8N_DISABLE_USAGE_REPORT=false`

### 5. Import the workflow in n8n

After deployment:

1. Open the n8n UI in Railway
2. Log in using the basic auth credentials
3. Go to `Workflows`
4. Import `n8n/order-notifications-workflow.json`

### 6. Configure Gmail and Groq

#### Gmail

Use n8n's Gmail node with OAuth credentials:

- In n8n, create a new credential for Gmail
- Authorize it with your Gmail account
- Use that credential in your workflow to send emails

#### Groq

If you need Groq queries for a CMS like Sanity, use n8n's HTTP Request node:

- Add a credential or bearer token for your CMS
- Use the HTTP Request node to call the Groq API
- Set `Content-Type: application/json`
- Send your query in the request body

## How to connect your Next.js app

Set these environment variables in your Next.js app:

- `N8N_WEBHOOK_URL=https://<railway-app>.railway.app/webhook/order-notifications`
- `N8N_WEBHOOK_SECRET=<secret>`

Your backend will call this webhook when:

- a new order is created
- order status changes
- payment is confirmed

## What else you can add

- Support reply automation with incoming email webhook
- multiple workflows in the same n8n instance
- Slack / Telegram / WhatsApp notifications later
- a dedicated admin support workflow for customer replies

## Why this is a good choice

- One `n8n` instance handles many workflows
- Your workflows are versioned in GitHub
- Railway deploy uses your repo and Dockerfile
- Gmail + Groq integration is easy inside n8n
