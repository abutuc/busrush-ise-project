package ies.project.busrush.dto.crud;

import ies.project.busrush.dto.id.RouteIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BusCrudDto {
    private String id;
    private String registration;
    private String brand;
    private String model;
    private String deviceId;
    private RouteIdDto[] routesId;
}
