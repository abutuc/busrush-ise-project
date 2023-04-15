package ies.project.busrush.dto.crud;

import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.dto.id.ScheduleIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteCrudDto {
    private RouteIdDto id;
    private String designation;
    private String driverId;
    private String busId;
    private ScheduleIdDto[] schedulesId;
}
