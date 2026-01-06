package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetectPictureDTO {
    private String camera_ip;
    private Integer frame_number;
    private List<FaceDTO> faces;
}
