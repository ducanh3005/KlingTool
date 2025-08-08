# Deployment Guide for KlingTool

## Vấn đề với GitHub Pages

GitHub Pages chỉ hỗ trợ static files (HTML, CSS, JS) và **không thể chạy Node.js server**. Đó là lý do bạn gặp lỗi "405 Method Not Allowed" khi cố gắng gọi API.

## Giải pháp: Frontend + Backend riêng biệt

### 1. Frontend (GitHub Pages)
- Deploy các file trong thư mục `public/` lên GitHub Pages
- Chỉ chứa HTML, CSS, JavaScript

### 2. Backend (Server riêng)
- Deploy `server.js` lên một hosting service khác
- Có thể sử dụng: Heroku, Railway, Render, Vercel, etc.

## Cách setup:

### Bước 1: Deploy Backend
1. **Chọn hosting service**: Heroku, Railway, Render, etc.
2. **Upload server.js và package.json**
3. **Lấy URL của backend** (ví dụ: `https://klingtool-backend.herokuapp.com`)

### Bước 2: Cập nhật Frontend Config
1. Mở file `public/config.js`
2. Thay đổi `API_BASE_URL` trong production config:
```javascript
production: {
    API_BASE_URL: 'https://your-actual-backend-url.com', // Thay đổi URL này
    KLING_API_URL: 'https://api.klingai.com'
}
```

### Bước 3: Deploy Frontend lên GitHub Pages
1. Push code lên GitHub
2. Vào Settings > Pages
3. Chọn source là "Deploy from a branch"
4. Chọn branch `main` và folder `/public`

## Các hosting service cho backend:

### Heroku (Free tier đã bị loại bỏ)
- Có phí từ $7/tháng

### Railway
- Free tier: $5 credit/tháng
- Dễ deploy

### Render
- Free tier có sẵn
- Auto-deploy từ GitHub

### Vercel
- Free tier rộng rãi
- Hỗ trợ Node.js

## Ví dụ với Render:

1. **Tạo account trên Render.com**
2. **Connect GitHub repository**
3. **Tạo Web Service**
4. **Chọn repository và branch**
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. **Lấy URL** (ví dụ: `https://klingtool.onrender.com`)

## Cập nhật config cho production:

```javascript
// public/config.js
production: {
    API_BASE_URL: 'https://klingtool.onrender.com', // URL từ Render
    KLING_API_URL: 'https://api.klingai.com'
}
```

## Kiểm tra:
1. Deploy backend trước
2. Test API endpoint: `https://your-backend.com/api/test-kling`
3. Cập nhật config.js với URL backend
4. Deploy frontend lên GitHub Pages
5. Test toàn bộ flow

## Lưu ý:
- Backend cần có HTTPS để GitHub Pages có thể gọi API
- CORS có thể cần được cấu hình trên backend
- Environment variables (API keys) cần được set trên hosting service 