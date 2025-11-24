-- Insert sample CCTV cameras for testing
-- Make sure you have areas in the AREA table first

-- Insert sample cameras
INSERT INTO CCTV (name, status, stream_url, ip, port, latitude, longitude, camera_type, last_online, id_area)
VALUES 
('Camera 1 - Main Entrance', 'Active', 'rtsp://10.0.0.1:554/stream', '10.0.0.1', 554, 10.762622, 106.660172, 'IP Camera', NOW(), 1),
('Camera 2 - Parking Lot', 'Active', 'rtsp://10.0.0.2:554/stream', '10.0.0.2', 554, 10.763000, 106.661000, 'IP Camera', NOW(), 1),
('Camera 3 - Back Gate', 'Active', 'rtsp://10.0.0.3:554/stream', '10.0.0.3', 554, 10.762000, 106.659000, 'IP Camera', NOW(), 2),
('Camera 4 - Side Entrance', 'Active', 'rtsp://10.0.0.4:554/stream', '10.0.0.4', 554, 10.764000, 106.662000, 'IP Camera', NOW(), 2),
('Camera 5 - Reception', 'Online', 'rtsp://10.0.0.5:554/stream', '10.0.0.5', 554, 10.762800, 106.660500, 'Dome Camera', NOW(), 1);

-- Note: Adjust id_area values based on your actual AREA table data
-- You can check existing areas with: SELECT * FROM AREA;
