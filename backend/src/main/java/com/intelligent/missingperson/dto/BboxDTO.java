package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BboxDTO {
    private int x;
    private int y;
    private int width;
    private int height;
}
