# 🎥 CCTV Monitor Component

Component React để xem video stream từ CCTV thông qua Kafka cho Police Dashboard.

## 📋 Features

- ✅ Real-time video streaming từ Kafka
- ✅ Auto-refresh stream status mỗi 3 giây
- ✅ Fullscreen mode
- ✅ Manual refresh stream
- ✅ Beautiful UI với Tailwind CSS
- ✅ Responsive design
- ✅ Status indicators (Connected/Waiting)
- ✅ Hover controls overlay

## 🚀 Cách Sử Dụng

### 1. Đảm Bảo Services Đang Chạy

```bash
# Khởi động Kafka và Video Streaming Service
cd /path/to/project
docker-compose -f docker-compose.dev.yml up -d zookeeper kafka video-streaming-service

# Hoặc khởi động video streaming service riêng
cd Intelligent
python app.py
```

### 2. Khởi Động Video Producer

```bash
# Từ webcam
cd Intelligent
python video_producer.py 0

# Từ file video
python video_producer.py /path/to/video.mp4
```

### 3. Truy Cập CCTV Monitor

Mở trình duyệt và truy cập:
```
http://localhost:3000/cctv-monitor
```

## 🔗 API Endpoints

Component sử dụng các endpoints sau:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:5001/video_feed` | GET | Video stream (MJPEG) |
| `http://localhost:5001/api/status` | GET | Stream status (JSON) |

## 🎨 UI Components

### Main Features

1. **Video Container**
   - Black background với rounded corners
   - Responsive width
   - Hover overlay với controls

2. **Control Buttons**
   - Refresh Stream: Reload video feed
   - Toggle Fullscreen: Enter/exit fullscreen mode

3. **Status Badge**
   - Green (animated pulse): Stream Active
   - Red: Stream Inactive

4. **Info Cards**
   - Kafka Topic
   - Kafka Server
   - Connection Status

5. **Instructions Panel**
   - Usage guidelines
   - Tips for better experience

## 🛠️ Customization

### Thay Đổi Video Stream URL

Sửa trong component:
```javascript
const VIDEO_STREAM_URL = 'http://your-server:5001';
```

### Thay Đổi Refresh Interval

Sửa interval trong useEffect:
```javascript
const interval = setInterval(checkStatus, 5000); // 5 seconds
```

### Thêm Multiple Camera Streams

Bạn có thể mở rộng component để hỗ trợ nhiều camera:

```javascript
const cameras = [
  { id: 1, name: 'Camera 1', url: 'http://localhost:5001/video_feed' },
  { id: 2, name: 'Camera 2', url: 'http://localhost:5002/video_feed' },
];
```

## 🔧 Troubleshooting

### Video không hiển thị

1. Kiểm tra video streaming service đang chạy:
```bash
curl http://localhost:5001/health
```

2. Kiểm tra Kafka đang chạy:
```bash
docker ps | grep kafka
```

3. Kiểm tra video producer đang stream:
```bash
# Xem logs
docker-compose -f docker-compose.dev.yml logs -f video-streaming-service
```

### Stream status luôn "Inactive"

1. Kiểm tra CORS settings trong Flask app
2. Kiểm tra network connectivity
3. Xem browser console để debug

### Fullscreen không hoạt động

- Đảm bảo browser hỗ trợ Fullscreen API
- Thử các browser khác (Chrome, Firefox)

## 📱 Responsive Design

Component tự động điều chỉnh layout cho:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎯 Integration với Police Dashboard

Thêm link vào PoliceDashboard.jsx:

```jsx
<Link 
  to="/cctv-monitor"
  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
>
  📹 View CCTV
</Link>
```

## 🔐 Security Notes

- Component được bảo vệ bởi ProtectedRoute
- Chỉ Police role mới có thể truy cập
- Video stream không được cache
- HTTPS nên được sử dụng trong production

## 📊 Performance

- Video stream: ~30 FPS
- Status check: Every 3 seconds
- Minimal re-renders với React hooks
- Efficient image loading với key prop

## 🚀 Future Enhancements

- [ ] Multiple camera grid view
- [ ] Recording functionality
- [ ] Snapshot capture
- [ ] Motion detection alerts
- [ ] Playback controls
- [ ] Camera selection dropdown
- [ ] Zoom controls
- [ ] PTZ (Pan-Tilt-Zoom) controls

## 📝 License

MIT License
