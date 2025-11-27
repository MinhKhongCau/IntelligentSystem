# Video Streaming Microservice

A Python microservice that streams video through Kafka and provides an HTTP endpoint for police to view real-time CCTV footage.

## Features

- 📹 Real-time video streaming via Kafka
- 🌐 Web-based video player accessible via HTTP
- 🚔 Police monitoring dashboard
- 🔄 Support for multiple video sources (webcam, video files)
- 📊 Stream status monitoring
- 🎯 Low latency streaming

## Architecture

```
Video Source (Camera/File) → Kafka Producer → Kafka Topic → Kafka Consumer → Flask Web Server → Police Browser
```

## Prerequisites

- Python 3.10+
- Kafka (or use Docker Compose)
- OpenCV
- Webcam or video file

## Installation

### Option 1: Local Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start Kafka (if not already running):
```bash
# Using Docker
docker-compose up -d zookeeper kafka
```

3. Start the video streaming service:
```bash
python app.py
```

4. Start the video producer (in another terminal):
```bash
# From webcam
python video_producer.py 0

# From video file
python video_producer.py /path/to/video.mp4
```

### Option 2: Docker Setup

1. Build and start all services:
```bash
docker-compose up --build
```

2. Start the video producer (on host machine):
```bash
python video_producer.py 0
```

## Usage

### Access the Video Stream

Open your browser and navigate to:
```
http://localhost:5001
```

You'll see:
- Real-time video stream
- Stream status indicator
- Fullscreen mode
- Refresh controls

### API Endpoints

- `GET /` - Main video monitoring dashboard
- `GET /video_feed` - Video stream endpoint (MJPEG)
- `GET /api/status` - Stream status (JSON)
- `GET /health` - Health check

### Video Producer Options

```bash
# Stream from default webcam (camera 0)
python video_producer.py

# Stream from specific camera
python video_producer.py 1

# Stream from video file (with loop)
python video_producer.py /path/to/video.mp4
```


## Flow

┌─────────────────────────────────────────────────────────────┐
│                      MAIN THREAD (Flask)                    │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │  Video Feed    │  │  Search API    │  │  Compare API  │  │
│  │  (read frames) │  │  (process)     │  │  (process)    │  │
│  └────────┬───────┘  └────────────────┘  └───────────────┘  │
│           │ read (non-blocking)                             │
└───────────┼─────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────┐
│                    SHARED MEMORY (Locks)                  │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │  current_frame   │  │  camera_frames[ip]           │   │
│  └────────▲─────────┘  └────────▲─────────────────────┘   │
└───────────┼─────────────────────┼─────────────────────────┘
            │ write               │ write
            │                     │
┌───────────┴──────────┐  ┌───────┴──────────────────────┐
│  BACKGROUND THREAD   │  │  BACKGROUND THREADS          │
│  Default Consumer    │  │  Camera Consumers            │
│  (Kafka → frames)    │  │  (Kafka → frames)            │
└──────────────────────┘  └──────────────────────────────┘



## Configuration

Edit the following variables in `app.py`:

```python
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'  # Kafka server address
KAFKA_TOPIC = 'video-stream'                # Kafka topic name
```

Edit the following in `video_producer.py`:

```python
fps = 30  # Frames per second
```

## Kafka Topic

The service uses the `video-stream` topic. Create it manually if needed:

```bash
kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic video-stream \
  --partitions 1 \
  --replication-factor 1
```

## Integration with Police System

### Backend Integration (Java Spring Boot)

Add a proxy endpoint in your Spring Boot application:

```java
@RestController
@RequestMapping("/api/cctv")
public class CCTVController {
    
    @GetMapping("/stream")
    public ResponseEntity<String> getStreamUrl() {
        return ResponseEntity.ok("http://localhost:5001/video_feed");
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getStreamStatus() {
        // Call http://localhost:5001/api/status
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity("http://localhost:5001/api/status", Map.class);
    }
}
```

### Frontend Integration (React)

```jsx
import React from 'react';

const CCTVMonitor = () => {
  return (
    <div className="cctv-container">
      <h2>CCTV Live Feed</h2>
      <img 
        src="http://localhost:5001/video_feed" 
        alt="CCTV Stream"
        style={{ width: '100%', maxWidth: '960px' }}
      />
    </div>
  );
};

export default CCTVMonitor;
```

## Performance Tuning

### Reduce Latency

1. Adjust JPEG quality in `video_producer.py`:
```python
cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 60])  # Lower quality = faster
```

2. Reduce frame size:
```python
frame = cv2.resize(frame, (320, 240))  # Smaller resolution
```

3. Reduce FPS:
```python
producer.stream_from_camera(camera_id=0, fps=15)  # Lower FPS
```

### Handle Multiple Streams

Create multiple topics for different cameras:

```python
# Camera 1
producer1 = VideoProducer(topic='camera-1')
producer1.stream_from_camera(camera_id=0)

# Camera 2
producer2 = VideoProducer(topic='camera-2')
producer2.stream_from_camera(camera_id=1)
```

## Troubleshooting

### No video appears

1. Check Kafka is running:
```bash
docker ps | grep kafka
```

2. Check if producer is sending frames:
```bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic video-stream
```

3. Check service logs:
```bash
docker-compose logs video-streaming-service
```

### Camera not found

```bash
# List available cameras
ls /dev/video*

# Test camera
python -c "import cv2; cap = cv2.VideoCapture(0); print(cap.isOpened())"
```

### Kafka connection issues

Update `KAFKA_ADVERTISED_LISTENERS` in docker-compose.yml:
```yaml
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9092
```

## Security Considerations

For production deployment:

1. Add authentication to Flask endpoints
2. Use HTTPS/TLS for video streaming
3. Implement Kafka security (SASL/SSL)
4. Add rate limiting
5. Restrict CORS origins

## License

MIT License
