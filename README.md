# 🎬 KlingTool - Video Generation Tool

A powerful tool for batch processing images and generating videos using Kling AI's API with real-time status monitoring.

## ✨ Features

- **🖼️ Batch Image Upload**: Upload CSV files with multiple image URLs and prompts
- **🎬 Video Generation**: Automatically generate videos from uploaded images
- **⏱️ Real-time Monitoring**: Auto-refresh task status every 3 seconds
- **📊 Progress Tracking**: Visual progress indicators and ETA times
- **🎨 Modern UI**: Beautiful, responsive dashboard with drag-and-drop
- **📁 Export Results**: Export processing results to CSV
- **🔧 Error Handling**: Comprehensive error handling and retry logic

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Access the Dashboard
Open your browser and go to: `http://localhost:3000/dashboard`

## 📋 Usage

### Main Dashboard
- **URL**: `http://localhost:3000/dashboard`
- **Features**: 
  - Drag-and-drop CSV upload
  - Real-time progress tracking
  - Auto-refresh status monitoring
  - Export results

### Test Pages
- **Multi-task Monitor**: `http://localhost:3000/test-auto-refresh`
- **Single Task Monitor**: `http://localhost:3000/test-processing`
- **Download Features Test**: `http://localhost:3000/test-download`

## 📁 CSV Format

Your CSV file should have the following format:

```csv
prompt,image
"The woman with long wavy blonde hair tilts her head slightly, her light blue eyes gazing softly into the distance as a gentle breeze lifts strands of her hair. The pristine white background gradually reveals faint golden light particles floating upward, maintaining the clean polished aesthetic while the camera slowly zooms in to emphasize her serene expression and subtle pink lips.",https://images.unsplash.com/photo-1506905925346-21bda4d32df4
"A majestic mountain landscape at sunset with golden light streaming through clouds, creating a dramatic and cinematic atmosphere with smooth camera movement",https://images.unsplash.com/photo-1506905925346-21bda4d32df4
"A beautiful woman with flowing hair in a magical forest, with sparkles and light effects, cinematic camera movement",https://images.unsplash.com/photo-1506905925346-21bda4d32df4
```

### CSV Requirements:
- **Header**: Must include `prompt` and `image` columns
- **Prompt**: Detailed description for video generation
- **Image URL**: Direct link to the image file

## 🔄 Task Status Codes

| Status | Description | Color |
|--------|-------------|-------|
| `1` | Queued | Gray |
| `2` | Processing | Yellow |
| `3` | Completed | Green |
| `4` | Failed | Red |
| `5` | Processing | Yellow |
| `10` | Failed | Red |
| `99` | Completed | Green |

## 🎯 API Endpoints

### Upload CSV
```bash
POST /api/upload-csv
Content-Type: multipart/form-data
```

### Generate Video
```bash
POST /api/generate-video
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "Your video description"
}
```

### Check Task Status
```bash
GET /api/video-task/:taskId
```

## 🎨 Auto-Refresh Features

### Toggle Auto-Refresh
- **On/Off Switch**: Toggle auto-refresh functionality
- **3-second Interval**: Updates every 3 seconds
- **Real-time ETA**: Shows remaining time for processing tasks

### Status Display
- **Processing**: Shows ETA time (minutes and seconds) and progress bar
- **Completed**: Displays video download link, metadata, and individual download button
- **Failed**: Shows error details
- **Queued**: Indicates waiting status

### Download Features
- **Individual Download**: Each completed video has its own download button
- **Download All**: Bulk download all completed videos with 1-second delay between each
- **Auto-refresh Stop**: Stops refreshing when all tasks are completed
- **Video Metadata**: Shows duration, resolution, and cover image link

## 📊 Video Information

When a video is completed, you'll see:
- **Download Link**: Direct link to the video file
- **Duration**: Video length in seconds
- **Resolution**: Width x Height
- **Cover Image**: Thumbnail preview (if available)

## 🔧 Configuration

### Server Settings
- **Port**: 3000 (default)
- **Upload Limit**: 50MB
- **Timeout**: 30 seconds per request

### Auto-Refresh Settings
- **Interval**: 3 seconds
- **Enabled by default**: Yes
- **Toggle**: Available in dashboard

## 🛠️ Error Handling

### Common Issues
1. **CSV Format Error**: Ensure proper header and format
2. **Image URL Invalid**: Check if image URLs are accessible
3. **API Rate Limit**: Wait and retry
4. **Network Timeout**: Check internet connection

### Error Messages
- `Only CSV and Excel files are allowed`: Wrong file format
- `Image URL is required`: Missing image URL in CSV
- `Task failed`: Video generation failed
- `Service busy`: Kling AI service overloaded

## 📈 Performance Tips

1. **Batch Size**: Process 10-20 images per batch for optimal performance
2. **Image Quality**: Use high-quality images (1-5MB recommended)
3. **Prompt Length**: Keep prompts detailed but concise
4. **Network**: Ensure stable internet connection

## 🔒 Security

- **File Validation**: Only CSV files accepted
- **URL Validation**: Image URLs are validated before processing
- **Error Logging**: Comprehensive error tracking
- **Rate Limiting**: Built-in request throttling

## 📝 Logs

Server logs show:
- Upload progress
- Task creation
- Status updates
- Error details
- Processing times

## 🎉 Success Examples

### Completed Tasks
```
✅ Success 1/3: https://s15-kling.klingai.com/kimg/...
🎬 Video Task ID: 286507929305777
```

### Video Ready
```
🎬 Video: Download Video
Duration: 5s | Size: 1368x1516
Cover: View Cover
```

## 🚀 Next Steps

1. **Upload your CSV file** with image URLs and prompts
2. **Monitor progress** in real-time
3. **Download videos** when completed
4. **Export results** for record keeping

## 📞 Support

For issues or questions:
1. Check the error logs in the terminal
2. Verify CSV format and image URLs
3. Ensure stable internet connection
4. Restart the server if needed

---

**🎬 Happy Video Generating!** 🎉 