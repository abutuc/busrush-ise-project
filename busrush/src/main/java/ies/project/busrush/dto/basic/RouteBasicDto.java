package ies.project.busrush.dto.basic;

import ies.project.busrush.dto.id.RouteIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteBasicDto {
    private String id;
    private String designation;
}
