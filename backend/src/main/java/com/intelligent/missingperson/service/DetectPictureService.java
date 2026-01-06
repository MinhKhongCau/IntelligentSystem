package com.intelligent.missingperson.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intelligent.missingperson.dto.BboxDTO;
import com.intelligent.missingperson.dto.DetectPictureDTO;
import com.intelligent.missingperson.dto.FaceDTO;
import com.intelligent.missingperson.dto.CctvReportDTO;
import com.intelligent.missingperson.entity.Cctv;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DetectPictureService {

    private final PictureService pictureService;

    /**
     * Resolve detect picture for a report by: 1) storing base64 if provided; 2) fetching
     * frame image from the video server using the frame number in detail.
     * Returns stored path (e.g. /uploads/...) or null if none available.
     */
    public String resolveDetectPicture(CctvReportDTO r, Cctv cctv) {
        // 1) If detectPicture present and looks like base64, try store
        String detectPic = r.getDetectPicture();
        if (detectPic != null && !detectPic.isEmpty()) {
            try {
                String stored = pictureService.storeBase64Image(detectPic);
                if (stored != null) return stored;
            } catch (Exception ignored) {
            }
        }

        // 2) Otherwise parse detail to extract frame_number and bbox
        if (r.getDetail() == null || r.getDetail().isEmpty()) return null;

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = null;
            try {
                root = mapper.readTree(r.getDetail());
            } catch (Exception pe) {
                root = null;
            }

            if (root == null) return null;

            int frameNumber = -1;
            if (root.has("frame_number")) frameNumber = root.path("frame_number").asInt(-1);
            else if (root.has("frameNumber")) frameNumber = root.path("frameNumber").asInt(-1);

            if (frameNumber < 0) return null;

            // build face list with bbox and confidence
            JsonNode bboxNode = root.path("bbox");
            BboxDTO bbox = null;
            if (bboxNode != null && !bboxNode.isMissingNode()) {
                int x = bboxNode.path("x").asInt(0);
                int y = bboxNode.path("y").asInt(0);
                int w = bboxNode.path("width").asInt(0);
                int h = bboxNode.path("height").asInt(0);
                bbox = new BboxDTO(x, y, w, h);
            }

            Double confidence = null;
            if (root.has("confidence")) confidence = root.path("confidence").asDouble();
            else if (root.has("confident")) confidence = root.path("confident").asDouble();

            FaceDTO face = new FaceDTO(bbox, confidence, null);
            List<FaceDTO> faces = Collections.singletonList(face);

            String cameraIp = r.getCctvIp();
            if ((cameraIp == null || cameraIp.isEmpty()) && cctv != null) cameraIp = cctv.getIp();

            DetectPictureDTO dto = new DetectPictureDTO(cameraIp, frameNumber, faces);

            // POST to video server
            String videoServer = System.getenv().getOrDefault("VIDEO_STREAM_URL", "http://video-streaming-service:5001");
            String url = videoServer + "/api/detection/frame-image";

            SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
            requestFactory.setConnectTimeout(3000);
            requestFactory.setReadTimeout(5000);
            RestTemplate rest = new RestTemplate(requestFactory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<DetectPictureDTO> httpEntity = new HttpEntity<>(dto, headers);

            ResponseEntity<byte[]> resp = rest.exchange(url, HttpMethod.POST, httpEntity, byte[].class);
            if (resp.getStatusCode().is2xxSuccessful()) {
                byte[] imgBytes = resp.getBody();
                if (imgBytes != null && imgBytes.length > 0) {
                    String contentType = resp.getHeaders().getContentType() != null ? resp.getHeaders().getContentType().toString() : null;
                    String ext = ".jpg";
                    if (contentType != null) {
                        if (contentType.contains("png")) ext = ".png";
                        else if (contentType.contains("jpeg") || contentType.contains("jpg")) ext = ".jpg";
                    }
                    return pictureService.storeBytesImage(imgBytes, ext);
                }
            }
        } catch (Exception e) {
            System.err.println("DetectPictureService error: " + e.getMessage());
        }

        return null;
    }
}
