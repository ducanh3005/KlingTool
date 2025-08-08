# Deployment Guide for Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Node.js**: Make sure your project has a valid `package.json`

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Node.js project

### 2. Configure Environment Variables (Optional)

In your Vercel project settings, you can add environment variables:

- `PORT`: Set to `3000` (optional, Vercel handles this automatically)

### 3. Deploy

1. Vercel will automatically build and deploy your project
2. The build process will:
   - Install dependencies from `package.json`
   - Use the `@vercel/node` builder for `server.js`
   - Apply the routing rules from `vercel.json`

### 4. Access Your App

After deployment, Vercel will provide you with:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each Git branch/PR

## Important Notes

### File System Limitations

This app has been modified to work with Vercel's serverless environment:

- ✅ **Memory-based file processing**: CSV files are processed in memory
- ✅ **No file system writes**: Images are processed in memory
- ✅ **Static file serving**: HTML/CSS/JS files are served from `/public`

### API Endpoints

Your app will be available at:
- Main app: `https://your-project-name.vercel.app/`
- Dashboard: `https://your-project-name.vercel.app/dashboard`
- API endpoints: `https://your-project-name.vercel.app/api/*`

### Function Timeout

The serverless function has a 30-second timeout. For long-running operations:
- Consider breaking them into smaller chunks
- Use background jobs for heavy processing
- Implement proper error handling for timeouts

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure `server.js` is the main entry point

2. **API Errors**:
   - Check Vercel function logs
   - Verify environment variables are set correctly

3. **File Upload Issues**:
   - The app now uses memory storage instead of file system
   - Large files may hit memory limits

### Getting Help

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- View function logs in Vercel dashboard
- Test locally first with `npm start`

## Local Development

To test locally before deploying:

```bash
npm install
npm start
```

The app will run on `http://localhost:3000` 