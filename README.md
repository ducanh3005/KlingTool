# KlingTool - AI Video Generation Tool

A web application for batch processing images and generating videos using Kling AI's API.

## Features

- 📁 **CSV Batch Processing**: Upload CSV files with image URLs and prompts
- 🎬 **Video Generation**: Automatically generate videos from images using Kling AI
- 🔐 **Authentication**: Dynamic cookie management for Kling API access
- 📊 **Dashboard**: Real-time processing status and results
- 🎯 **Single Image Upload**: Process individual images with custom prompts

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd KlingTool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Main app: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Cookie Manager: http://localhost:3000/cookie-manager

### Deployment to Vercel

This application is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick deployment:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## API Endpoints

### Authentication
- `POST /api/kling/login` - Login to Kling AI
- `POST /api/kling/update-cookies` - Update session cookies
- `GET /api/kling/cookies-status` - Check cookie status

### File Processing
- `POST /api/upload-csv` - Upload and process CSV file
- `POST /api/upload-single-image` - Upload single image
- `POST /api/generate-video` - Generate video from image URL

### Video Management
- `GET /api/video-task/:taskId` - Check video generation status

### Testing
- `GET /api/test` - Server health check
- `GET /api/test-kling` - Test Kling API connectivity
- `POST /api/test-upload` - Test image upload functionality

## CSV Format

Your CSV file should have the following columns:

```csv
prompt,image
"The woman with long wavy blonde hair...",https://example.com/image1.jpg
"A beautiful sunset over mountains...",https://example.com/image2.jpg
```

## Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
```

## Project Structure

```
KlingTool/
├── public/                 # Static files (HTML, CSS, JS)
├── api/                    # API modules
├── server.js              # Main server file
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── DEPLOYMENT.md         # Deployment guide
└── README.md             # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **File Processing**: Multer, CSV-parser
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Limitations

- **File System**: Uses memory storage (no file system writes)
- **Timeout**: 30-second function timeout on Vercel
- **Memory**: Large files may hit memory limits
- **Rate Limiting**: 5-second delay between API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md).
For API issues, check the Vercel function logs. 