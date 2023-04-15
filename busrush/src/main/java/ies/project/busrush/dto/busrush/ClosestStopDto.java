package ies.project.busrush.dto.busrush;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClosestStopDto {
    private String id;
    private String designation;
    private Double[] position;
    private Double distance;
}