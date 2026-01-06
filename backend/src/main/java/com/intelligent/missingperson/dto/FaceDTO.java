package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceDTO {
    private BboxDTO bbox;
    private Double confidence;
    private String label;
}
