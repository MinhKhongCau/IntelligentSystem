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

### 2. Chuẩn Bị Video Files

Đặt các file video vào thư mục `Intelligent/video/` với tên theo format IP address:

```bash
cd Intelligent
mkdir -p video

# Copy video files với tên theo IP
cp /path/to/your/video.mp4 video/10.0.0.2.mp4
cp /path/to/another/video.mp4 video/192.168.1.100.mp4
```

**Lưu ý:** Tên file phải theo format `{IP_ADDRESS}.mp4` (ví dụ: `10.0.0.2.mp4`)

### 3. Khởi Động Camera Giả Lập (Simulation)

Có 2 cách để khởi động camera:

#### Cách 1: Sử dụng API (Khuyến nghị)

Sử dụng Postman hoặc curl để gọi API:

**Start Camera:**
```bash
# Postman
POST http://localhost:5001/api/camera/start
Content-Type: application/json

{
  "ip": "10.0.0.2"
}

# hoặc dùng curl
curl -X POST http://localhost:5001/api/camera/start \
  -H "Content-Type: application/json" \
  -d '{"ip": "10.0.0.2"}'
```

**Stop Camera:**
```bash
POST http://localhost:5001/api/camera/stop
Content-Type: application/json

{
  "ip": "10.0.0.2"
}
```

**List Active Cameras:**
```bash
GET http://localhost:5001/api/camera/list
```

**Check Camera Status:**
```bash
GET http://localhost:5001/api/camera/status/10.0.0.2
```

#### Cách 2: Chạy Video Producer Trực Tiếp

```bash
# Từ webcam
cd Intelligent
python video_producer.py 0

# Từ file video
python video_producer.py /path/to/video.mp4
```

### 4. Truy Cập CCTV Monitor

Mở trình duyệt và truy cập:
```
http://localhost:3000/police/cctv-monitor
```

Trong giao diện CCTV Monitor:
1. Các camera đang chạy sẽ hiển thị trong danh sách
2. Click vào camera card để xem live stream trong cửa sổ mới
3. Sử dụng chức năng search để tìm người mất tích trong video

## 🔗 API Endpoints

### Video Streaming Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:5001/video_feed` | GET | Default video stream (MJPEG) |
| `http://localhost:5001/video_feed/{camera_ip}` | GET | Specific camera stream (MJPEG) |
| `http://localhost:5001/api/status` | GET | Stream status (JSON) |

### Camera Management Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/camera/start` | POST | Start camera stream | `{"ip": "10.0.0.2"}` |
| `/api/camera/stop` | POST | Stop camera stream | `{"ip": "10.0.0.2"}` |
| `/api/camera/list` | GET | List all active cameras | - |
| `/api/camera/status/{ip}` | GET | Get specific camera status | - |
| `/api/streams/active` | GET | List active stream connections | - |

### Person Search Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/search/person-in-video` | POST | Search person in video | FormData: `image`, `camera_ip`, `threshold` |
| `/api/detection/frame-image` | POST | Get frame with bounding boxes | JSON: `camera_ip`, `frame_number`, `faces[]` |
| `/api/compare-faces` | POST | Compare two face images | FormData: `image1`, `image2`, `threshold` |

### Example API Calls

**Start Camera:**
```bash
curl -X POST http://localhost:5001/api/camera/start \
  -H "Content-Type: application/json" \
  -d '{"ip": "10.0.0.2"}'
```

**Search Person in Video:**
```bash
curl -X POST http://localhost:5001/api/search/person-in-video \
  -F "image=@/path/to/person.jpg" \
  -F "camera_ip=10.0.0.2" \
  -F "threshold=0.6"
```

**Get Detection Frame:**
```bash
curl -X POST http://localhost:5001/api/detection/frame-image \
  -H "Content-Type: application/json" \
  -d '{
    "camera_ip": "10.0.0.2",
    "frame_number": 150,
    "faces": [
      {
        "bbox": {"x": 100, "y": 50, "width": 80, "height": 100},
        "confidence": 95.5,
        "label": "John Doe"
      }
    ]
  }' \
  --output frame.jpg
```

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

3. Kiểm tra camera đã được start:
```bash
curl http://localhost:5001/api/camera/list
```

4. Kiểm tra file video tồn tại:
```bash
ls -la Intelligent/video/
# Phải có file: 10.0.0.2.mp4 (hoặc IP tương ứng)
```

5. Xem logs của video streaming service:
```bash
# Nếu chạy bằng Docker
docker-compose -f docker-compose.dev.yml logs -f video-streaming-service

# Nếu chạy trực tiếp
# Xem terminal đang chạy python app.py
```

### Camera không start được

**Lỗi: "Video file not found"**
- Đảm bảo file video tồn tại tại `Intelligent/video/{IP}.mp4`
- Kiểm tra tên file đúng format (ví dụ: `10.0.0.2.mp4`)

**Lỗi: "Camera already running"**
- Camera đã được start trước đó
- Stop camera trước khi start lại:
```bash
curl -X POST http://localhost:5001/api/camera/stop \
  -H "Content-Type: application/json" \
  -d '{"ip": "10.0.0.2"}'
```

### Stream status luôn "Inactive"

1. Kiểm tra CORS settings trong Flask app
2. Kiểm tra network connectivity
3. Xem browser console để debug
4. Đảm bảo camera đã được start qua API

### Search không tìm thấy kết quả

1. Kiểm tra threshold (giảm xuống 0.5 hoặc 0.4 để dễ match hơn)
2. Đảm bảo ảnh upload có chứa khuôn mặt rõ ràng
3. Video phải có người xuất hiện
4. Kiểm tra logs để xem quá trình xử lý

### Fullscreen không hoạt động

- Đảm bảo browser hỗ trợ Fullscreen API
- Thử các browser khác (Chrome, Firefox)
- Kiểm tra browser permissions

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

## � Camerra Simulation Workflow

### Quy Trình Hoàn Chỉnh

1. **Chuẩn bị video files:**
   ```bash
   cd Intelligent
   mkdir -p video
   cp your_video.mp4 video/10.0.0.2.mp4
   ```

2. **Start video streaming service:**
   ```bash
   python app.py
   # Service chạy tại http://localhost:5001
   ```

3. **Start camera qua API:**
   ```bash
   # Postman hoặc curl
   POST http://localhost:5001/api/camera/start
   Body: {"ip": "10.0.0.2"}
   ```

4. **Verify camera đang chạy:**
   ```bash
   GET http://localhost:5001/api/camera/list
   # Response sẽ show camera với status "running"
   ```

5. **Xem live stream:**
   - Truy cập: `http://localhost:3000/police/cctv-monitor`
   - Click vào camera card
   - Stream sẽ mở trong cửa sổ mới

6. **Search person trong video:**
   - Upload ảnh người cần tìm
   - Chọn camera
   - Điều chỉnh threshold
   - Click "Start Search"

7. **Stop camera khi không dùng:**
   ```bash
   POST http://localhost:5001/api/camera/stop
   Body: {"ip": "10.0.0.2"}
   ```

### Multiple Cameras Setup

Để chạy nhiều camera cùng lúc:

```bash
# Chuẩn bị video files
cp video1.mp4 video/10.0.0.2.mp4
cp video2.mp4 video/10.0.0.3.mp4
cp video3.mp4 video/192.168.1.100.mp4

# Start từng camera
curl -X POST http://localhost:5001/api/camera/start \
  -H "Content-Type: application/json" \
  -d '{"ip": "10.0.0.2"}'

curl -X POST http://localhost:5001/api/camera/start \
  -H "Content-Type: application/json" \
  -d '{"ip": "10.0.0.3"}'

curl -X POST http://localhost:5001/api/camera/start \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100"}'

# Verify tất cả cameras
curl http://localhost:5001/api/camera/list
```

## 🚀 Future Enhancements

- [x] Multiple camera support
- [x] Person search in video
- [x] Face detection with bounding boxes
- [x] Camera management API
- [ ] Multiple camera grid view
- [ ] Recording functionality
- [ ] Snapshot capture
- [ ] Motion detection alerts
- [ ] Playback controls with timeline
- [ ] Camera selection dropdown
- [ ] Zoom controls
- [ ] PTZ (Pan-Tilt-Zoom) controls
- [ ] Real-time alerts for missing persons
- [ ] Export detection results to PDF

## 📝 License

MIT License
