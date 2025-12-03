# 🚀 Next.js Deployment Guide (Vercel)

This guide explains how to deploy this Next.js project to **Vercel**, including configuration of the required environment variable: `N8N_WEBHOOK_URL`.

---

## 1. Prerequisites

Before deploying, ensure you have:

- A GitHub account  
- A Vercel account (https://vercel.com)  
- This repository cloned or forked

## 2. Deploying to Vercel

### Step 1 — Import the Repository

1. Open: https://vercel.com/dashboard  
2. Click **Add New… → Project**  
3. Select your GitHub repo:

```
markee2301/lead-scraper
```

Vercel will auto-detect Next.js.

---

## 3. Environment Variables

You must configure one environment variable for the app to work.

1. Go to your Vercel dashboard  
2. Navigate to: **Settings → Environment Variables**  
3. Add:

| Name               | Value                    |
|-------------------|---------------------------|
| `N8N_WEBHOOK_URL` | your N8N webhook URL here |

Example:

```
Name: N8N_WEBHOOK_URL
Value: https://n8n.example.com/webhook/abc123
```

Click **Save** after adding.

---

## 4. Deploy

Once the environment variable is set:

1. Go to **Deployments**
2. Vercel will start building automatically  
3. After completing, you will get a live URL such as:

```
https://lead-scraper.vercel.app
```

---

## 5. Redeploying After ENV Changes

If you update environment variables:

1. Open the **Deployments** tab  
2. Click **Redeploy** on the latest build  
3. Choose **Use existing build cache** (recommended)

Vercel will rebuild using the updated value.
