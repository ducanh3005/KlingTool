# Deployment Guide - Fix 405 Method Not Allowed Error

## Problem
When deploying to GitHub Pages, you encounter a 405 Method Not Allowed error when trying to login. This happens because GitHub Pages only serves static files and doesn't support server-side code execution.

## Solutions

### Solution 1: Deploy Backend to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Update Configuration:**
   - After deployment, Vercel will give you a URL like `https://your-app.vercel.app`
   - Update `public/config.js` with your Vercel URL:
   ```javascript
   production: {
       apiBaseUrl: 'https://your-app.vercel.app' // Replace with your actual Vercel URL
   }
   ```

4. **Deploy Frontend to GitHub Pages:**
   - Push your updated code to GitHub
   - GitHub Pages will serve the static files from the `public` folder

### Solution 2: Use Serverless Functions (Alternative)

The project includes serverless functions in the `api/` folder that can be deployed to Vercel:

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Update Configuration:**
   - Update `public/config.js` with your Vercel URL

### Solution 3: Deploy to Other Platforms

You can also deploy to:
- **Railway:** Supports Node.js applications
- **Render:** Free tier available for Node.js apps
- **Heroku:** Paid service for Node.js applications

## Debugging Steps

### Step 1: Test Basic Connectivity
```bash
# Test if the API is accessible
curl https://kling-tool.vercel.app/api/test
```

### Step 2: Test Login Endpoint
```bash
# Test the login endpoint
curl -X POST https://kling-tool.vercel.app/api/kling/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'
```

### Step 3: Use the Test Script
```bash
# Run the Node.js test script
node test_api.js
```

### Step 4: Use the HTML Test Page
1. Open `test_api.html` in your browser
2. Test each endpoint individually
3. Check the console for detailed error messages

### Step 5: Check Vercel Logs
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check the logs for any errors

## Common Issues and Solutions

### Issue 1: 405 Method Not Allowed
- **Cause:** Vercel routing not configured correctly
- **Solution:** Ensure `vercel.json` has proper routes configuration

### Issue 2: CORS Errors
- **Cause:** Frontend and backend on different domains
- **Solution:** Backend includes CORS headers, ensure config.js has correct backend URL

### Issue 3: Function Timeout
- **Cause:** Kling API takes too long to respond
- **Solution:** Increased timeout in `vercel.json` functions configuration

### Issue 4: Module Not Found
- **Cause:** Dependencies not installed
- **Solution:** Ensure `package.json` includes all required dependencies

### Issue 5: Environment Variables
- **Cause:** Missing environment variables
- **Solution:** Set environment variables in Vercel dashboard

## File Structure After Deployment

```
KlingTool/
├── public/                 # Static files (GitHub Pages)
│   ├── index.html
│   ├── script.js
│   ├── config.js          # API configuration
│   └── styles.css
├── api/                   # Serverless functions (Vercel)
│   ├── kling/
│   │   └── login.js
│   └── test.js
├── server.js              # Full server (Vercel/Railway/Render)
├── vercel.json            # Vercel configuration
├── test_api.js            # Debug script
├── test_api.html          # Debug page
└── package.json
```

## Testing

1. **Local Development:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3000/api/kling/login

2. **Production:**
   - Frontend: https://your-username.github.io/KlingTool
   - Backend: https://your-app.vercel.app/api/kling/login

3. **Debug Tools:**
   - Test script: `node test_api.js`
   - Test page: Open `test_api.html` in browser
   - Vercel logs: Check dashboard for function logs

## Troubleshooting

### 405 Method Not Allowed
- **Cause:** Trying to make POST requests to GitHub Pages
- **Solution:** Deploy backend to a service that supports server-side code

### CORS Errors
- **Cause:** Frontend and backend on different domains
- **Solution:** Backend includes CORS headers, ensure config.js has correct backend URL

### Login Fails
- **Cause:** Backend URL not configured correctly
- **Solution:** Check `public/config.js` and ensure `apiBaseUrl` points to your deployed backend

### Function Timeout
- **Cause:** Kling API response time exceeds Vercel limits
- **Solution:** Check `vercel.json` functions configuration for timeout settings

## Environment Variables

Create a `.env` file for local development:
```env
PORT=3000
```

For production deployment, set environment variables in your hosting platform's dashboard.

## Vercel Configuration

The `vercel.json` file includes:
- Proper routing for API endpoints
- Static file serving
- Function timeout configuration
- CORS headers

## Next Steps

1. Deploy to Vercel using `vercel` command
2. Test the API endpoints using the provided tools
3. Update the frontend configuration with your Vercel URL
4. Deploy the frontend to GitHub Pages
5. Test the complete flow 