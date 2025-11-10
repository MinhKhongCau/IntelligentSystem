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
    
}
