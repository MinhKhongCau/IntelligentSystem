package com.intelligent.missingperson.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.intelligent.missingperson.service.PictureService;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    PictureService pictureService;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }

        String response = pictureService.storeImageFile(file); // The URL path the frontend can use

        return ResponseEntity.ok(response);

    }
}
