package ies.project.busrush.dto.basic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BusBasicDto {
    private String id;
    private String registration;
    private String brand;
    private String model;
}
