# Vercel Environment Variables Setup Guide

## Backend Environment Variables

Add these variables in Vercel Dashboard → Backend Project → Settings → Environment Variables:

### Required Variables:
```
MONGODB_URI=mongodb+srv://E-Commerce:ShopHub2026@cluster0.zbrjltw.mongodb.net/shophub?retryWrites=true&w=majority&authSource=admin&serverSelectionTimeoutMS=30000
JWT_SECRET=17df2ab99d811eb9ce7923c85d0a127720397aac832f7b523526016d73c92475
JWT_REFRESH_SECRET=2971f02aaebef278534970cf4dd1745cc1a2ec6163bcb66f836182224d23c64d
CLIENT_URL=https://frontend-puce-five-13.vercel.app
GOOGLE_CLIENT_ID=876379877197-69okmbelj6hup5s98rep0gqcdbihq8l8.apps.googleusercontent.com
ADMIN_EMAIL=admin@shophub.com
ADMIN_PASSWORD=ShopHub@Admin2026
ADMIN_NAME=ShopHub Admin
PORT=5000
NODE_ENV=production
```

### Optional Variables (for email functionality):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=phantompulsee@gmail.com
SMTP_PASS="ndla njlb zmci ebqk"
MAIL_FROM="ShopHub <phantompulsee@gmail.com>"
```

### Optional Variables (for AI functionality):
```
GEMINI_API_KEY=AIzaSyD4HGAmF0qgjmJruBybRaYmIH0QteIKSMg
GEMINI_MODEL=gemini-2.5-flash
```

## Frontend Environment Variables

Add these variables in Vercel Dashboard → Frontend Project → Settings → Environment Variables:

```
VITE_API_URL=https://backend-self-chi-44.vercel.app/api
VITE_GOOGLE_CLIENT_ID=876379877197-69okmbelj6hup5s98rep0gqcdbihq8l8.apps.googleusercontent.com
```

## Setup Steps:

1. **Backend Setup:**
   - Go to https://vercel.com/abdulsamadzubairkamal-1356s-projects/backend/settings/environment-variables
   - Add all the backend environment variables listed above
   - Click "Save"
   - Go to Deployments → Redeploy

2. **Frontend Setup:**
   - Go to https://vercel.com/abdulsamadzubairkamal-1356s-projects/frontend/settings/environment-variables
   - Add the frontend environment variables listed above
   - Click "Save"
   - Go to Deployments → Redeploy

3. **Test Connection:**
   - Visit https://backend-self-chi-44.vercel.app/api/health
   - Should return: `{"ok":true,"db":true}`
   - Visit https://frontend-puce-five-13.vercel.app
   - Test login functionality

## Notes:
- JWT secrets are randomly generated - keep them secure
- MongoDB URI uses the existing Atlas connection
- Email credentials are from your existing setup
- After adding variables, redeploy both projects