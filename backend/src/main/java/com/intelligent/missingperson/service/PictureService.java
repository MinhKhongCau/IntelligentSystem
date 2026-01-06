package com.intelligent.missingperson.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PictureService {

    public String storeImageFile(MultipartFile image) {
        String savedImagePath = null;
        if (image != null && !image.isEmpty()) {
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String ext = "";
            String original = image.getOriginalFilename();
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = "missing_" + UUID.randomUUID() + ext;
            File target = new File(uploadDir, filename);
            try {
                Files.copy(image.getInputStream(), target.toPath(), StandardCopyOption.REPLACE_EXISTING);
                savedImagePath = "/uploads/" + filename;
                // override DTO value
                return savedImagePath;
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
        return "Some error occurred while uploading the image.";
    }
    
    public String storeBase64Image(String base64Data) {
        if (base64Data == null || base64Data.isEmpty()) return null;
        try {
            String base = base64Data;
            String ext = ".jpg";
            // If data URI, extract mime and data
            if (base.startsWith("data:")) {
                int semi = base.indexOf(';');
                if (semi > 0) {
                    String mime = base.substring(5, semi);
                    if (mime.contains("/")) {
                        String suffix = mime.substring(mime.indexOf('/') + 1);
                        if (suffix.equals("jpeg")) suffix = "jpg";
                        ext = "." + suffix;
                    }
                }
                int comma = base.indexOf(',');
                base = base.substring(comma + 1);
            }
    
            byte[] data = java.util.Base64.getDecoder().decode(base);
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();
            String filename = "cctv_" + UUID.randomUUID() + ext;
            File target = new File(uploadDir, filename);
            Files.write(target.toPath(), data);
            return "/uploads/" + filename;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String storeBytesImage(byte[] data, String ext) {
        if (data == null || data.length == 0) return null;
        try {
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();
            String filename = "cctv_" + UUID.randomUUID() + (ext != null ? ext : ".jpg");
            File target = new File(uploadDir, filename);
            Files.write(target.toPath(), data);
            return "/uploads/" + filename;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

